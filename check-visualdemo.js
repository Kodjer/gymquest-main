// check-visualdemo.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkVisualDemo() {
  try {
    const quests = await prisma.quest.findMany({
      take: 5, // Первые 5 квестов для примера
      orderBy: { createdAt: "desc" },
    });

    console.log(`\n📊 Найдено квестов: ${quests.length}\n`);

    quests.forEach((quest, index) => {
      console.log(`\n${index + 1}. ${quest.title}`);
      console.log(`   Категория: ${quest.category}`);
      console.log(`   Сложность: ${quest.difficulty}`);
      console.log(`   Node: ${quest.nodeId}`);

      if (quest.visualDemo) {
        try {
          const visualDemo = JSON.parse(quest.visualDemo);
          console.log(
            `   ✅ VisualDemo: ${visualDemo.type} - ${visualDemo.url.substring(
              0,
              60
            )}...`
          );
        } catch (e) {
          console.log(`   ❌ VisualDemo parsing error: ${e.message}`);
        }
      } else {
        console.log(`   ⚠️ VisualDemo: ОТСУТСТВУЕТ`);
      }
    });
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVisualDemo();
