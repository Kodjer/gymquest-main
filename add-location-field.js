// Скрипт для добавления поля location ко всем квестам в questBank.ts
const fs = require('fs');

const content = fs.readFileSync('src/lib/questBank.ts', 'utf-8');

// Список упражнений которые требуют инвентарь (gym)
const gymExercises = [
  // С гантелями
  'гантел', 'Гантел',
  // С турником
  'турник', 'Турник', 'подтягива', 'Подтягива',
  // С брусьями  
  'брусь', 'Брусь',
  // Со штангой
  'штанг', 'Штанг',
  // С велосипедом
  'велосипед', 'Велосипед', 'велопрогулк', 'Велопрогулк', 'велозаезд', 'Велозаезд', 'велопоездк', 'Велопоездк', 'велогонк', 'Велогонк',
  // С роликами
  'ролик', 'Ролик', 'роллер', 'Роллер',
  // Со скакалкой
  'скакалк', 'Скакалк',
  // С лавочкой/скамьей
  'лавочк', 'Лавочк', 'скамь', 'Скамь',
  // Тренажеры
  'тренажер', 'Тренажер', 'Смит', 'блок', 'Блок', 'кроссовер',
  // Воркаут (требует площадку)
  'воркаут', 'Воркаут',
];

// Функция проверки нужен ли инвентарь
function needsGym(title, instructions, description) {
  const text = `${title} ${instructions} ${description}`.toLowerCase();
  return gymExercises.some(term => text.toLowerCase().includes(term.toLowerCase()));
}

// Находим все квесты и добавляем location
let result = content;

// Регулярка для поиска baseXP без location после
const regex = /(baseXP:\s*\d+),(\s*(?:visualDemo|stepByStep|\}|$))/g;

// Подсчитываем
let homeCount = 0;
let gymCount = 0;

// Парсим файл построчно чтобы определить контекст
const lines = content.split('\n');
let currentTitle = '';
let currentInstructions = '';
let currentDescription = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('title:')) {
    const match = line.match(/title:\s*["']([^"']+)["']/);
    if (match) currentTitle = match[1];
  }
  if (line.includes('instructions:')) {
    const match = line.match(/instructions:\s*["']([^"']+)["']/);
    if (match) currentInstructions = match[1];
  }
  if (line.includes('description:')) {
    const match = line.match(/description:\s*["']([^"']+)["']/);
    if (match) currentDescription = match[1];
  }
  
  // Если нашли baseXP и после него нет location
  if (line.includes('baseXP:') && !lines[i+1]?.includes('location:')) {
    const isGym = needsGym(currentTitle, currentInstructions, currentDescription);
    const location = isGym ? 'gym' : 'home';
    
    if (isGym) gymCount++;
    else homeCount++;
    
    // Добавляем location после baseXP
    lines[i] = line.replace(/(baseXP:\s*\d+),?/, `$1,\n      location: "${location}",`);
  }
}

console.log(`Home: ${homeCount}, Gym: ${gymCount}`);

fs.writeFileSync('src/lib/questBank.ts', lines.join('\n'), 'utf-8');
console.log('Done!');
