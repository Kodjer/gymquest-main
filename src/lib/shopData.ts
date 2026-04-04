// src/lib/shopData.ts
// Каталог товаров магазина GymQuest

export type ShopItemType = 'frame' | 'boost' | 'utility' | 'consumable' | 'program';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ShopItemType;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  preview?: string; // CSS класс или URL для превью
  duration?: number; // Для бустов - длительность в часах
  effect?: {
    type: string;
    value: number;
  };
  requiredLevel?: number;
}

// 🖼️ Рамки профиля
export const frameItems: ShopItem[] = [
  {
    id: 'frame_bronze',
    name: 'Бронзовая рамка',
    description: 'Простая бронзовая рамка для начинающих',
    price: 100,
    type: 'frame',
    icon: '🥉',
    rarity: 'common',
    preview: 'from-amber-600 to-amber-800',
  },
  {
    id: 'frame_silver',
    name: 'Серебряная рамка',
    description: 'Элегантная серебряная рамка',
    price: 200,
    type: 'frame',
    icon: '🥈',
    rarity: 'uncommon',
    preview: 'from-gray-300 to-gray-500',
  },
  {
    id: 'frame_gold',
    name: 'Золотая рамка',
    description: 'Престижная золотая рамка',
    price: 400,
    type: 'frame',
    icon: '🥇',
    rarity: 'rare',
    preview: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'frame_fire',
    name: 'Огненная рамка',
    description: 'Пылающая рамка для горячих тренировок',
    price: 600,
    type: 'frame',
    icon: '🔥',
    rarity: 'epic',
    preview: 'from-orange-500 via-red-500 to-yellow-500',
  },
  {
    id: 'frame_ice',
    name: 'Ледяная рамка',
    description: 'Холодная как сталь, крепкая как лёд',
    price: 600,
    type: 'frame',
    icon: '❄️',
    rarity: 'epic',
    preview: 'from-cyan-400 via-blue-500 to-indigo-500',
  },
  {
    id: 'frame_lightning',
    name: 'Рамка молнии',
    description: 'Электрическая энергия в каждом пикселе',
    price: 800,
    type: 'frame',
    icon: '⚡',
    rarity: 'epic',
    preview: 'from-yellow-300 via-amber-400 to-yellow-600',
  },
  {
    id: 'frame_dragon',
    name: 'Драконья рамка',
    description: 'Легендарная рамка настоящего чемпиона',
    price: 1500,
    type: 'frame',
    icon: '🐉',
    rarity: 'legendary',
    preview: 'from-purple-600 via-red-500 to-orange-400',
    requiredLevel: 10,
  },
  {
    id: 'frame_galaxy',
    name: 'Галактическая рамка',
    description: 'Сияние тысячи звёзд',
    price: 2000,
    type: 'frame',
    icon: '🌌',
    rarity: 'legendary',
    preview: 'from-indigo-900 via-purple-600 to-pink-500',
    requiredLevel: 15,
  },
];

// 📦 Расходники
export const consumableItems: ShopItem[] = [
  {
    id: 'consumable_protein',
    name: 'Протеиновый шок',
    description: 'x2 XP за следующие 3 часа. Одноразовое использование.',
    price: 120,
    type: 'consumable',
    icon: '⚗️',
    rarity: 'uncommon',
    effect: { type: 'xp_multiplier', value: 2 },
    duration: 3,
  },
  {
    id: 'consumable_double_drop',
    name: 'Двойной дроп',
    description: 'x2 монет за следующие 3 часа.',
    price: 120,
    type: 'consumable',
    icon: '💎',
    rarity: 'uncommon',
    effect: { type: 'coin_multiplier', value: 2 },
    duration: 3,
  },
  {
    id: 'consumable_quest_skip',
    name: 'Пропуск квеста',
    description: 'Засчитать один невыполненный квест без тренировки.',
    price: 200,
    type: 'consumable',
    icon: '🎫',
    rarity: 'rare',
    effect: { type: 'quest_skip', value: 1 },
  },
  {
    id: 'consumable_streak_revival',
    name: 'Восстановление серии',
    description: 'Вернуть один пропущенный день серии.',
    price: 350,
    type: 'consumable',
    icon: '🔰',
    rarity: 'epic',
    effect: { type: 'streak_revival', value: 1 },
  },
];



