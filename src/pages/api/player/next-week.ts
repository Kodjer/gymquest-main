// src/pages/api/player/next-week.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { player: true },
    });

    if (!user || !user.player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Переходим на следующую неделю
    const updatedPlayer = await prisma.player.update({
      where: { id: user.player.id },
      data: {
        currentWeek: user.player.currentWeek + 1,
        weekStartDate: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      weekNumber: updatedPlayer.currentWeek,
    });
  } catch (error: any) {
    console.error("Error advancing week:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
