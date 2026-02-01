const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const allQuests = await prisma.quest.findMany({
      select: {
        id: true,
        title: true,
        nodeId: true,
      },
      orderBy: { nodeId: "asc" },
    });

    console.log(`\nВсего квестов: ${allQuests.length}\n`);

    // Группируем по nodeId
    const byNode = {};
    allQuests.forEach((q) => {
      if (!byNode[q.nodeId]) {
        byNode[q.nodeId] = [];
      }
      byNode[q.nodeId].push(q);
    });

    // Показываем по узлам
    Object.keys(byNode)
      .sort()
      .forEach((nodeId) => {
        const nodeQuests = byNode[nodeId];
        console.log(`${nodeId}: ${nodeQuests.length} квестов`);
        nodeQuests.forEach((q, idx) => {
          console.log(`  ${idx + 1}. ${q.title}`);
        });
        console.log("");
      });
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
