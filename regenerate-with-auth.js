const { PrismaClient } = require("@prisma/client");
const http = require("http");

const prisma = new PrismaClient();

async function regenerateQuests() {
  try {
    console.log("🔄 Перегенерация квестов с новой логикой...\n");

    // 1. Найти пользователя
    const user = await prisma.user.findUnique({
      where: { email: "ssazonov228@gmail.com" },
      include: { player: true },
    });

    if (!user || !user.player) {
      console.error("❌ Пользователь не найден");
      process.exit(1);
    }

    console.log(`👤 Пользователь: ${user.email}`);
    console.log(`📊 Уровень: ${user.player.level}, XP: ${user.player.xp}\n`);

    // 2. Удалить все квесты
    const deleted = await prisma.quest.deleteMany({
      where: { userId: user.id },
    });

    console.log(`🗑️ Удалено квестов: ${deleted.count}\n`);

    // 3. Генерация квестов через API
    console.log("🔨 Генерирую новые квесты...\n");

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

      res.on("end", async () => {
        if (res.statusCode === 200) {
          console.log("✅ Квесты успешно сгенерированы!\n");

          // Проверяем результат
          const quests = await prisma.quest.findMany({
            where: { userId: user.id },
            select: {
              title: true,
              difficulty: true,
              category: true,
              nodeId: true,
              visualDemo: true,
            },
            orderBy: { createdAt: "asc" },
          });

          console.log(`📋 Всего квестов: ${quests.length}\n`);

          // Группируем по дням
          const byDay = {};
          quests.forEach((q) => {
            if (!byDay[q.nodeId]) byDay[q.nodeId] = [];
            byDay[q.nodeId].push(q);
          });

          Object.keys(byDay)
            .sort()
            .forEach((nodeId) => {
              const dayQuests = byDay[nodeId];
              console.log(`\n${nodeId}: ${dayQuests.length} упражнений`);
              dayQuests.forEach((q) => {
                const hasVideo = q.visualDemo ? "🎥" : "❌";
                console.log(
                  `  ${hasVideo} ${q.difficulty.padEnd(
                    6
                  )} | ${q.category.padEnd(10)} | ${q.title}`
                );
              });
            });

          await prisma.$disconnect();
          process.exit(0);
        } else {
          console.error("❌ Ошибка API:", res.statusCode, data);
          await prisma.$disconnect();
          process.exit(1);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Ошибка подключения:", error.message);
      console.log("\n💡 Убедитесь, что сервер запущен (npm run dev)");
      process.exit(1);
    });

    req.write(JSON.stringify({}));
    req.end();
  } catch (error) {
    console.error("❌ Ошибка:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

regenerateQuests();
