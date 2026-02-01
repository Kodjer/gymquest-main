const fs = require("fs");

// Читаем файл questBank.ts
const content = fs.readFileSync("./src/lib/questBank.ts", "utf8");

// Ищем все YouTube URL
const youtubeRegex = /url:\s*"https:\/\/www\.youtube\.com\/embed\/([^"]+)"/g;
const matches = [...content.matchAll(youtubeRegex)];

// Извлекаем уникальные video ID
const videoIds = [...new Set(matches.map((m) => m[1]))];

console.log("Найдено уникальных YouTube видео:", videoIds.length);
console.log("\nСписок Video ID:");
videoIds.forEach((id, index) => {
  console.log(`${index + 1}. ${id} - https://www.youtube.com/watch?v=${id}`);
});

// Ищем квесты с проблемными названиями
const questTitles = ["Зашагивания на лавочку", "Уличный кроссфит"];

console.log("\n\nПроверка проблемных квестов:");
questTitles.forEach((title) => {
  const titleRegex = new RegExp(
    `title:\\s*"${title}"[\\s\\S]*?url:\\s*"https:\\/\\/www\\.youtube\\.com\\/embed\\/([^"]+)"`,
    "i"
  );
  const match = content.match(titleRegex);
  if (match) {
    console.log(`\n"${title}":`);
    console.log(`  Video ID: ${match[1]}`);
    console.log(`  URL: https://www.youtube.com/watch?v=${match[1]}`);
  }
});
