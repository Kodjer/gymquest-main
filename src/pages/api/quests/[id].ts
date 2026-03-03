// src/pages/api/quests/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuthSession(req, res);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid quest ID" });
  }

  // Получаем пользователя
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "PUT") {
    // Обновление квеста
    try {
      const { title, xpReward, difficulty, status } = req.body;

      // Проверяем, что квест принадлежит пользователю
      const existingQuest = await prisma.quest.findFirst({
        where: { id, userId: user.id },
      });

      if (!existingQuest) {
        return res.status(404).json({ error: "Quest not found" });
      }

      const updatedQuest = await prisma.quest.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(xpReward && { xpReward: parseInt(xpReward) }),
          ...(difficulty && { difficulty }),
          ...(status && { status }),
        },
      });

      // Если квест завершен, обновляем XP игрока и счетчик завершенных квестов
      if (status === "done" && existingQuest.status === "pending") {
        const player = await prisma.player.findUnique({
          where: { userId: user.id },
        });

        if (player) {
          const newXp = player.xp + updatedQuest.xpReward;
          const newLevel = Math.floor(newXp / 100) + 1;

          await prisma.player.update({
            where: { id: player.id },
            data: {
              xp: newXp,
              level: newLevel,
              completedQuests: player.completedQuests + 1,
            },
          });

          // Сохраняем историю XP
          await prisma.xpHistory.create({
            data: {
              userId: user.id,
              xp: newXp,
            },
          });

          // Обновляем completedAt для квеста
          await prisma.quest.update({
            where: { id },
            data: {
              completedAt: new Date(),
            },
          });
        }
      }

      return res.status(200).json(updatedQuest);
    } catch (error) {
      console.error("Update quest error:", error);
      return res.status(500).json({ error: "Failed to update quest" });
    }
  }

  if (req.method === "DELETE") {
    // Удаление квеста
    try {
      // Проверяем, что квест принадлежит пользователю
      const existingQuest = await prisma.quest.findFirst({
        where: { id, userId: user.id },
      });

      if (!existingQuest) {
        return res.status(404).json({ error: "Quest not found" });
      }

      await prisma.quest.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Quest deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete quest" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
