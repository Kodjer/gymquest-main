// src/lib/shopData.ts
// Каталог товаров магазина GymQuest

export type ShopItemType = 'frame' | 'title' | 'avatar' | 'theme' | 'boost' | 'pet' | 'utility';

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

// 🏷️ Титулы
export const titleItems: ShopItem[] = [
  {
    id: 'title_beginner',
    name: 'Новичок',
    description: 'Каждый мастер когда-то был учеником',
    price: 50,
    type: 'title',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'title_athlete',
    name: 'Атлет',
    description: 'Признание ваших усилий',
    price: 150,
    type: 'title',
    icon: '🏃',
    rarity: 'uncommon',
  },
  {
    id: 'title_ironman',
    name: 'Железный человек',
    description: 'Несгибаемая воля к победе',
    price: 300,
    type: 'title',
    icon: '🦾',
    rarity: 'rare',
  },
  {
    id: 'title_cardio_master',
    name: 'Мастер кардио',
    description: 'Сердце бьётся в ритме победы',
    price: 400,
    type: 'title',
    icon: '❤️‍🔥',
    rarity: 'rare',
  },
  {
    id: 'title_flex_guru',
    name: 'Гуру гибкости',
    description: 'Гибкость тела и разума',
    price: 400,
    type: 'title',
    icon: '🧘',
    rarity: 'rare',
  },
  {
    id: 'title_strength_king',
    name: 'Король силы',
    description: 'Сила, которой завидуют все',
    price: 500,
    type: 'title',
    icon: '👑',
    rarity: 'epic',
  },
  {
    id: 'title_legend',
    name: 'Легенда GymQuest',
    description: 'Ваше имя войдёт в историю',
    price: 1000,
    type: 'title',
    icon: '⭐',
    rarity: 'legendary',
    requiredLevel: 20,
  },
  {
    id: 'title_champion',
    name: 'Чемпион',
    description: 'Непобедимый воин фитнеса',
    price: 800,
    type: 'title',
    icon: '🏆',
    rarity: 'epic',
    requiredLevel: 10,
  },
];

