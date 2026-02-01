// auto-generate-quests.js - Автоматическая генерация квестов
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const http = require("http");

function calculateXP(baseXP, playerLevel, weekNumber = 1) {
  const levelMultiplier = 1 + (playerLevel - 1) * 0.1;
  const weekMultiplier = 1 + (weekNumber - 1) * 0.05;
  return Math.round(baseXP * levelMultiplier * weekMultiplier);
}

function makeRequest(path, method = "POST") {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
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
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function autoGenerate() {
  try {
    console.log("\n🔄 Автоматическая генерация квестов через API...\n");

    // Получаем первого пользователя
    const user = await prisma.user.findFirst({
      include: {
        player: true,
      },
    });

    if (!user || !user.player) {
      console.log("❌ Пользователь не найден. Сначала пройдите онбординг.");
      return;
    }

    console.log(`👤 Пользователь: ${user.email}`);
    console.log(`📊 Уровень: ${user.player.level}, XP: ${user.player.xp}`);

    // Удаляем старые квесты
    console.log("\n🗑️  Удаляю старые квесты...");
    const deleted = await prisma.quest.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Удалено: ${deleted.count} квестов`);

    console.log("\n💪 Генерирую новую неделю квестов...");
    console.log("🌐 Сервер должен быть запущен на http://localhost:3000\n");

    // Делаем запрос к API генерации
    try {
      const response = await makeRequest("/api/quests/generate-week", "POST");

      if (response.status === 200) {
        const data = response.data;
        console.log(`✅ Успешно сгенерировано: ${data.count} квестов`);
        console.log(`📊 Неделя: ${data.week}`);
        console.log(`💪 Упражнений в день: ${data.questsPerDay}`);
      } else {
        console.log(`❌ Ошибка API: ${response.status}`);
        console.log(response.data);
      }
    } catch (fetchError) {
      console.log("❌ Не удалось подключиться к API");
      console.log("💡 Убедитесь что сервер запущен: npm run dev");
      console.log(fetchError.message);
    }

    console.log(`\n🎉 Готово! Откройте http://localhost:3000\n`);
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

autoGenerate();
