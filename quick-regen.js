// quick-regen.js - Быстрая перегенерация квестов
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function quickRegen() {
  try {
    console.log("\n🗑️  Шаг 1: Удаляю все квесты...");
    const deleteResult = await prisma.quest.deleteMany({});
    console.log(`✅ Удалено: ${deleteResult.count} квестов`);

    console.log(
      "\n🔄 Шаг 2: ОСТАНОВИТЕ dev сервер (Ctrl+C в терминале где запущен npm run dev)"
    );
    console.log("🔄 Шаг 3: Запустите заново: npm run dev");
    console.log(
      "🔄 Шаг 4: Откройте http://localhost:3000 и нажмите 'Сгенерировать неделю'"
    );
    console.log(
      "\n💡 Теперь будет генерироваться РОВНО 7 упражнений в каждый день!"
    );
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

quickRegen();
