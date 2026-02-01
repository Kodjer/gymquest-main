// check-all-videos.js
const https = require("https");

const videoIds = [
  "IODxDxX7oi4",
  "YaXPRqUwItQ",
  "ASdvN_XEl_c",
  "0326dy_-CzM",
  "eFDN8lW5c0U",
  "RT6PP-T5SKQ",
  "eGo4IYlbE5g",
  "LRMfE7bMTGI",
  "dhBenZ4vMLw",
  "uYumuL_G_V0",
  "wwpGxtCEcXM",
  "s3kSwcWSqq0",
  "8w7g-mMWmKI",
  "_xdOuqokcm4",
  "5cILeB87qgI",
  "IODxDxX7oi4",
  "aajhW7DD1EA",
  "U1sSfWq6Pbs",
  "V3d7_sdq3UM",
  "4fAJdtqBcJU",
  "5eMRBC36yF4",
  "Pz9xeX0fDp8",
  "mvoAqqysJLs",
  "5qgIv7FIdDg",
  "xwO4yFj22_4",
  "MeUhGSQdwbE",
  "dhBenZ4vMLw",
  "uYumuL_G_V0",
  "wwpGxtCEcXM",
  "eFDN8lW5c0U",
  "_xdOuqokcm4",
  "RT6PP-T5SKQ",
  "Y2ry-Y9V8WA",
  "qSVPGIgzdL0",
  "xwO4yFj22_4",
  "UItWltVZZmE",
  "V3d7_sdq3UM",
  "vJyhcy9qNxo",
  "4TKS-hD_2aU",
  "UkMkyvHH_P8",
  "Ej3S8LYl0wk",
  "Mc_lTiRNJd4",
  "7Qg7jtvBXUY",
  "n4VQ3E47DHA",
  "DHD1-2P94DI",
  "g_tea8ZNk5A",
  "WjfT6ljgwxg",
  "1D4vKa39YRE",
  "dhBenZ4vMLw",
  "uYumuL_G_V0",
  "wwpGxtCEcXM",
  "eFDN8lW5c0U",
  "fLrxAbT3G5E",
];

// Удаляем дубликаты
const uniqueIds = [...new Set(videoIds)];

console.log(`\n🔍 Проверяю ${uniqueIds.length} уникальных YouTube видео...\n`);

let workingCount = 0;
let brokenCount = 0;
const brokenVideos = [];

function checkVideo(videoId) {
  return new Promise((resolve) => {
    const options = {
      hostname: "img.youtube.com",
      port: 443,
      path: `/vi/${videoId}/0.jpg`,
      method: "HEAD",
      timeout: 5000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${videoId} - OK`);
        workingCount++;
        resolve(true);
      } else {
        console.log(`❌ ${videoId} - BROKEN (${res.statusCode})`);
        brokenVideos.push(videoId);
        brokenCount++;
        resolve(false);
      }
    });

    req.on("error", (e) => {
      console.log(`❌ ${videoId} - ERROR: ${e.message}`);
      brokenVideos.push(videoId);
      brokenCount++;
      resolve(false);
    });

    req.on("timeout", () => {
      console.log(`❌ ${videoId} - TIMEOUT`);
      req.destroy();
      brokenVideos.push(videoId);
      brokenCount++;
      resolve(false);
    });

    req.end();
  });
}

async function checkAllVideos() {
  for (const videoId of uniqueIds) {
    await checkVideo(videoId);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Пауза между запросами
  }

  console.log(`\n📊 Результаты проверки:`);
  console.log(`   ✅ Работающих: ${workingCount}`);
  console.log(`   ❌ Сломанных: ${brokenCount}`);

  if (brokenVideos.length > 0) {
    console.log(`\n🔧 Сломанные видео (требуют замены):`);
    brokenVideos.forEach((id) => {
      console.log(`   - ${id} (https://youtube.com/watch?v=${id})`);
    });
  }
}

checkAllVideos();
