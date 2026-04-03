import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { getAuthSession } from "../../lib/getAuthSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getAuthSession(req, res);
  if (!session?.user?.email) return res.status(401).json({ error: "Unauthorized" });

  // Топ-20 игроков по XP
  const players = await prisma.player.findMany({
    where: { onboardingCompleted: true },
    orderBy: { xp: "desc" },
    take: 20,
    select: {
      xp: true,
      level: true,
      playerClass: true,
      completedQuests: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const currentUserEmail = session.user.email;

  const result = players.map((p, index) => ({
    rank: index + 1,
    name: p.user.name || p.user.email?.split("@")[0] || "Игрок",
    xp: p.xp,
    level: p.level,
    playerClass: p.playerClass,
    completedQuests: p.completedQuests,
    isCurrentUser: p.user.email === currentUserEmail,
  }));

  // Если текущий пользователь не в топ-20 — найдём его позицию отдельно
  const currentUserInTop = result.some((p) => p.isCurrentUser);
  if (!currentUserInTop) {
    const currentPlayer = await prisma.player.findFirst({
      where: { user: { email: currentUserEmail } },
      select: { xp: true, level: true, playerClass: true, completedQuests: true },
    });
    if (currentPlayer) {
      const rank = await prisma.player.count({
        where: { xp: { gt: currentPlayer.xp }, onboardingCompleted: true },
      });
      result.push({
        rank: rank + 1,
        name: session.user.name || currentUserEmail.split("@")[0],
        xp: currentPlayer.xp,
        level: currentPlayer.level,
        playerClass: currentPlayer.playerClass,
        completedQuests: currentPlayer.completedQuests,
        isCurrentUser: true,
      });
    }
  }

  res.json(result);
}
