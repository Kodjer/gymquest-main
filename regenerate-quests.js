// regenerate-quests.js - Скрипт для перегенерации квестов
const http = require("http");

console.log("🔄 Запускаем регенерацию квестов...");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/quests/generate-week",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("📊 Статус:", res.statusCode);

    try {
      const result = JSON.parse(data);
      console.log("✅ Результат:", JSON.stringify(result, null, 2));

      if (result.success) {
        console.log(`\n🎉 Успешно сгенерировано ${result.count} квестов!`);
        console.log(`📅 Неделя: ${result.week}`);
        console.log(`📝 Квестов в день: ${result.questsPerDay}`);
      } else {
        console.log("❌ Ошибка:", result.error);
        if (result.needsOnboarding) {
          console.log("⚠️  Сначала нужно пройти onboarding в приложении");
        }
      }
    } catch (e) {
      console.log("📄 Ответ:", data);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Ошибка запроса:", error.message);
  console.log("\n💡 Убедитесь, что:");
  console.log("1. Сервер запущен (npm run dev)");
  console.log("2. Вы авторизованы в браузере");
  console.log("3. Пройден onboarding");
});

req.end();
