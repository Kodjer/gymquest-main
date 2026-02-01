// check-quest-nodes.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkQuests() {
  const quests = await prisma.quest.findMany({
    select: {
      id: true,
      title: true,
      nodeId: true,
      category: true,
    },
  });

  console.log("📋 Все квесты:");
  quests.forEach((q) => {
    console.log(`  ${q.title}: nodeId="${q.nodeId}", category=${q.category}`);
  });

  await prisma.$disconnect();
}

checkQuests();
