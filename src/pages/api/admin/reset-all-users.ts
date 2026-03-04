// ВРЕМЕННЫЙ роут — удалить после использования!
// Вызови GET /api/admin/reset-all-users?secret=gymquest_reset_2026
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

const SECRET = "gymquest_reset_2026";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const xp = await prisma.xpHistory.deleteMany({});
    const quests = await prisma.quest.deleteMany({});
    const players = await prisma.player.deleteMany({});

    // NextAuth tables (могут называться по-разному)
    try { await prisma.$executeRawUnsafe("DELETE FROM accounts"); } catch {}
    try { await prisma.$executeRawUnsafe("DELETE FROM sessions"); } catch {}
    try { await prisma.$executeRawUnsafe("DELETE FROM verification_tokens"); } catch {}

    const users = await prisma.user.deleteMany({});

    return res.status(200).json({
      ok: true,
      deleted: {
        xpHistory: xp.count,
        quests: quests.count,
        players: players.count,
        users: users.count,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
