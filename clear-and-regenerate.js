// clear-and-regenerate.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Получаем все квесты
    const allQuests = await prisma.quest.findMany();
    console.log(`📊 Всего квестов в базе: ${allQuests.length}`);

    if (allQuests.length > 0) {
      // Удаляем все квесты
      const deleted = await prisma.quest.deleteMany({});
      console.log(`🗑️ Удалено квестов: ${deleted.count}`);
    } else {
      console.log("✅ База уже пуста");
    }

    console.log(
      "\n✨ Готово! Теперь перезагрузите страницу - квесты сгенерируются автоматически."
    );
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
