// Детальная проверка баланса квестов по location И difficulty
const fs = require('fs');
const path = require('path');

const questBankPath = path.join(__dirname, 'src/lib/questBank.ts');
const content = fs.readFileSync(questBankPath, 'utf-8');

// Ищем все квесты с их параметрами
const questRegex = /\{\s*title:\s*"([^"]+)"[\s\S]*?difficulty:\s*"(easy|medium|hard)"[\s\S]*?location:\s*"(home|gym)"/g;
const questRegex2 = /\{\s*title:\s*"([^"]+)"[\s\S]*?location:\s*"(home|gym)"[\s\S]*?difficulty:\s*"(easy|medium|hard)"/g;

const quests = [];
let match;

// Парсим оба варианта порядка полей
while ((match = questRegex.exec(content)) !== null) {
  quests.push({
    title: match[1],
    difficulty: match[2],
    location: match[3]
  });
}

const content2 = fs.readFileSync(questBankPath, 'utf-8');
while ((match = questRegex2.exec(content2)) !== null) {
  // Проверяем что квест еще не добавлен
  if (!quests.find(q => q.title === match[1])) {
    quests.push({
      title: match[1],
      difficulty: match[3],
      location: match[2]
    });
  }
}

// Группируем
const homeEasy = quests.filter(q => q.location === 'home' && q.difficulty === 'easy');
const homeMedium = quests.filter(q => q.location === 'home' && q.difficulty === 'medium');
const homeHard = quests.filter(q => q.location === 'home' && q.difficulty === 'hard');

const gymEasy = quests.filter(q => q.location === 'gym' && q.difficulty === 'easy');
const gymMedium = quests.filter(q => q.location === 'gym' && q.difficulty === 'medium');
const gymHard = quests.filter(q => q.location === 'gym' && q.difficulty === 'hard');

console.log('=== ДЕТАЛЬНЫЙ БАЛАНС КВЕСТОВ ===\n');

console.log('HOME (дома):');
console.log(`  Easy: ${homeEasy.length}`);
console.log(`  Medium: ${homeMedium.length}`);
console.log(`  Hard: ${homeHard.length}`);
console.log(`  ИТОГО HOME: ${homeEasy.length + homeMedium.length + homeHard.length}`);

console.log('\nGYM (в зале):');
console.log(`  Easy: ${gymEasy.length}`);
console.log(`  Medium: ${gymMedium.length}`);
console.log(`  Hard: ${gymHard.length}`);
console.log(`  ИТОГО GYM: ${gymEasy.length + gymMedium.length + gymHard.length}`);

console.log('\n=== СРАВНЕНИЕ ПО СЛОЖНОСТИ ===');
console.log(`Easy: ${homeEasy.length} home vs ${gymEasy.length} gym (разница: ${homeEasy.length - gymEasy.length})`);
console.log(`Medium: ${homeMedium.length} home vs ${gymMedium.length} gym (разница: ${homeMedium.length - gymMedium.length})`);
console.log(`Hard: ${homeHard.length} home vs ${gymHard.length} gym (разница: ${homeHard.length - gymHard.length})`);

console.log('\n=== ЛЕГКИЕ КВЕСТЫ ДЛЯ 1 УРОВНЯ ===');
console.log('HOME Easy:');
homeEasy.forEach(q => console.log(`  - ${q.title}`));
console.log('\nGYM Easy:');
gymEasy.forEach(q => console.log(`  - ${q.title}`));
