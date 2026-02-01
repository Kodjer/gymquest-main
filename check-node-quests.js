const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkNodeQuests() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "ssazonov228@gmail.com" },
    });

    const quests = await prisma.quest.findMany({
      where: {
        userId: user.id,
        nodeId: { in: ["node-1", "node-2"] },
      },
      select: {
        title: true,
        difficulty: true,
        nodeId: true,
      },
      orderBy: { nodeId: "asc" },
    });

    console.log("Quests in node-1 and node-2:");
    quests.forEach((q) => {
      console.log(`[${q.nodeId}] ${q.difficulty.padEnd(6)} - ${q.title}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNodeQuests();
