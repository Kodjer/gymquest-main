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

    // Получаем уже выполненные квесты для определения прогресса по категориям
    const completedQuests = await prisma.quest.findMany({
      where: {
        userId: user.id,
        status: "done",
      },
      select: {
        category: true,
        difficulty: true,
      },
    });

    // Считаем прогресс по каждой категории
    const categoryProgress: Record<
      string,
      { easy: number; medium: number; hard: number }
    > = {};
    for (const category of questCategories) {
      categoryProgress[category] = { easy: 0, medium: 0, hard: 0 };
    }

    for (const quest of completedQuests) {
      if (quest.category && categoryProgress[quest.category]) {
        const diff = quest.difficulty as "easy" | "medium" | "hard";
        categoryProgress[quest.category][diff]++;
      }
    }

    // Генерируем 3 новых квеста
    const questsToGenerate = Math.min(3, 5 - activeQuestsCount);
    const generatedQuests: any[] = [];
    const usedTitles = new Set<string>();

    // Получаем уже активные квесты чтобы избежать дубликатов
    const existingQuests = await prisma.quest.findMany({
      where: {
        userId: user.id,
        status: "pending",
      },
      select: {
        title: true,
      },
    });

    for (const q of existingQuests) {
      usedTitles.add(q.title);
    }

    // Функция для определения подходящей сложности для категории
    const getDifficultyForCategory = (
      category: string
    ): ("easy" | "medium" | "hard")[] => {
      const progress = categoryProgress[category];
      const priorities: ("easy" | "medium" | "hard")[] = [];

      // Новичок - всегда начинаем с легких
      if (
        experienceLevel.includes("начинающий") ||
        experienceLevel.includes("новичок")
      ) {
        if (progress.easy < 3) {
          priorities.push("easy");
        } else if (progress.easy >= 3 && progress.medium < 3) {
          priorities.push("easy", "medium");
        } else {
          priorities.push("medium", "easy", "hard");
        }
      }
      // Средний уровень
      else if (experienceLevel.includes("средний")) {
        if (progress.easy < 2) {
          priorities.push("easy");
        } else if (progress.medium < 3) {
          priorities.push("easy", "medium");
        } else {
          priorities.push("medium", "hard", "easy");
        }
      }
      // Продвинутый
      else {
        if (progress.medium < 2) {
          priorities.push("medium", "easy");
        } else {
          priorities.push("medium", "hard", "easy");
        }
      }

      return priorities;
    };

    // Создаём пул квестов с приоритетами сложности для каждой категории
    const availableQuests: QuestTemplate[] = [];

    // Равномерно распределяем квесты по категориям
    const questsPerCategory = Math.ceil(
      questsToGenerate / questCategories.length
    );

    for (const category of questCategories) {
      const categoryQuests = questBank[category] || [];
      const priorities = getDifficultyForCategory(category);

      // Сначала добавляем квесты приоритетной сложности
      for (const difficulty of priorities) {
        const suitableQuests = categoryQuests.filter(
          (q) => q.difficulty === difficulty && !usedTitles.has(q.title)
        );
        availableQuests.push(...suitableQuests);
      }
    }

    // Перемешиваем квесты для разнообразия
    const shuffled = availableQuests.sort(() => Math.random() - 0.5);

    let attempts = 0;
    const maxAttempts = shuffled.length;

    // Определяем nodeId на основе прогресса пользователя
    const getNodeIdForQuest = async (
      category: string,
      difficulty: string
    ): Promise<string> => {
      // Считаем сколько квестов уже выполнено в этой категории
      const completedInCategory = await prisma.quest.count({
        where: {
          userId: user.id,
          category,
          status: "done",
        },
      });

      // Определяем узел на основе количества выполненных квестов
      // Каждый узел содержит примерно 3-5 квестов
      const nodeNumber = Math.floor(completedInCategory / 4) + 1;
      const nodeId = `node-${Math.min(nodeNumber, 7)}`; // Максимум 7 узлов

      return nodeId;
    };

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

      // Определяем nodeId для квеста
      const nodeId = await getNodeIdForQuest(
        randomQuest.category,
        randomQuest.difficulty
      );

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
        nodeId, // Добавляем nodeId
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
      categories: questCategories,
      progress: categoryProgress,
    });
  } catch (error: any) {
    console.error("Error generating quests:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
