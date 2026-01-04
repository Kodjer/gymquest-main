// src/pages/api/quests/clear.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Удаляем все квесты пользователя
    const result = await prisma.quest.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({
      message: "All quests deleted successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting quests:", error);
    return res.status(500).json({ error: "Failed to delete quests" });
  }
}
