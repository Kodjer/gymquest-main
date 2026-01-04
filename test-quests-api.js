// Тестовый скрипт для проверки API квестов
// Запусти в консоли браузера на странице http://localhost:3000

async function testQuestsAPI() {
  console.log("🔍 Проверка API квестов...");

  try {
    const response = await fetch("/api/quests");
    const quests = await response.json();

    console.log(`📊 Всего квестов: ${quests.length}`);

    if (quests.length > 0) {
      const firstQuest = quests[0];
      console.log("\n📝 Первый квест:");
      console.log("ID:", firstQuest.id);
      console.log("Название:", firstQuest.title);
      console.log("Описание:", firstQuest.description ? "✅" : "❌");
      console.log("Инструкции:", firstQuest.instructions ? "✅" : "❌");
      console.log("Совет:", firstQuest.tip ? "✅" : "❌");
      console.log(
        "Визуальная демонстрация:",
        firstQuest.visualDemo ? "✅" : "❌"
      );
      console.log("Пошаговая инструкция:", firstQuest.stepByStep ? "✅" : "❌");

      if (firstQuest.visualDemo) {
        console.log("\n🎬 Визуальная демонстрация:", firstQuest.visualDemo);
      }

      if (firstQuest.stepByStep) {
        console.log("\n📝 Пошаговая инструкция:", firstQuest.stepByStep);
      }

      console.log("\n📦 Полный объект первого квеста:");
      console.log(firstQuest);
    } else {
      console.log("⚠️ Нет квестов. Сгенерируй новые квесты!");
    }
  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

// Запускаем проверку
testQuestsAPI();
