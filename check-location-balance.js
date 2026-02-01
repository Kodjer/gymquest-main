// Проверка баланса квестов по location
const fs = require('fs');
const path = require('path');

const questBankPath = path.join(__dirname, 'src/lib/questBank.ts');
const content = fs.readFileSync(questBankPath, 'utf-8');

// Считаем квесты по location и difficulty
const homeEasy = (content.match(/location: "home"[\s\S]*?difficulty: "easy"/g) || []).length;
const homeEasyReverse = (content.match(/difficulty: "easy"[\s\S]*?location: "home"/g) || []).length;
const gymEasy = (content.match(/location: "gym"[\s\S]*?difficulty: "easy"/g) || []).length;
const gymEasyReverse = (content.match(/difficulty: "easy"[\s\S]*?location: "gym"/g) || []).length;

// Простой подсчет
const homeCount = (content.match(/location: "home"/g) || []).length - 1; // -1 для типа
const gymCount = (content.match(/location: "gym"/g) || []).length;

// Подсчет по сложности
const easyCount = (content.match(/difficulty: "easy"/g) || []).length - 1; // -1 для типа
const mediumCount = (content.match(/difficulty: "medium"/g) || []).length;
const hardCount = (content.match(/difficulty: "hard"/g) || []).length;

console.log('=== БАЛАНС КВЕСТОВ ПО ЛОКАЦИИ ===');
console.log(`Home (дома): ${homeCount}`);
console.log(`Gym (в зале): ${gymCount}`);
console.log('');
console.log('=== БАЛАНС ПО СЛОЖНОСТИ ===');
console.log(`Easy (легкие): ${easyCount}`);
console.log(`Medium (средние): ${mediumCount}`);
console.log(`Hard (сложные): ${hardCount}`);
console.log('');
console.log('=== ИТОГО ===');
console.log(`Всего квестов: ${homeCount + gymCount}`);
console.log(`Разница (home - gym): ${homeCount - gymCount}`);