// ⚡ Бустеры
export const boostItems: ShopItem[] = [
  {
    id: 'boost_xp_small',
    name: 'XP Буст x1.5',
    description: 'Увеличивает получаемый опыт на 50% на 12 часов',
    price: 150,
    type: 'boost',
    icon: '⚡',
    rarity: 'common',
    duration: 12,
    effect: { type: 'xp_multiplier', value: 1.5 },
  },
  {
    id: 'boost_xp_large',
    name: 'XP Буст x2',
    description: 'Двойной опыт на 24 часа!',
    price: 250,
    type: 'boost',
    icon: '⚡',
    rarity: 'uncommon',
    duration: 24,
    effect: { type: 'xp_multiplier', value: 2 },
  },
  {
    id: 'boost_coins_small',
    name: 'Буст монет x1.5',
    description: 'Увеличивает получаемые монеты на 50% на 12 часов',
    price: 150,
    type: 'boost',
    icon: '💰',
    rarity: 'common',
    duration: 12,
    effect: { type: 'coin_multiplier', value: 1.5 },
  },
  {
    id: 'boost_coins_large',
    name: 'Буст монет x2',
    description: 'Двойные монеты на 24 часа!',
    price: 250,
    type: 'boost',
    icon: '💰',
    rarity: 'uncommon',
    duration: 24,
    effect: { type: 'coin_multiplier', value: 2 },
  },
  {
    id: 'boost_streak_shield',
    name: 'Защита серии',
    description: 'Защищает вашу серию при пропуске одного дня',
    price: 300,
    type: 'boost',
    icon: '🛡️',
    rarity: 'rare',
    effect: { type: 'streak_shield', value: 1 },
  },
  {
    id: 'boost_mega_pack',
    name: 'Мега-буст пак',
    description: 'XP x2 + Монеты x2 на 24 часа',
    price: 400,
    type: 'boost',
    icon: '🎁',
    rarity: 'epic',
    duration: 24,
    effect: { type: 'mega_boost', value: 2 },
  },
];



// 🗓️ Программы тренировок
export const programItems: ShopItem[] = [
  {
    id: 'program_power_week',
    name: 'Силовая неделя',
    description: '7 дней фокуса на силе. +20% XP за все квесты в течение недели.',
    price: 400,
    type: 'program',
    icon: '💪',
    rarity: 'rare',
    duration: 168, // 7 дней в часах
    effect: { type: 'xp_multiplier', value: 1.2 },
  },
  {
    id: 'program_cardio_2weeks',
    name: 'Кардио-марафон',
    description: '14 дней интенсивного кардио. +25% XP за все квесты.',
    price: 700,
    type: 'program',
    icon: '🏃',
    rarity: 'epic',
    duration: 336, // 14 дней в часах
    effect: { type: 'xp_multiplier', value: 1.25 },
  },
  {
    id: 'program_fullbody_month',
    name: 'Тотальная прокачка',
    description: '30 дней комплексной программы. +30% XP + +30% монет за все квесты.',
    price: 1200,
    type: 'program',
    icon: '🔥',
    rarity: 'legendary',
    duration: 720, // 30 дней в часах
    effect: { type: 'mega_boost', value: 1.3 },
    requiredLevel: 5,
  },
];

// 🔧 Утилиты
export const utilityItems: ShopItem[] = [
  {
    id: 'utility_reroll',
    name: 'Перегенерация квестов',
    description: 'Получите новые квесты на сегодня',
    price: 100,
    type: 'utility',
    icon: '🔄',
    rarity: 'common',
  },
  {
    id: 'utility_easy_day',
    name: 'Лёгкий день',
    description: 'Уменьшает сложность всех квестов на сегодня',
    price: 150,
    type: 'utility',
    icon: '😌',
    rarity: 'uncommon',
  },
];

// Все товары магазина
export const allShopItems: ShopItem[] = [
  ...consumableItems,
  ...programItems,
  ...frameItems,
  ...boostItems,
  ...utilityItems,
];

// Получить товар по ID
export function getShopItem(itemId: string): ShopItem | undefined {
  return allShopItems.find(item => item.id === itemId);
}

// Получить товары по типу
export function getShopItemsByType(type: ShopItemType): ShopItem[] {
  return allShopItems.filter(item => item.type === type);
}

// Цвета редкости
export const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
  uncommon: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-400' },
  rare: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-400' },
  epic: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-400' },
  legendary: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-400' },
};

// Названия редкости на русском
export const rarityNames: Record<string, string> = {
  common: 'Обычный',
  uncommon: 'Необычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

// Категории магазина
export const shopCategories = [
  { id: 'all', name: 'Все', icon: '🛒' },
  { id: 'consumable', name: 'Расходники', icon: '📦' },
  { id: 'program', name: 'Программы', icon: '🗓️' },
  { id: 'frame', name: 'Рамки', icon: '🖼️' },
  { id: 'boost', name: 'Бустеры', icon: '⚡' },
  { id: 'utility', name: 'Утилиты', icon: '🔧' },
];
