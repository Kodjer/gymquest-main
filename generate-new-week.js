// generate-new-week.js
const fetch = require("node-fetch");

async function generateNewWeek() {
  try {
    console.log("✨ Генерирую новую неделю квестов...\n");

    const response = await fetch(
      "http://localhost:3000/api/quests/generate-week",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "", // Вставьте куки сессии, если нужно
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Ошибка: ${response.status} - ${errorText}`);
      console.log("\n💡 Решение: Откройте браузер http://localhost:3000");
      console.log(
        "   и нажмите кнопку 'Сгенерировать неделю' или 'Сгенерировать квесты'"
      );
      return;
    }

    const data = await response.json();
    console.log("✅ Успешно сгенерировано!");
    console.log(`📊 Статистика:`, data);
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    console.log("\n💡 Решение: Откройте браузер http://localhost:3000");
    console.log("   и нажмите кнопку 'Сгенерировать неделю' в приложении");
  }
}

generateNewWeek();
