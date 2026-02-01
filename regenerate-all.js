// regenerate-all.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function regenerateAll() {
  try {
    console.log("🗑️  Удаляю все квесты...");

    const deleteResult = await prisma.quest.deleteMany({});
    console.log(`✅ Удалено квестов: ${deleteResult.count}`);

    console.log(
      "\n✨ Готово! Теперь перейди в приложение и нажми кнопку 'Сгенерировать неделю'"
    );
    console.log(
      "   или зайди на http://localhost:3000 и используй кнопку генерации"
    );
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateAll();
