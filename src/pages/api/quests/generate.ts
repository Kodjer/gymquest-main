// src/pages/api/quests/generate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";
import {
  questBank,
  getDifficultyByLevel,
  calculateXP,
  QuestTemplate,
} from "../../../lib/questBank";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Получаем или создаем пользователя с профилем игрока
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Если у пользователя нет профиля игрока, создаем его
    if (!user.player) {
      const newPlayer = await prisma.player.create({
        data: {
          userId: user.id,
          level: 1,
          xp: 0,
          onboardingCompleted: false,
        },
        include: {
          onboardingData: true,
        },
      });

      user.player = newPlayer;
    }

    const player = user.player;
    const onboardingData = player.onboardingData;

    if (!onboardingData) {
      return res.status(400).json({
        error: "Please complete onboarding first",
        needsOnboarding: true,
      });
    }

    // Проверяем, есть ли уже активные квесты
    const activeQuestsCount = await prisma.quest.count({
      where: {
        userId: user.id,
        status: "pending",
      },
    });

    // Ограничиваем количество активных квестов (например, максимум 5)
    if (activeQuestsCount >= 5) {
      return res.status(400).json({
        error: "You already have 5 active quests. Complete some first!",
        activeQuests: activeQuestsCount,
      });
    }

    // Парсим предпочтения пользователя
    let workoutPreferences: string[] = [];
    try {
      workoutPreferences =
        typeof onboardingData.workoutPreference === "string"
          ? JSON.parse(onboardingData.workoutPreference)
          : onboardingData.workoutPreference;
    } catch (e) {
      workoutPreferences = [];
    }

    // Маппинг предпочтений на категории квестов
    const categoryMapping: Record<string, string> = {
      "Силовые тренировки": "strength",
      Кардио: "cardio",
      Йога: "flexibility",
      Растяжка: "flexibility",
      "Функциональные тренировки": "strength",
      Плавание: "cardio",
      Бег: "cardio",
      Велоспорт: "cardio",
      "Здоровое питание": "wellness",
      Медитация: "wellness",
    };

    // Определяем категории квестов на основе предпочтений
    const questCategories: string[] = workoutPreferences
      .map((pref) => categoryMapping[pref])
      .filter((cat) => cat !== undefined);

    // Если нет предпочтений, используем все категории
    if (questCategories.length === 0) {
      questCategories.push("strength", "cardio", "flexibility", "wellness");
    }

    // Определяем сложность на основе уровня игрока и опыта
    const experienceLevel = onboardingData.fitnessExperience.toLowerCase();
    let baseDifficulty: "easy" | "medium" | "hard";

    if (
      experienceLevel.includes("начинающий") ||
      experienceLevel.includes("новичок")
    ) {
      baseDifficulty = getDifficultyByLevel(player.level);
    } else if (
      experienceLevel.includes("средний") ||
      experienceLevel.includes("продвинутый")
    ) {
      baseDifficulty = player.level <= 5 ? "medium" : "hard";
    } else {
      baseDifficulty = getDifficultyByLevel(player.level);
    }

    // Генерируем 3 новых квеста
    const questsToGenerate = Math.min(3, 5 - activeQuestsCount);
    const generatedQuests: any[] = [];
    const usedTitles = new Set<string>(); // Отслеживаем использованные квесты

    // Создаём пул квестов из всех категорий с нужной сложностью
    const availableQuests: QuestTemplate[] = [];
    for (const category of questCategories) {
      const categoryQuests = questBank[category] || [];
      const suitableQuests = categoryQuests.filter(
        (q) => q.difficulty === baseDifficulty
      );
      availableQuests.push(...suitableQuests);
    }

    // Если доступных квестов мало, берём любой сложности
    if (availableQuests.length < questsToGenerate) {
      for (const category of questCategories) {
        const categoryQuests = questBank[category] || [];
        availableQuests.push(...categoryQuests);
      }
    }

    // Перемешиваем квесты для случайности
    const shuffled = availableQuests.sort(() => Math.random() - 0.5);

    let attempts = 0;
    const maxAttempts = shuffled.length;

    while (
      generatedQuests.length < questsToGenerate &&
      attempts < maxAttempts
    ) {
      const randomQuest = shuffled[attempts];
      attempts++;

      // Пропускаем, если квест с таким названием уже был добавлен
      if (usedTitles.has(randomQuest.title)) {
        continue;
      }

      usedTitles.add(randomQuest.title);

      // Вычисляем XP с учетом уровня
      const xpReward = calculateXP(randomQuest.baseXP, player.level);

      // Создаем квест в базе
      const questData: any = {
        userId: user.id,
        title: randomQuest.title,
        description: randomQuest.description,
        instructions: randomQuest.instructions,
        tip: randomQuest.tip,
        xpReward,
        difficulty: randomQuest.difficulty,
        category: randomQuest.category,
        status: "pending",
        isGenerated: true,
        // Сохраняем визуальную демонстрацию и пошаговые инструкции как JSON
        visualDemo: randomQuest.visualDemo
          ? JSON.stringify(randomQuest.visualDemo)
          : null,
        stepByStep: randomQuest.stepByStep
          ? JSON.stringify(randomQuest.stepByStep)
          : null,
      };

      const quest = await prisma.quest.create({
        data: questData,
      });

      generatedQuests.push(quest);
    }

    // Обновляем время последней генерации
    await prisma.player.update({
      where: { id: player.id },
      data: {
        lastQuestGenerated: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      quests: generatedQuests,
      count: generatedQuests.length,
      difficulty: baseDifficulty,
      categories: questCategories,
    });
  } catch (error: any) {
    console.error("Error generating quests:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
