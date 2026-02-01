// check-quest-balance.js
const { questBank } = require("./src/lib/questBank.ts");

function requiresEquipment(quest) {
  const text = `${quest.title || ""} ${quest.description || ""} ${
    quest.instructions || ""
  }`.toLowerCase();

  const equipmentKeywords = [
    "штанг",
    "гантел",
    "гриф",
    "блок",
    "тренажер",
    "скамь",
    "скамей",
    "кроссовер",
    "жим лёжа",
    "жим сидя",
    "машин",
    "рама",
    "эллипс",
    "беговая дорожка",
    "велотренажер",
    "гребной тренажер",
    "верхнего блока",
    "нижнего блока",
    "жим ногами",
    "разводка",
    "сгибание ног",
    "разгибание ног",
    "жим штанги",
    "жим гантелей",
    "тяга штанги",
    "тяга гантелей",
    "румынская тяга",
  ];

  return equipmentKeywords.some((keyword) => text.includes(keyword));
}

console.log("Анализ баланса квестов по категориям:\n");

for (const category in questBank) {
  const quests = questBank[category];

  const easyQuests = quests.filter((q) => q.difficulty === "easy");
  const easyHome = easyQuests.filter((q) => !requiresEquipment(q));
  const easyGym = easyQuests.filter((q) => requiresEquipment(q));

  const mediumQuests = quests.filter((q) => q.difficulty === "medium");
  const mediumHome = mediumQuests.filter((q) => !requiresEquipment(q));
  const mediumGym = mediumQuests.filter((q) => requiresEquipment(q));

  const hardQuests = quests.filter((q) => q.difficulty === "hard");
  const hardHome = hardQuests.filter((q) => !requiresEquipment(q));
  const hardGym = hardQuests.filter((q) => requiresEquipment(q));

  console.log(`\n📦 ${category}:`);
  console.log(
    `  Easy: ${easyQuests.length} (🏠 ${easyHome.length} / 🏋️ ${easyGym.length})`
  );
  console.log(
    `  Medium: ${mediumQuests.length} (🏠 ${mediumHome.length} / 🏋️ ${mediumGym.length})`
  );
  console.log(
    `  Hard: ${hardQuests.length} (🏠 ${hardHome.length} / 🏋️ ${hardGym.length})`
  );
  console.log(
    `  ИТОГО: ${quests.length} (🏠 ${
      easyHome.length + mediumHome.length + hardHome.length
    } / 🏋️ ${easyGym.length + mediumGym.length + hardGym.length})`
  );
}

console.log("\n\n=== ОБЩАЯ СТАТИСТИКА ===");
let totalEasy = 0,
  totalEasyHome = 0,
  totalEasyGym = 0;
let totalMedium = 0,
  totalMediumHome = 0,
  totalMediumGym = 0;
let totalHard = 0,
  totalHardHome = 0,
  totalHardGym = 0;

for (const category in questBank) {
  const quests = questBank[category];

  const easyQuests = quests.filter((q) => q.difficulty === "easy");
  totalEasy += easyQuests.length;
  totalEasyHome += easyQuests.filter((q) => !requiresEquipment(q)).length;
  totalEasyGym += easyQuests.filter((q) => requiresEquipment(q)).length;

  const mediumQuests = quests.filter((q) => q.difficulty === "medium");
  totalMedium += mediumQuests.length;
  totalMediumHome += mediumQuests.filter((q) => !requiresEquipment(q)).length;
  totalMediumGym += mediumQuests.filter((q) => requiresEquipment(q)).length;

  const hardQuests = quests.filter((q) => q.difficulty === "hard");
  totalHard += hardQuests.length;
  totalHardHome += hardQuests.filter((q) => !requiresEquipment(q)).length;
  totalHardGym += hardQuests.filter((q) => requiresEquipment(q)).length;
}

console.log(`\nEasy: ${totalEasy} (🏠 ${totalEasyHome} / 🏋️ ${totalEasyGym})`);
console.log(
  `Medium: ${totalMedium} (🏠 ${totalMediumHome} / 🏋️ ${totalMediumGym})`
);
console.log(`Hard: ${totalHard} (🏠 ${totalHardHome} / 🏋️ ${totalHardGym})`);
console.log(`\nВсего квестов: ${totalEasy + totalMedium + totalHard}`);
console.log(`Домашних: ${totalEasyHome + totalMediumHome + totalHardHome}`);
console.log(`Зальных: ${totalEasyGym + totalMediumGym + totalHardGym}`);

const totalQuests = totalEasy + totalMedium + totalHard;
const totalHome = totalEasyHome + totalMediumHome + totalHardHome;
const totalGym = totalEasyGym + totalMediumGym + totalHardGym;

console.log(
  `\nБаланс: ${((totalHome / totalQuests) * 100).toFixed(1)}% дома / ${(
    (totalGym / totalQuests) *
    100
  ).toFixed(1)}% зал`
);

// Проверка достаточности для генерации 7 дней x 7 квестов = 49 квестов
console.log(`\n⚠️ Для генерации недели (49 квестов) для level 1 нужно:`);
console.log(`  - Легких квестов: 49 (есть ${totalEasy})`);
console.log(
  `  - Легких ДОМАШНИХ: минимум 25 (есть ${totalEasyHome}) ${
    totalEasyHome >= 25 ? "✅" : "❌"
  }`
);
console.log(
  `  - Легких ЗАЛЬНЫХ: минимум 24 (есть ${totalEasyGym}) ${
    totalEasyGym >= 24 ? "✅" : "❌"
  }`
);
