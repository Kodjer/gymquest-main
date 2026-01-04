// src/pages/api/player/onboarding.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { player: true },
  });

  if (!user || !user.player) {
    return res.status(404).json({ error: "Player not found" });
  }

  if (req.method === "POST") {
    // Сохранение данных опросника
    try {
      const {
        howDidYouHear,
        age,
        weight,
        height,
        fitnessExperience,
        availableTime,
        workoutPreference,
        fitnessGoals,
        injuries,
        dietPreference,
      } = req.body;

      // Проверяем обязательные поля
      if (!howDidYouHear || !age || !weight || !height) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Создаем или обновляем данные опросника
      const onboardingData = await prisma.onboardingData.upsert({
        where: { playerId: user.player.id },
        create: {
          playerId: user.player.id,
          howDidYouHear,
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          fitnessExperience: fitnessExperience || "начинающий",
          availableTime: availableTime || "30 минут",
          workoutPreference: JSON.stringify(workoutPreference || []),
          fitnessGoals: JSON.stringify(fitnessGoals || []),
          injuries: injuries || "Нет",
          dietPreference: dietPreference || "Обычное питание",
          completedAt: new Date(),
        },
        update: {
          howDidYouHear,
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          fitnessExperience,
          availableTime,
          workoutPreference: JSON.stringify(workoutPreference || []),
          fitnessGoals: JSON.stringify(fitnessGoals || []),
          injuries,
          dietPreference,
          completedAt: new Date(),
        },
      });

      // Обновляем флаг завершения опросника
      await prisma.player.update({
        where: { id: user.player.id },
        data: { onboardingCompleted: true },
      });

      return res.status(200).json(onboardingData);
    } catch (error) {
      console.error("Onboarding save error:", error);
      return res.status(500).json({ error: "Failed to save onboarding data" });
    }
  }

  if (req.method === "GET") {
    // Получение данных опросника
    try {
      const onboardingData = await prisma.onboardingData.findUnique({
        where: { playerId: user.player.id },
      });

      if (!onboardingData) {
        return res.status(404).json({ error: "Onboarding data not found" });
      }

      // Парсим JSON поля
      const formattedData = {
        ...onboardingData,
        workoutPreference: JSON.parse(onboardingData.workoutPreference),
        fitnessGoals: JSON.parse(onboardingData.fitnessGoals),
      };

      return res.status(200).json(formattedData);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch onboarding data" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
