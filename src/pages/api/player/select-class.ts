// src/pages/api/player/select-class.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

const validClasses: PlayerClass[] = ["warrior", "scout", "monk", "berserker"];

// Маппинг класса на предпочтения тренировок
const classToPreferences: Record<PlayerClass, string[]> = {
  warrior: ["Силовые тренировки", "Набор массы"],
  scout: ["Кардио", "Похудение", "Выносливость"],
  monk: ["Растяжка", "Йога", "Гибкость"],
  berserker: ["HIIT", "Функциональный тренинг", "Силовые тренировки"],
};

const classToGoals: Record<PlayerClass, string[]> = {
  warrior: ["Набрать мышечную массу", "Увеличить силу"],
  scout: ["Похудеть", "Улучшить выносливость", "Подготовиться к забегу"],
  monk: ["Улучшить гибкость", "Снять стресс", "Улучшить осанку"],
  berserker: ["Похудеть", "Набрать мышечную массу", "Увеличить силу"],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getAuthSession(req, res);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { playerClass } = req.body;

    if (!playerClass || !validClasses.includes(playerClass)) {
      return res.status(400).json({ error: "Invalid class" });
    }

    // Найти пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Найти или создать игрока
    let player = await prisma.player.findUnique({
      where: { userId: user.id },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          userId: user.id,
          playerClass,
          onboardingCompleted: true,
        },
      });
    } else {
      // Обновить класс существующего игрока
      player = await prisma.player.update({
        where: { userId: user.id },
        data: {
          playerClass,
          onboardingCompleted: true,
        },
      });
    }

    // Создать или обновить данные онбординга на основе класса
    const preferences = classToPreferences[playerClass as PlayerClass];
    const goals = classToGoals[playerClass as PlayerClass];

    await prisma.onboardingData.upsert({
      where: { playerId: player.id },
      update: {
        workoutPreference: JSON.stringify(preferences),
        fitnessGoals: JSON.stringify(goals),
        fitnessExperience: playerClass === "berserker" ? "продвинутый" : "средний",
      },
      create: {
        playerId: player.id,
        howDidYouHear: "class_selection",
        age: 25,
        weight: 70,
        height: 175,
        fitnessExperience: playerClass === "berserker" ? "продвинутый" : "средний",
        availableTime: "30-60 минут",
        workoutPreference: JSON.stringify(preferences),
        fitnessGoals: JSON.stringify(goals),
        dietPreference: "обычное питание",
        completedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      player: {
        id: player.id,
        playerClass: player.playerClass,
        classLevel: player.classLevel,
        level: player.level,
        xp: player.xp,
      },
    });
  } catch (error) {
    console.error("Select class error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
