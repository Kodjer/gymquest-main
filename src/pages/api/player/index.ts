// src/pages/api/player/index.ts
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

  // Получаем или создаем пользователя
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
    // Создаем нового пользователя с профилем игрока
    user = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        player: {
          create: {
            level: 1,
            xp: 0,
            onboardingCompleted: false,
          },
        },
      },
      include: {
        player: {
          include: {
            onboardingData: true,
          },
        },
      },
    });
  }

  if (req.method === "GET") {
    // Получение профиля игрока
    return res.status(200).json(user.player);
  }

  if (req.method === "PUT") {
    // Обновление профиля игрока
    try {
      const {
        xp,
        level,
        onboardingCompleted,
        coins,
        streak,
        lastQuestDate,
        currentWeek,
      } = req.body;

      if (!user.player) {
        return res.status(404).json({ error: "Player not found" });
      }

      const updatedPlayer = await prisma.player.update({
        where: { id: user.player.id },
        data: {
          ...(xp !== undefined && { xp }),
          ...(level !== undefined && { level }),
          ...(onboardingCompleted !== undefined && { onboardingCompleted }),
          ...(coins !== undefined && { coins }),
          ...(streak !== undefined && { streak }),
          ...(lastQuestDate !== undefined && { lastQuestDate }),
          ...(currentWeek !== undefined && { currentWeek }),
        },
        include: {
          onboardingData: true,
        },
      });

      return res.status(200).json(updatedPlayer);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update player" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
