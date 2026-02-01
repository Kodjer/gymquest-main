// update-quest-nodes.js
// Скрипт для обновления существующих квестов, добавляя им nodeId

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateQuestNodes() {
  console.log("🔄 Начинаю обновление nodeId для существующих квестов...\n");

  try {
    // Получаем всех пользователей с их квестами
    const users = await prisma.user.findMany({
      include: {
        quests: {
          where: {
            nodeId: null, // Только квесты без nodeId
          },
          orderBy: {
            assignedAt: "asc", // Сортируем по времени создания
          },
        },
      },
    });

    let totalUpdated = 0;

    for (const user of users) {
      if (user.quests.length === 0) continue;

      console.log(
        `📝 Обновляю квесты для пользователя: ${user.email || user.id}`
      );

      // Группируем квесты по категориям
      const questsByCategory = {};
      for (const quest of user.quests) {
        if (!questsByCategory[quest.category]) {
          questsByCategory[quest.category] = [];
        }
        questsByCategory[quest.category].push(quest);
      }

      // Для каждой категории распределяем квесты по узлам
      for (const [category, categoryQuests] of Object.entries(
        questsByCategory
      )) {
        console.log(
          `  📂 Категория: ${category} (${categoryQuests.length} квестов)`
        );

        for (let i = 0; i < categoryQuests.length; i++) {
          const quest = categoryQuests[i];

          // Распределяем по 3-4 квеста на узел
          const nodeNumber = Math.floor(i / 3) + 1;
          const nodeId = `node-${Math.min(nodeNumber, 7)}`; // Максимум 7 узлов

          await prisma.quest.update({
            where: { id: quest.id },
            data: { nodeId },
          });

          console.log(`    ✅ ${quest.title} -> ${nodeId}`);
          totalUpdated++;
        }
      }

      console.log("");
    }

    console.log(`\n✨ Готово! Обновлено квестов: ${totalUpdated}`);
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateQuestNodes();
