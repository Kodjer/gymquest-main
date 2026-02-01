const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const quests = await prisma.quest.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        nodeId: true,
        category: true,
      },
      orderBy: { nodeId: "asc" },
    });

    console.log(`\nВсего квестов в базе: ${quests.length}\n`);

    // Группируем по nodeId
    const byNode = {};
    quests.forEach((q) => {
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
        console.log(`\n${nodeId} (${nodeQuests.length} квестов):`);
        nodeQuests.forEach((q) => {
          console.log(
            `  - ${q.title} [${q.category}] (location: ${q.location || "NULL"})`
          );
        });
      });

    // Статистика по location
    const locationStats = {
      home: quests.filter((q) => q.location === "home").length,
      gym: quests.filter((q) => q.location === "gym").length,
      both: quests.filter((q) => q.location === "both").length,
      null: quests.filter((q) => !q.location).length,
    };

    console.log("\n\nСтатистика по location:");
    console.log(`  home: ${locationStats.home}`);
    console.log(`  gym: ${locationStats.gym}`);
    console.log(`  both: ${locationStats.both}`);
    console.log(`  null: ${locationStats.null}`);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
