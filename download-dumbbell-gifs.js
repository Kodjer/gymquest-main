// Скачивает GIF для упражнений с гантелями из открытых источников
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const GIFS_DIR = path.join(__dirname, 'public', 'gifs');

// Список упражнений с гантелями + прямые GIF URL из открытого репозитория
// Используем exercisedb.io или workout GIF ресурсы
const dumbbellGifs = [
  // Жим гантелей лёжа (горизонтальная скамья)
  {
    name: 'dumbbell_bench_press.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/dumbbell-bench-press.gif',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Bench_press_with_dumbbell.gif/320px-Bench_press_with_dumbbell.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_bench_press.gif',
    ]
  },
  // Тяга гантели в наклоне (одна рука)
  {
    name: 'dumbbell_row.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/one-arm-dumbbell-row.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_row.gif',
    ]
  },
  // Разведение / разводка гантелей лёжа
  {
    name: 'dumbbell_fly.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/flat-dumbbell-flyes.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_fly.gif',
    ]
  },
  // Подъёмы гантелей через стороны (латеральные подъёмы)
  {
    name: 'lateral_raise.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/dumbbell-lateral-raise.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/lateral_raise.gif',
    ]
  },
  // Отведение гантели назад (трицепс kickback)
  {
    name: 'dumbbell_kickback.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/dumbbell-tricep-kickbacks.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/tricep_kickback.gif',
    ]
  },
  // Разгибание рук с гантелью из-за головы (overhead extension)
  {
    name: 'overhead_tricep.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/one-arm-overhead-extension.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/overhead_tricep.gif',
    ]
  },
  // Жим гантелей стоя / сидя над головой (жим Арнольда)
  {
    name: 'dumbbell_shoulder_press.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/seated-dumbbell-press.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_shoulder_press.gif',
    ]
  },
  // Жим гантелей на наклонной скамье
  {
    name: 'incline_dumbbell_press.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/incline-dumbbell-bench-press.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/incline_dumbbell_press.gif',
    ]
  },
  // Шраги с гантелями
  {
    name: 'dumbbell_shrug.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/dumbbell-shrug.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_shrug.gif',
    ]
  },
  // Подъёмы на носки
  {
    name: 'calf_raise.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/standing-dumbbell-calf-raises.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/calf_raise.gif',
    ]
  },
  // Подъём гантелей перед собой (фронтальный подъём)
  {
    name: 'front_raise.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/two-arm-dumbbell-front-raise.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/front_raise.gif',
    ]
  },
  // Румынская тяга с гантелями
  {
    name: 'dumbbell_rdl.gif',
    urls: [
      'https://media.muscleandstrength.com/exercises/dumbbell-romanian-deadlift.gif',
      'https://raw.githubusercontent.com/evgenidb/exercise-gif/main/dumbbell_rdl.gif',
    ]
  },
];

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/gif,image/*,*/*',
      },
      timeout: 15000,
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        resolve(downloadFile(response.headers.location, destPath));
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('image') && !contentType.includes('gif') && !contentType.includes('octet-stream')) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Wrong content-type: ${contentType}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        // Проверяем размер файла (минимум 1 KB)
        const stats = fs.statSync(destPath);
        if (stats.size < 1000) {
          fs.unlinkSync(destPath);
          reject(new Error(`File too small: ${stats.size} bytes`));
        } else {
          resolve(true);
        }
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    
    request.on('timeout', () => {
      request.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  console.log('🏋️ Скачиваю GIF для упражнений с гантелями...\n');
  
  const results = { success: [], failed: [] };
  
  for (const exercise of dumbbellGifs) {
    const destPath = path.join(GIFS_DIR, exercise.name);
    
    // Пропускаем если уже есть
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        console.log(`✓ ${exercise.name} — уже есть`);
        results.success.push(exercise.name);
        continue;
      }
    }
    
    let downloaded = false;
    for (const url of exercise.urls) {
      try {
        console.log(`  Пробую: ${url.substring(0, 70)}...`);
        await downloadFile(url, destPath);
        const stats = fs.statSync(destPath);
        console.log(`✅ ${exercise.name} — скачан (${Math.round(stats.size / 1024)} KB)`);
        results.success.push(exercise.name);
        downloaded = true;
        break;
      } catch (err) {
        console.log(`  ❌ Ошибка: ${err.message}`);
      }
    }
    
    if (!downloaded) {
      console.log(`⚠️  ${exercise.name} — не удалось скачать`);
      results.failed.push(exercise.name);
    }
  }
  
  console.log('\n=== РЕЗУЛЬТАТЫ ===');
  console.log(`✅ Скачано: ${results.success.length}`);
  console.log(`❌ Не удалось: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('Не скачанные файлы:', results.failed.join(', '));
  }
}

main().catch(console.error);
