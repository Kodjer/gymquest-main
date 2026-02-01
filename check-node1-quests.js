const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Функция для определения инвентаря
const requiresEquipment = (quest) => {
  const text = `${quest.title} ${quest.description || ""} ${
    quest.instructions || ""
  }`.toLowerCase();

  const equipmentKeywords = [
    "штанг",
    "гантел",
    "тренажер",
    "скамья",
    "грифа",
    "блок",
    "кроссовер",
    "жим лёжа",
    "жим сидя",
    "машин",
    "рама",
    "эллипс",
    "беговая дорожка",
    "велотренажер",
    "гребной тренажер",
    "foam roll",
    "массажный пистолет",
    "инверсионный стол",
    "трх",
    "trx",
    "петл",
    "турник в зале",
    "брусья в зале",
  ];

  return equipmentKeywords.some((keyword) => text.includes(keyword));
};

(async () => {
  try {
    const quests = await prisma.quest.findMany({
      where: { nodeId: "node-1" },
      select: {
        id: true,
        title: true,
        description: true,
        instructions: true,
        location: true,
      },
    });

    console.log(`\nКвесты на node-1 (День 1): ${quests.length} квестов\n`);

    quests.forEach((q) => {
      const hasEquipment = requiresEquipment(q);
      console.log(`\n📋 ${q.title}`);
      console.log(
        `   Инвентарь: ${hasEquipment ? "ДА (для зала)" : "НЕТ (для дома)"}`
      );
      console.log(`   Location в БД: ${q.location || "NULL"}`);
    });

    const withEquipment = quests.filter((q) => requiresEquipment(q)).length;
    const withoutEquipment = quests.filter((q) => !requiresEquipment(q)).length;

    console.log(`\n\nИтого:`);
    console.log(`  С инвентарем (для зала): ${withEquipment}`);
    console.log(`  Без инвентаря (для дома): ${withoutEquipment}`);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
