const fs = require("fs");
const https = require("https");

// Читаем файл
const content = fs.readFileSync("src/lib/questBank.ts", "utf8");

// Находим все YouTube URL
const youtubeRegex = /https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g;
const matches = [...content.matchAll(youtubeRegex)];
const videoIds = [...new Set(matches.map((m) => m[1]))];

console.log(`Найдено уникальных видео: ${videoIds.length}`);
console.log("Проверяю доступность...\n");

const checkVideo = (videoId) => {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const info = JSON.parse(data);
              resolve({ id: videoId, available: true, title: info.title });
            } catch (e) {
              resolve({ id: videoId, available: false });
            }
          });
        } else {
          resolve({ id: videoId, available: false });
        }
      })
      .on("error", () => {
        resolve({ id: videoId, available: false });
      });
  });
};

// Проверяем все видео
Promise.all(videoIds.map(checkVideo))
  .then((results) => {
    console.log("\n=== РЕЗУЛЬТАТЫ ===\n");

    const available = results.filter((r) => r.available);
    const unavailable = results.filter((r) => !r.available);

    console.log("✅ ДОСТУПНЫЕ ВИДЕО:");
    available.forEach((v) => {
      console.log(`  ${v.id}: ${v.title}`);
    });

    console.log(`\n❌ НЕДОСТУПНЫЕ ВИДЕО (${unavailable.length}):`);
    unavailable.forEach((v) => {
      console.log(`  ${v.id}`);
    });

    // Удаляем недоступные видео из файла
    if (unavailable.length > 0) {
      console.log("\n🔧 Удаляю недоступные видео из файла...");
      let newContent = content;

      unavailable.forEach((v) => {
        // Удаляем весь блок visualDemo с этим видео
        const regex = new RegExp(
          `visualDemo:\\s*\\{[^}]*youtube\\.com/embed/${v.id}[^}]*\\}`,
          "g"
        );
        newContent = newContent.replace(regex, "visualDemo: undefined");
      });

      // Очищаем лишние undefined
      newContent = newContent.replace(/,?\s*visualDemo:\s*undefined,?/g, "");

      fs.writeFileSync("src/lib/questBank.ts", newContent, "utf8");
      console.log("✅ Файл обновлен!");
    }
  })
  .catch((err) => console.error("Ошибка:", err));
