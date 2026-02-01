const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkQuests() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "ssazonov228@gmail.com" },
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    const quests = await prisma.quest.findMany({
      where: { userId: user.id },
      select: {
        nodeId: true,
        location: true,
        title: true,
        difficulty: true,
      },
      orderBy: { nodeId: "asc" },
    });

    const byNode = {};
    quests.forEach((q) => {
      if (!byNode[q.nodeId]) byNode[q.nodeId] = [];
      byNode[q.nodeId].push(q);
    });

    console.log("Quests by node:\n");
    Object.keys(byNode)
      .sort()
      .forEach((nodeId) => {
        const qs = byNode[nodeId];
        console.log(`${nodeId}: ${qs.length} quests`);
        qs.forEach((q) =>
          console.log(`  - [${q.difficulty}] ${q.location}: ${q.title}`)
        );
      });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuests();
