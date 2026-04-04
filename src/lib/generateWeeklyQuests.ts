// src/lib/generateWeeklyQuests.ts
// Shared quest generation logic used by both generate-week and select-class APIs
import { prisma } from "./prisma";
import { questBank, calculateXP, QuestTemplate } from "./questBank";

type PlayerInput = {
  id: string;
  level: number;
  currentWeek: number;
  weekStartDate: Date | null;
  playerClass: string | null;
};

type OnboardingInput = {
  availableTime: string;
  fitnessExperience: string;
  workoutPreference: string;
} | null;

export async function generateWeeklyQuests(
  userId: string,
  player: PlayerInput,
  onboardingData: OnboardingInput
) {
  // Удаляем все старые квесты одним запросом
  await prisma.quest.deleteMany({ where: { userId } });

  // Парсим предпочтения
  let workoutPreferences: string[] = [];
  if (onboardingData?.workoutPreference) {
    try {
      workoutPreferences =
        typeof onboardingData.workoutPreference === "string"
          ? JSON.parse(onboardingData.workoutPreference)
          : onboardingData.workoutPreference ?? [];
    } catch {
      workoutPreferences = [];
    }
  }

  const weekNumber = player.currentWeek;
  const playerLevel = player.level;

  const availableTime = (onboardingData?.availableTime ?? "30").toLowerCase();
  const experienceLevel = (onboardingData?.fitnessExperience ?? "средний").toLowerCase();
  const isBeginnerExperience =
    experienceLevel.includes("начинающий") || experienceLevel.includes("новичок");

  // Сложности на основе уровня
  let baseDifficulties: ("easy" | "medium" | "hard")[];
  if (playerLevel <= 5) {
    baseDifficulties = ["easy", "easy", "easy"];
  } else if (playerLevel <= 8) {
    baseDifficulties = isBeginnerExperience
      ? ["easy", "easy", "medium"]
      : ["easy", "medium", "medium"];
  } else if (playerLevel <= 13) {
    baseDifficulties = isBeginnerExperience
      ? ["easy", "medium", "medium"]
      : ["medium", "medium", "hard"];
  } else if (playerLevel <= 19) {
    baseDifficulties = isBeginnerExperience
      ? ["medium", "medium", "hard"]
      : ["medium", "hard", "hard"];
  } else {
    baseDifficulties = isBeginnerExperience
      ? ["medium", "hard", "hard"]
      : ["hard", "hard", "hard"];
  }

  const categoryPoolByClass: Record<string, string[]> = {
    warrior:   ["strength", "strength", "strength", "strength", "cardio", "cardio", "flexibility"],
    berserker: ["strength", "strength", "strength", "cardio", "cardio", "cardio", "cardio"],
    scout:     ["cardio", "cardio", "cardio", "cardio", "strength", "flexibility", "flexibility"],
    monk:      ["flexibility", "flexibility", "flexibility", "wellness", "wellness", "cardio", "cardio"],
  };
  const categoryPool =
    categoryPoolByClass[player.playerClass ?? "warrior"] ??
    ["strength", "cardio", "flexibility", "wellness", "strength", "cardio", "flexibility"];
  const pickCategory = (idx: number): string => categoryPool[idx % categoryPool.length];

  const requiresEquipment = (quest: QuestTemplate): boolean => {
    if (quest.location) return quest.location === "gym";
    const text = (quest.title + " " + quest.description).toLowerCase();
    return ["штанг", "гантел", "тренажер", "гир", "скамь", "турник", "брус", "блок", "bench", "bar"]
      .some((kw) => text.includes(kw));
  };

  const isSimilarQuest = (title1: string, title2: string): boolean => {
    if (title1.toLowerCase() === title2.toLowerCase()) return true;
    const words1 = title1.toLowerCase().split(" ");
    const words2 = title2.toLowerCase().split(" ");
    const exerciseKeywords = [
      "планка", "отжимания", "приседания", "выпады", "подтягивания",
      "бег", "ходьба", "прыжки", "берпи", "скручивания", "пресс",
      "велосипед", "плавание", "растяжка", "йога", "медитация",
    ];
    for (const kw of exerciseKeywords) {
      const in1 = words1.some((w) => w.includes(kw) || kw.includes(w));
      const in2 = words2.some((w) => w.includes(kw) || kw.includes(w));
      if (in1 && in2) return true;
    }
    return words1.filter((w) => w.length > 3 && words2.includes(w)).length >= 2;
  };

  const questsPerLocation = 6;

  // Собираем все квесты в памяти — ноль DB-вызовов в цикле
  const questsToCreate: {
    userId: string; title: string; description: string | null; instructions: string | null;
    tip: string | null; xpReward: number; difficulty: string; category: string;
    status: string; isGenerated: boolean; nodeId: string; location: string;
    showInAllMode: boolean; visualDemo: string | null; stepByStep: string | null;
  }[] = [];

  for (let day = 1; day <= 7; day++) {
    const nodeId = `node-${day}`;
    const dayQuestTitles: string[] = [];
    let dayHomeCount = 0;
    let dayGymCount = 0;

    const getDayDifficulties = (): ("easy" | "medium" | "hard")[] => {
      if (day <= 2) {
        return baseDifficulties.map((d) => (d === "hard" ? "medium" : d)) as ("easy" | "medium" | "hard")[];
      } else if (day <= 5) {
        return baseDifficulties;
      } else {
        if (playerLevel <= 8) return baseDifficulties;
        return baseDifficulties.map((d) => {
          if (d === "easy") return "medium";
          if (d === "medium" && baseDifficulties.filter((x) => x === "medium").length > 1) return "hard";
          return d;
        }) as ("easy" | "medium" | "hard")[];
      }
    };

    const dayDifficulties = getDayDifficulties();

    const pickQuest = (locationType: "home" | "gym", questIndex: number): void => {
      const difficulty = dayDifficulties[questIndex % dayDifficulties.length];
      let available: QuestTemplate[] = [];

      if (locationType === "gym") {
        const primaryCat = pickCategory(questIndex);
        const primary = (questBank[primaryCat] || []).filter(
          (q) =>
            requiresEquipment(q) &&
            q.difficulty === difficulty &&
            !dayQuestTitles.some((t) => isSimilarQuest(q.title, t))
        );
        if (primary.length > 0) available = primary;
      }

      if (available.length === 0) {
        for (const cat of Object.keys(questBank)) {
          available.push(
            ...(questBank[cat] || []).filter((q) => {
              const isGym = requiresEquipment(q);
              return (
                (locationType === "gym" ? isGym : !isGym) &&
                q.difficulty === difficulty &&
                !dayQuestTitles.some((t) => isSimilarQuest(q.title, t))
              );
            })
          );
        }
      }

      if (available.length === 0) {
        for (const cat of Object.keys(questBank)) {
          available.push(
            ...(questBank[cat] || []).filter((q) => {
              const isGym = requiresEquipment(q);
              return (
                (locationType === "gym" ? isGym : !isGym) &&
                !dayQuestTitles.some((t) => isSimilarQuest(q.title, t))
              );
            })
          );
        }
      }

      if (available.length === 0) return;

      const selected = available[Math.floor(Math.random() * available.length)];
      dayQuestTitles.push(selected.title);

      const xpReward = calculateXP(selected.baseXP, playerLevel, weekNumber);
      const currentCount = locationType === "home" ? dayHomeCount : dayGymCount;
      const showInAllMode = currentCount < 3;

      questsToCreate.push({
        userId,
        title: selected.title,
        description: selected.description ?? null,
        instructions: selected.instructions ?? null,
        tip: selected.tip ?? null,
        xpReward,
        difficulty: selected.difficulty,
        category: selected.category,
        status: "pending",
        isGenerated: true,
        nodeId,
        location: locationType,
        showInAllMode,
        visualDemo: selected.visualDemo ? JSON.stringify(selected.visualDemo) : null,
        stepByStep: selected.stepByStep ? JSON.stringify(selected.stepByStep) : null,
      });

      if (locationType === "home") dayHomeCount++;
      else dayGymCount++;
    };

    for (let i = 0; i < questsPerLocation; i++) pickQuest("home", i);
    for (let i = 0; i < questsPerLocation; i++) pickQuest("gym", questsPerLocation + i);
  }

  // Один createMany вместо 84 отдельных create
  await prisma.quest.createMany({ data: questsToCreate });

  // Обновляем игрока
  await prisma.player.update({
    where: { id: player.id },
    data: {
      lastQuestGenerated: new Date(),
      weekStartDate: player.weekStartDate || new Date(),
    },
  });

  // Один SELECT чтобы вернуть созданные квесты
  const quests = await prisma.quest.findMany({
    where: { userId },
    orderBy: [{ nodeId: "asc" }, { location: "asc" }],
  });

  return quests;
}
