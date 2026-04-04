// src/pages/api/quests/generate-week.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "../../../lib/prisma";
import { generateWeeklyQuests } from "../../../lib/generateWeeklyQuests";

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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        player: { include: { onboardingData: true } },
      },
    });

    if (!user || !user.player) {
      return res.status(404).json({ error: "User or player not found" });
    }

    const quests = await generateWeeklyQuests(user.id, user.player, user.player.onboardingData);

    return res.status(200).json({
      success: true,
      quests,
      count: quests.length,
      week: user.player.currentWeek,
    });
  } catch (error: any) {
    console.error("Error generating weekly quests:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
