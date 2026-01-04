// src/pages/api/quests/index.ts
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

  // Получаем пользователя по email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    // Получение всех квестов пользователя
    try {
      const quests = await prisma.quest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      // Парсим JSON поля для каждого квеста
      const questsWithParsedData = quests.map((quest) => {
        const questAny = quest as any;
        return {
          ...quest,
          visualDemo: questAny.visualDemo
            ? JSON.parse(questAny.visualDemo)
            : undefined,
          stepByStep: questAny.stepByStep
            ? JSON.parse(questAny.stepByStep)
            : undefined,
        };
      });

      return res.status(200).json(questsWithParsedData);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch quests" });
    }
  }

  if (req.method === "POST") {
    // Создание нового квеста (для ручного создания, если нужно)
    try {
      const { title, description, xpReward, difficulty, category } = req.body;

      if (!title || !xpReward || !difficulty) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const quest = await prisma.quest.create({
        data: {
          userId: user.id,
          title,
          description: description || null,
          xpReward: parseInt(xpReward),
          difficulty,
          category: category || "wellness",
          status: "pending",
          isGenerated: false, // Создан вручную
        },
      });

      return res.status(201).json(quest);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create quest" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