// 👤 Аватары
export const avatarItems: ShopItem[] = [
  {
    id: 'avatar_ninja',
    name: 'Ниндзя',
    description: 'Тихий, быстрый, смертоносный',
    price: 300,
    type: 'avatar',
    icon: '🥷',
    rarity: 'uncommon',
  },
  {
    id: 'avatar_robot',
    name: 'Робот',
    description: 'Машина для тренировок',
    price: 350,
    type: 'avatar',
    icon: '🤖',
    rarity: 'uncommon',
  },
  {
    id: 'avatar_knight',
    name: 'Рыцарь',
    description: 'Благородный защитник здоровья',
    price: 400,
    type: 'avatar',
    icon: '🛡️',
    rarity: 'rare',
  },
  {
    id: 'avatar_alien',
    name: 'Инопланетянин',
    description: 'Тренировки из другой галактики',
    price: 500,
    type: 'avatar',
    icon: '👽',
    rarity: 'rare',
  },
  {
    id: 'avatar_phoenix',
    name: 'Феникс',
    description: 'Возрождение после каждой тренировки',
    price: 800,
    type: 'avatar',
    icon: '🦅',
    rarity: 'epic',
  },
  {
    id: 'avatar_dragon_warrior',
    name: 'Воин дракона',
    description: 'Легендарный мастер боевых искусств',
    price: 1200,
    type: 'avatar',
    icon: '🐲',
    rarity: 'legendary',
    requiredLevel: 15,
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

// 🐾 Питомцы
export const petItems: ShopItem[] = [
  {
    id: 'pet_dog',
    name: 'Пёс-тренер',
    description: 'Верный друг, который всегда мотивирует. +5% XP',
    price: 500,
    type: 'pet',
    icon: '🐕',
    rarity: 'rare',
    effect: { type: 'xp_bonus', value: 0.05 },
  },
  {
    id: 'pet_cat',
    name: 'Кот-йог',
    description: 'Мастер растяжки и релаксации. +10% XP за гибкость',
    price: 500,
    type: 'pet',
    icon: '🐱',
    rarity: 'rare',
    effect: { type: 'flexibility_xp_bonus', value: 0.10 },
  },
  {
    id: 'pet_fox',
    name: 'Лис-скаут',
    description: 'Хитрый и быстрый. +10% бонус серии',
    price: 800,
    type: 'pet',
    icon: '🦊',
    rarity: 'epic',
    effect: { type: 'streak_bonus', value: 0.10 },
  },
  {
    id: 'pet_owl',
    name: 'Сова-мудрец',
    description: 'Знает секреты эффективных тренировок. +5% монет',
    price: 600,
    type: 'pet',
    icon: '🦉',
    rarity: 'rare',
    effect: { type: 'coin_bonus', value: 0.05 },
  },
  {
    id: 'pet_dragon',
    name: 'Дракончик',
    description: 'Легендарный компаньон. +15% XP ко всем квестам',
    price: 2000,
    type: 'pet',
    icon: '🐉',
    rarity: 'legendary',
    effect: { type: 'xp_bonus', value: 0.15 },
    requiredLevel: 20,
  },
  {
    id: 'pet_phoenix',
    name: 'Феникс',
    description: 'Возрождается вместе с вами. Автоматическая защита серии раз в неделю',
    price: 2500,
    type: 'pet',
    icon: '🔥',
    rarity: 'legendary',
    effect: { type: 'auto_streak_shield', value: 1 },
    requiredLevel: 25,
  },
];

// 🎨 Темы интерфейса
export const themeItems: ShopItem[] = [
  {
    id: 'theme_forest',
    name: 'Лесная тема',
    description: 'Спокойствие природы в каждом элементе',
    price: 400,
    type: 'theme',
    icon: '🌲',
    rarity: 'uncommon',
    preview: 'forest',
  },
  {
    id: 'theme_ocean',
    name: 'Океанская тема',
    description: 'Глубины моря вдохновляют',
    price: 400,
    type: 'theme',
    icon: '🌊',
    rarity: 'uncommon',
    preview: 'ocean',
  },
  {
    id: 'theme_sunset',
    name: 'Закатная тема',
    description: 'Тёплые оттенки заката',
    price: 500,
    type: 'theme',
    icon: '🌅',
    rarity: 'rare',
    preview: 'sunset',
  },
  {
    id: 'theme_cyberpunk',
    name: 'Киберпанк',
    description: 'Неоновое будущее уже здесь',
    price: 800,
    type: 'theme',
    icon: '🌆',
    rarity: 'epic',
    preview: 'cyberpunk',
  },
  {
    id: 'theme_galaxy',
    name: 'Галактическая тема',
    description: 'Тренировки среди звёзд',
    price: 1000,
    type: 'theme',
    icon: '🌌',
    rarity: 'legendary',
    preview: 'galaxy',
    requiredLevel: 15,
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
  {
    id: 'utility_bonus_quest',
    name: 'Бонусный квест',
    description: 'Добавляет дополнительный квест с повышенной наградой',
    price: 200,
    type: 'utility',
    icon: '🎯',
    rarity: 'rare',
  },
];

// Все товары магазина
export const allShopItems: ShopItem[] = [
  ...frameItems,
  ...titleItems,
  ...avatarItems,
  ...boostItems,
  ...petItems,
  ...themeItems,
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
  { id: 'frame', name: 'Рамки', icon: '🖼️' },
  { id: 'title', name: 'Титулы', icon: '🏷️' },
  { id: 'avatar', name: 'Аватары', icon: '👤' },
  { id: 'boost', name: 'Бустеры', icon: '⚡' },
  { id: 'pet', name: 'Питомцы', icon: '🐾' },
  { id: 'theme', name: 'Темы', icon: '🎨' },
  { id: 'utility', name: 'Утилиты', icon: '🔧' },
];
