const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Простые правила для определения location по категории и названию
function guessLocation(quest) {
  const title = quest.title.toLowerCase();

  // Квесты для зала
  const gymKeywords = [
    "тренажер",
    "штанга",
    "гантел",
    "жим лёжа",
    "жим сидя",
    "тяга к поясу",
    "становая тяга",
    "приседания со штангой",
    "сгибание ног",
    "разгибание ног",
    "пресс машин",
    "скамья",
    "эллипс",
    "беговая дорожка",
    "велотренажер",
    "гребной тренажер",
    "кроссовер",
    "тренажер",
    "foam roll",
    "массажный пистолет",
    "инверсионный стол",
  ];

  // Квесты для дома
  const homeKeywords = [
    "отжимания",
    "приседания без",
    "прыжки",
    "скакалка",
    "планка",
    "выпады без",
    "берпи",
    "альпинист",
    "велосипед для пресса",
    "супермен",
    "танц",
    "степ-ап",
    "аэробика",
    "бокс с тенью",
    "табата дома",
    "йога дома",
    "дыхательная",
    "медитация",
    "пенный ролик",
    "статическая растяжка дома",
    "динамическая растяжка дома",
    "водный баланс",
    "холодный душ",
  ];

  // Квесты для обоих мест
  const bothKeywords = [
    "бег",
    "велопоход",
    "роллеры",
    "поход в горы",
    "скандинавская ходьба",
    "подтягивания",
    "отжимания на брусьях",
    "планш",
    "воркаут",
    "здоровый сон",
    "прогулка",
    "дневник тренировок",
    "позитивная аффирмация",
  ];

  // Проверяем ключевые слова
  if (gymKeywords.some((keyword) => title.includes(keyword))) {
    return "gym";
  }

  if (homeKeywords.some((keyword) => title.includes(keyword))) {
    return "home";
  }

  if (bothKeywords.some((keyword) => title.includes(keyword))) {
    return "both";
  }

  // По умолчанию оба места
  return "both";
}

async function updateQuestLocations() {
  try {
    // Получаем все квесты без location
    const quests = await prisma.quest.findMany({
      where: {
        OR: [{ location: null }, { location: "" }],
      },
    });

    console.log(`Найдено квестов без location: ${quests.length}`);

    let updated = 0;

    for (const quest of quests) {
      const location = guessLocation(quest);

      await prisma.quest.update({
        where: { id: quest.id },
        data: { location },
      });
      updated++;
      console.log(`Обновлен квест "${quest.title}" - location: ${location}`);
    }

    console.log(`\nОбновлено квестов: ${updated}/${quests.length}`);
  } catch (error) {
    console.error("Ошибка при обновлении:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateQuestLocations();
