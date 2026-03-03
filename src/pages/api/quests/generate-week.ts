// src/pages/api/quests/generate-week.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "../../../lib/prisma";
import { questBank, calculateXP, QuestTemplate } from "../../../lib/questBank";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getAuthSession(req, res);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        player: {
          include: {
            onboardingData: true,
          },
        },
      },
    });

    if (!user || !user.player) {
      return res.status(404).json({ error: "User or player not found" });
    }

    const player = user.player;
    const onboardingData = player.onboardingData;

    // onboardingData больше не обязателен — класс игрока теперь главный источник данных
    // Если onboardingData нет, продолжаем с дефолтами

    // Удаляем все старые квесты текущей недели
    await prisma.quest.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Парсим предпочтения пользователя
    let workoutPreferences: string[] = [];
    if (onboardingData) {
      try {
        const od = onboardingData;
        workoutPreferences =
          typeof od.workoutPreference === "string"
            ? JSON.parse(od.workoutPreference)
            : od.workoutPreference ?? [];
      } catch (e) {
        workoutPreferences = [];
      }
    }

    // Определяем предпочтение по location на основе workoutPreference
    let locationPreference: "home" | "gym" | "both" = "both";

    // Проверяем, включает ли workoutPreference домашние тренировки
    const hasHomeWorkouts = workoutPreferences.some(
      (pref) =>
        pref.toLowerCase().includes("дом") ||
        pref.toLowerCase().includes("home")
    );

    // Проверяем, есть ли "зальные" тренировки (силовые, кроссфит и т.д.)
    const hasGymWorkouts = workoutPreferences.some(
      (pref) =>
        pref.toLowerCase().includes("сил") ||
        pref.toLowerCase().includes("кроссфит") ||
        pref.toLowerCase().includes("групповые")
    );

    // Если только домашние - home, только зальные - gym, оба или ничего - both
    if (hasHomeWorkouts && !hasGymWorkouts) {
      locationPreference = "home";
    } else if (hasGymWorkouts && !hasHomeWorkouts) {
      locationPreference = "gym";
    } else {
      locationPreference = "both";
    }

    console.log(
      `📍 Предпочтение по локации: ${locationPreference} (на основе: ${workoutPreferences.join(
        ", "
      )})`
    );

    // Маппинг предпочтений на категории
    const categoryMapping: Record<string, string> = {
      "Силовые тренировки": "strength",
      "Кардио-тренировки": "cardio",
      "Йога и растяжка": "flexibility",
      "Функциональные тренировки": "strength",
      Плавание: "cardio",
      Бег: "cardio",
      Велоспорт: "cardio",
    };

    const questCategories: string[] = workoutPreferences
      .map((pref) => categoryMapping[pref])
      .filter((cat) => cat !== undefined);

    if (questCategories.length === 0) {
      questCategories.push("strength", "cardio", "flexibility");
    }

    // Прогрессивная система: количество квестов растет с каждой неделей
    const weekNumber = player.currentWeek;

    // ФИКСИРОВАННОЕ количество упражнений с МЯГКОЙ корректировкой по времени из опросника
    // Базово 7 упражнений, но можно немного уменьшить для людей с малым временем
    let exercisesPerDay = 7;

    // Мягкая фильтрация по времени из опросника (не сильно меняет комплекс)
    const availableTime = (onboardingData?.availableTime ?? "30").toLowerCase();
    if (availableTime.includes("15") || availableTime.includes("20")) {
      exercisesPerDay = 6;
      console.log(`⏱️ Доступно мало времени (${availableTime}) - 6 упражнений`);
    } else if (availableTime.includes("30") || availableTime.includes("45")) {
      exercisesPerDay = 7;
      console.log(`⏱️ Оптимальное время (${availableTime}) - 7 упражнений`);
    } else if (
      availableTime.includes("60") ||
      availableTime.includes("90") ||
      availableTime.includes("час")
    ) {
      exercisesPerDay = 8;
      console.log(`⏱️ Много времени (${availableTime}) - 8 упражнений`);
    } else {
      console.log(`💪 Генерирую комплексы: ${exercisesPerDay} упражнений на каждый день`);
    }

    // Фиксируем 6 квестов для каждого режима
    const questsPerLocation = 6; // 6 домашних и 6 залных
    const questsPerDay = questsPerLocation * 2; // Всего 12 квестов на день
    const questsInAllMode = questsPerLocation; // В режиме "Все" показываем 6 квестов (3 дома + 3 в зале)

    console.log(
      `🎯 Генерируем ${questsPerDay} квестов на день: ${questsPerLocation} домашних + ${questsPerLocation} залных`
    );
    console.log(
      `📍 В режиме "Все" будет показано ${questsInAllMode} квестов (${questsInAllMode / 2} дома + ${questsInAllMode / 2} в зале)`
    );

    // Определяем базовую сложность на основе УРОВНЯ ИГРОКА (а не недели)
    const playerLevel = player.level;
    // Используем fitnessExperience из onboardingData если оно есть, иначе дефолт
    const experienceLevel = onboardingData?.fitnessExperience?.toLowerCase() ?? "средний";
    const isBeginnerExperience =
      experienceLevel.includes("начинающий") ||
      experienceLevel.includes("новичок");

    let baseDifficulties: ("easy" | "medium" | "hard")[] = [];

    // УРОВЕНЬ 1-5: Только легкие квесты
    if (playerLevel <= 5) {
      baseDifficulties = ["easy", "easy", "easy"];
      console.log(`📊 Уровень ${playerLevel}: Новичок - только легкие квесты`);
    }
    // УРОВЕНЬ 6-8: Переход к средним
    else if (playerLevel <= 8) {
      if (isBeginnerExperience) {
        baseDifficulties = ["easy", "easy", "medium"]; // Начинающие: больше легких
      } else {
        baseDifficulties = ["easy", "medium", "medium"]; // Опытные быстрее
      }
      console.log(`📊 Уровень ${playerLevel}: Начинающий - легкие + средние`);
    }
    // УРОВЕНЬ 9-13: Средняя сложность
    else if (playerLevel <= 13) {
      if (isBeginnerExperience) {
        baseDifficulties = ["easy", "medium", "medium"];
      } else {
        baseDifficulties = ["medium", "medium", "hard"];
      }
      console.log(`📊 Уровень ${playerLevel}: Продолжающий - средние квесты`);
    }
    // УРОВЕНЬ 14-19: Сложные квесты
    else if (playerLevel <= 19) {
      if (isBeginnerExperience) {
        baseDifficulties = ["medium", "medium", "hard"];
      } else {
        baseDifficulties = ["medium", "hard", "hard"];
      }
      console.log(`📊 Уровень ${playerLevel}: Продвинутый - средние + сложные`);
    }
    // УРОВЕНЬ 20+: В основном сложные
    else {
      if (isBeginnerExperience) {
        baseDifficulties = ["medium", "hard", "hard"];
      } else {
        baseDifficulties = ["hard", "hard", "hard"];
      }
      console.log(`📊 Уровень ${playerLevel}: Опытный - сложные квесты`);
    }

    // Убираем дополнительную прогрессию, т.к. теперь прогрессия встроена в логику выше
    const difficultyProgression = 0;

    // Пул категорий квестов на основе класса игрока
    const categoryPoolByClass: Record<string, string[]> = {
      warrior:   ["strength", "strength", "strength", "strength", "cardio", "cardio", "flexibility"],
      berserker: ["strength", "strength", "strength", "cardio", "cardio", "cardio", "cardio"],
      scout:     ["cardio", "cardio", "cardio", "cardio", "strength", "flexibility", "flexibility"],
      monk:      ["flexibility", "flexibility", "flexibility", "wellness", "wellness", "cardio", "cardio"],
    };
    const categoryPool = categoryPoolByClass[player.playerClass ?? "warrior"] ??
      ["strength", "cardio", "flexibility", "wellness", "strength", "cardio", "flexibility"];
    const pickCategory = (idx: number): string => categoryPool[idx % categoryPool.length];

    // Генерируем квесты на 7 дней
    const generatedQuests: any[] = [];

    // Функция для проверки требуется ли инвентарь (используем поле location)
    const requiresEquipment = (quest: QuestTemplate): boolean => {
      // Если есть поле location - используем его напрямую
      if (quest.location) {
        return quest.location === "gym";
      }
      // Fallback для старых квестов без поля location
      const text = (quest.title + " " + quest.description).toLowerCase();
      const equipmentKeywords = [
        "штанг",
        "гантел",
        "тренажер",
        "гир",
        "скамь",
        "турник",
        "брус",
        "блок",
        "bench",
        "bar",
      ];
      return equipmentKeywords.some((keyword) => text.includes(keyword));
    };

    // Функция для проверки похожести названий
    const isSimilarQuest = (title1: string, title2: string): boolean => {
      // Если названия полностью совпадают - точно похожи
      if (title1.toLowerCase() === title2.toLowerCase()) return true;

      const words1 = title1.toLowerCase().split(" ");
      const words2 = title2.toLowerCase().split(" ");

      // Список ключевых слов упражнений (если хотя бы одно совпадает - упражнения похожи)
      const exerciseKeywords = [
        "планка",
        "отжимания",
        "приседания",
        "выпады",
        "подтягивания",
        "бег",
        "ходьба",
        "прыжки",
        "берпи",
        "скручивания",
        "пресс",
        "велосипед",
        "плавание",
        "растяжка",
        "йога",
        "медитация",
      ];

      // Проверяем, есть ли совпадение по ключевым словам упражнений
      for (const keyword of exerciseKeywords) {
        const inTitle1 = words1.some(
          (w) => w.includes(keyword) || keyword.includes(w)
        );
        const inTitle2 = words2.some(
          (w) => w.includes(keyword) || keyword.includes(w)
        );
        if (inTitle1 && inTitle2) return true;
      }

      // Проверяем, есть ли 2+ общих значимых слова
      const commonWords = words1.filter(
        (w) => w.length > 3 && words2.includes(w)
      );

      return commonWords.length >= 2;
    };

    for (let day = 1; day <= 7; day++) {
      const nodeId = `node-${day}`;
      let dayQuestCount = 0;
      const dayQuestTitles: string[] = []; // Квесты текущего дня для проверки разнообразия
      let dayHomeCount = 0; // Счетчик домашних квестов
      let dayGymCount = 0; // Счетчик залных квестов

      // Плавная прогрессия сложности внутри недели.
      // Для низких уровней (≤ 8) — нет повышения в конце недели.
      const getDayDifficulties = (): ("easy" | "medium" | "hard")[] => {
        if (day <= 2) {
          // Начало недели — hard заменяем на medium
          return baseDifficulties.map(d => d === "hard" ? "medium" : d) as ("easy" | "medium" | "hard")[];
        } else if (day <= 5) {
          // Середина недели — базовые сложности
          return baseDifficulties;
        } else {
          // Дни 6-7 — повышение только для высоких уровней (9+)
          if (playerLevel <= 8) {
            return baseDifficulties; // Новички: никакого усиления в конце недели
          }
          return baseDifficulties.map(d => {
            if (d === "easy") return "medium";
            if (d === "medium" && baseDifficulties.filter(x => x === "medium").length > 1) return "hard";
            return d;
          }) as ("easy" | "medium" | "hard")[];
        }
      };

      const dayDifficulties = getDayDifficulties();
      console.log(`📅 День ${day}: сложности [${dayDifficulties.join(", ")}]`);

      // Функция для создания квеста определенного типа (home или gym)
      const createQuestOfType = async (
        locationType: "home" | "gym",
        questIndex: number
      ): Promise<boolean> => {
        const difficulty = dayDifficulties[questIndex % dayDifficulties.length];

        // Собираем доступные квесты: для зальных сначала пробуем приоритетную категорию класса
        let availableQuests: QuestTemplate[] = [];

        if (locationType === "gym") {
          // Шаг 1: только приоритетная категория
          const primaryCat = pickCategory(questIndex);
          const primaryQuests = (questBank[primaryCat] || []).filter((q) => {
            const isGymQuest = requiresEquipment(q);
            return isGymQuest && q.difficulty === difficulty &&
              !dayQuestTitles.some((t) => isSimilarQuest(q.title, t));
          });
          if (primaryQuests.length > 0) {
            availableQuests = primaryQuests;
          }
        }
        
        // Если приоритетная категория не дала результов — берём из всех
        if (availableQuests.length === 0) {
          for (const cat of Object.keys(questBank)) {
            const catQuests = questBank[cat] || [];
            const filtered = catQuests.filter((q) => {
              const isGymQuest = requiresEquipment(q);
              const matchesType = locationType === "gym" ? isGymQuest : !isGymQuest;
              const matchesDifficulty = q.difficulty === difficulty;
              const notDuplicate = !dayQuestTitles.some((dayTitle) =>
                isSimilarQuest(q.title, dayTitle)
              );
              return matchesType && matchesDifficulty && notDuplicate;
            });
            availableQuests.push(...filtered);
          }
        }

        // Если нет квестов нужной сложности, берем любую сложность
        if (availableQuests.length === 0) {
          for (const cat of Object.keys(questBank)) {
            const catQuests = questBank[cat] || [];
            const filtered = catQuests.filter((q) => {
              const isGymQuest = requiresEquipment(q);
              const matchesType = locationType === "gym" ? isGymQuest : !isGymQuest;
              const notDuplicate = !dayQuestTitles.some((dayTitle) =>
                isSimilarQuest(q.title, dayTitle)
              );
              return matchesType && notDuplicate;
            });
            availableQuests.push(...filtered);
          }
        }

        if (availableQuests.length === 0) {
          console.log(`⚠️ Нет доступных квестов типа ${locationType} для дня ${day}`);
          return false;
        }

        const selectedQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        dayQuestTitles.push(selectedQuest.title);

        const xpReward = calculateXP(selectedQuest.baseXP, player.level, weekNumber);

        // Определяем showInAllMode: первые 3 квеста каждого типа
        const currentCount = locationType === "home" ? dayHomeCount : dayGymCount;
        const showInAllMode = currentCount < 3;

        const quest = await prisma.quest.create({
          data: {
            userId: user.id,
            title: selectedQuest.title,
            description: selectedQuest.description,
            instructions: selectedQuest.instructions,
            tip: selectedQuest.tip,
            xpReward,
            difficulty: selectedQuest.difficulty,
            category: selectedQuest.category,
            status: "pending",
            isGenerated: true,
            nodeId,
            location: locationType,
            showInAllMode,
            visualDemo: selectedQuest.visualDemo
              ? JSON.stringify(selectedQuest.visualDemo)
              : null,
            stepByStep: selectedQuest.stepByStep
              ? JSON.stringify(selectedQuest.stepByStep)
              : null,
          },
        });

        generatedQuests.push(quest);
        dayQuestCount++;
        
        if (locationType === "home") {
          dayHomeCount++;
        } else {
          dayGymCount++;
        }

        return true;
      };

      // Генерируем СНАЧАЛА 6 домашних квестов
      for (let i = 0; i < questsPerLocation; i++) {
        await createQuestOfType("home", i);
      }

      // Генерируем ЗАТЕМ 6 залных квестов
      for (let i = 0; i < questsPerLocation; i++) {
        await createQuestOfType("gym", questsPerLocation + i);
      }

      console.log(
        `✅ День ${day} (${nodeId}): ${dayQuestCount} упражнений - 🏠${dayHomeCount} дома / 🏋️${dayGymCount} в зале`
      );
    }

    // Обновляем данные игрока
    await prisma.player.update({
      where: { id: player.id },
      data: {
        lastQuestGenerated: new Date(),
        weekStartDate: player.weekStartDate || new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      quests: generatedQuests,
      count: generatedQuests.length,
      week: weekNumber,
      questsPerDay,
    });
  } catch (error: any) {
    console.error("Error generating weekly quests:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
