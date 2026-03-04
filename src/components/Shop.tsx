// src/components/Shop.tsx
// Компонент магазина GymQuest

import React, { useState, useEffect } from 'react';
import {
  ShopItem,
  ShopItemType,
  shopCategories,
  allShopItems,
  getShopItemsByType,
  rarityColors,
  rarityNames,
} from '@/lib/shopData';
import { useAppTheme, AppTheme } from '@/lib/ThemeContext';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  playerCoins: number;
  playerLevel: number;
  onPurchase: (item: ShopItem, newBalance: number) => void;
}

interface PurchasedItems {
  [itemId: string]: boolean;
}

interface Equipment {
  activeFrame?: string | null;
  activeTitle?: string | null;
  activeAvatar?: string | null;
  activeTheme?: string | null;
  activePet?: string | null;
}

export function Shop({ isOpen, onClose, playerCoins, playerLevel, onPurchase }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItems>({});
  const [equipment, setEquipment] = useState<Equipment>({});
  const [loading, setLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  // Хук для управления темами
  const { setTheme } = useAppTheme();

  // Загружаем данные магазина при открытии
  useEffect(() => {
    if (isOpen) {
      fetchShopData();
    }
  }, [isOpen]);

  // Блокируем скролл фона когда открыт
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const fetchShopData = async () => {
    try {
      const res = await fetch('/api/shop');
      if (res.ok) {
        const data = await res.json();
        const purchased: PurchasedItems = {};
        data.purchases?.forEach((itemId: string) => {
          purchased[itemId] = true;
        });
        setPurchasedItems(purchased);
        setEquipment(data.equipment || {});
      }
    } catch (error) {
      console.error('Ошибка загрузки магазина:', error);
    }
  };

  // Использование утилит
  const handleUseUtility = async (utilityType: string) => {
    const utilityPrices: Record<string, number> = {
      reroll: 100,
      easy_day: 150,
      bonus_quest: 200,
    };

    const price = utilityPrices[utilityType];
    if (!price || playerCoins < price) {
      setPurchaseMessage('Недостаточно монет');
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/shop/use-utility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utilityType, playerCoins }),
      });

      const data = await res.json();

      if (res.ok) {
        setPurchaseMessage(data.message);
        onPurchase({ price } as ShopItem, data.newBalance);
        setSelectedItem(null);
        if (data.action === 'refresh' || data.action === 'regenerate') {
          setTimeout(() => { window.location.reload(); }, 1500);
        }
      } else {
        setPurchaseMessage(data.error || 'Ошибка');
      }
    } catch (error) {
      setPurchaseMessage('Ошибка соединения');
    } finally {
      setLoading(false);
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    // Для утилит используем другой API
    if (item.type === 'utility') {
      const utilityMap: Record<string, string> = {
        'utility_reroll': 'reroll',
        'utility_easy_day': 'easy_day',
        'utility_bonus_quest': 'bonus_quest',
      };
      const utilityType = utilityMap[item.id];
      if (utilityType) {
        await handleUseUtility(utilityType);
        return;
      }
    }

    if (playerCoins < item.price) {
      setPurchaseMessage('Недостаточно монет');
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (item.requiredLevel && playerLevel < item.requiredLevel) {
      setPurchaseMessage(`Требуется уровень ${item.requiredLevel}`);
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (purchasedItems[item.id] && item.type !== 'boost' && item.type !== 'utility') {
      setPurchaseMessage('Уже куплено');
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, playerCoins }),
      });

      const data = await res.json();

      if (res.ok) {
        setPurchaseMessage(data.message);
        setPurchasedItems(prev => ({ ...prev, [item.id]: true }));
        onPurchase(item, data.newBalance);
        setSelectedItem(null);
      } else {
        setPurchaseMessage(data.error || 'Ошибка');
      }
    } catch (error) {
      setPurchaseMessage('Ошибка покупки');
    } finally {
      setLoading(false);
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const handleEquip = async (item: ShopItem, action: 'equip' | 'unequip') => {
    setLoading(true);
    try {
      const res = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, action }),
      });

      const data = await res.json();

      if (res.ok) {
        setPurchaseMessage(data.message);
        setEquipment(data.equipment);
        if (item.type === 'theme') {
          const themeMap: Record<string, AppTheme> = {
            'theme_forest': 'forest',
            'theme_ocean': 'ocean',
            'theme_sunset': 'sunset',
            'theme_cyberpunk': 'cyberpunk',
            'theme_galaxy': 'galaxy',
          };
          if (action === 'equip' && themeMap[item.id]) {
            setTheme(themeMap[item.id]);
          } else if (action === 'unequip') {
            setTheme('default');
          }
        }
      } else {
        setPurchaseMessage(data.error || 'Ошибка');
      }
    } catch (error) {
      setPurchaseMessage('Ошибка');
    } finally {
      setLoading(false);
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  // Сброс категории на дефолт
  const handleResetCategory = async (category: ShopItemType) => {
    setLoading(true);
    try {
      const res = await fetch('/api/shop/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: `reset_${category}`, action: 'unequip' }),
      });

      const data = await res.json();

      if (res.ok) {
        setPurchaseMessage(`${category === 'theme' ? 'Тема' : 'Экипировка'} сброшена`);
        setEquipment(data.equipment);
        if (category === 'theme') {
          setTheme('default');
        }
      } else {
        setPurchaseMessage(data.error || 'Ошибка сброса');
      }
    } catch (error) {
      setPurchaseMessage('Ошибка сброса');
    } finally {
      setLoading(false);
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  // Проверка есть ли что-то экипировано в категории
  const hasEquippedInCategory = (category: ShopItemType): boolean => {
    switch (category) {
      case 'frame': return !!equipment.activeFrame;
      case 'title': return !!equipment.activeTitle;
      case 'avatar': return !!equipment.activeAvatar;
      case 'theme': return !!equipment.activeTheme;
      case 'pet': return !!equipment.activePet;
      default: return false;
    }
  };

  const isEquipped = (item: ShopItem): boolean => {
    switch (item.type) {
      case 'frame': return equipment.activeFrame === item.id;
      case 'title': return equipment.activeTitle === item.id;
      case 'avatar': return equipment.activeAvatar === item.id;
      case 'theme': return equipment.activeTheme === item.id;
      case 'pet': return equipment.activePet === item.id;
      default: return false;
    }
  };

  const hiddenCategories = ['avatar', 'pet'];
  const visibleCategories = shopCategories.filter(c => !hiddenCategories.includes(c.id));
  const filteredItems = (activeCategory === 'all'
    ? allShopItems
    : getShopItemsByType(activeCategory as ShopItemType)
  ).filter(item => !hiddenCategories.includes(item.type));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full sm:max-w-2xl h-[92vh] sm:max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/8 dark:border-white/8">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Магазин</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
              {playerCoins}
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Сообщение о покупке */}
        {purchaseMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl shadow-lg text-xs font-medium whitespace-nowrap">
            {purchaseMessage}
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Категории */}
          <div className="w-12 sm:w-40 bg-gray-50 dark:bg-gray-800/60 py-2 px-1 sm:px-2 overflow-y-auto border-r border-black/8 dark:border-white/8 flex-shrink-0">
            <div className="space-y-0.5">
              {visibleCategories.map(category => {
                const icons: Record<string, React.ReactElement> = {
                  all:     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
                  frame:   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></svg>,
                  title:   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z"/></svg>,
                  boost:   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
                  theme:   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 16.5l-.87.5M20.66 16.5l-.87-.5M4.21 7.5l-.87-.5M21 12h-1M4 12H3" /><circle cx="12" cy="12" r="4"/></svg>,
                  utility: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                };
                const icon = icons[category.id] ?? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-center sm:justify-start gap-2.5 py-2.5 px-0 sm:px-3 rounded-xl transition-all ${
                      activeCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    title={category.name}
                  >
                    {icon}
                    <span className="hidden sm:inline font-medium text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Товары - правая панель */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            {/* Кнопка сброса на дефолт */}
            {activeCategory !== 'all' && 
             activeCategory !== 'boost' && 
             activeCategory !== 'utility' && 
             hasEquippedInCategory(activeCategory as ShopItemType) && (
              <div className="mb-3">
                <button
                  onClick={() => handleResetCategory(activeCategory as ShopItemType)}
                  disabled={loading}
                  className="text-xs opacity-40 hover:opacity-70 transition-opacity font-medium"
                >
                  Сбросить на дефолт
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {filteredItems.map((item, index) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  owned={purchasedItems[item.id]}
                  equipped={isEquipped(item)}
                  canAfford={playerCoins >= item.price}
                  levelLocked={item.requiredLevel ? playerLevel < item.requiredLevel : false}
                  onSelect={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Модальное окно товара */}
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            owned={purchasedItems[selectedItem.id]}
              equipped={isEquipped(selectedItem)}
              canAfford={playerCoins >= selectedItem.price}
              levelLocked={selectedItem.requiredLevel ? playerLevel < selectedItem.requiredLevel : false}
              playerLevel={playerLevel}
              loading={loading}
              onClose={() => setSelectedItem(null)}
              onPurchase={() => handlePurchase(selectedItem)}
              onEquip={(action) => handleEquip(selectedItem, action)}
            />
          )}
        </div>
    </div>
  );
}

// Карточка товара
interface ShopItemCardProps {
  item: ShopItem;
  index: number;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  levelLocked: boolean;
  onSelect: () => void;
}

function ShopItemCard({ item, index, owned, equipped, canAfford, levelLocked, onSelect }: ShopItemCardProps) {
  const rarityBar: Record<string, string> = {
    common: 'bg-gray-400', uncommon: 'bg-green-500', rare: 'bg-blue-500', epic: 'bg-violet-600', legendary: 'bg-amber-500',
  };
  return (
    <button
      onClick={onSelect}
      className={`relative w-full p-3 rounded-xl text-left transition-all active:scale-[0.97] ${
        equipped
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-400'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {/* Полоска редкости */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${rarityBar[item.rarity] ?? 'bg-gray-400'}`} />

      {/* Бейджи */}
      <div className="absolute top-2 right-2 flex gap-0.5">
        {equipped && <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
        {!equipped && owned && <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>}
        {levelLocked && <span className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-white text-[9px] font-bold">!</span>}
      </div>

      <h3 className="font-semibold text-xs text-gray-900 dark:text-white mt-1 mb-1 leading-tight pr-5">{item.name}</h3>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">{rarityNames[item.rarity]}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${!canAfford && !owned ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
        {item.price}
      </div>
    </button>
  );
}

// Модальное окно товара
interface ItemModalProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  levelLocked: boolean;
  playerLevel: number;
  loading: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onEquip: (action: 'equip' | 'unequip') => void;
}

function ItemModal({ item, owned, equipped, canAfford, levelLocked, playerLevel, loading, onClose, onPurchase, onEquip }: ItemModalProps) {
  const colors = rarityColors[item.rarity];

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-4 bg-black/60" onClick={onClose}>
      <div
        className="relative w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2 sm:pb-3">
          <div className="flex items-center gap-3">
            {item.type === 'frame' && item.preview ? (
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.preview} p-0.5 flex-shrink-0`}>
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <div className={`w-5 h-5 rounded-full ${rarityColors[item.rarity]?.bg ?? 'bg-gray-400'}`} />
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</h3>
              <p className="text-xs opacity-40">{rarityNames[item.rarity]}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/8 hover:bg-black/10 transition-colors text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>

          {/* Эффект */}
          {item.effect && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-600 dark:text-blue-400 font-medium">
              {item.effect.type === 'xp_multiplier' && `XP x${item.effect.value}`}
              {item.effect.type === 'coin_multiplier' && `Монеты x${item.effect.value}`}
              {item.effect.type === 'xp_bonus' && `+${Math.round(item.effect.value * 100)}% XP`}
              {item.effect.type === 'coin_bonus' && `+${Math.round(item.effect.value * 100)}% монет`}
              {item.effect.type === 'streak_bonus' && `+${Math.round(item.effect.value * 100)}% бонус серии`}
              {item.effect.type === 'streak_shield' && `Защита серии`}
              {item.effect.type === 'flexibility_xp_bonus' && `+${Math.round(item.effect.value * 100)}% XP за гибкость`}
              {item.effect.type === 'auto_streak_shield' && `Авто-защита серии раз в неделю`}
              {item.effect.type === 'mega_boost' && `XP x2 + Монеты x2`}
              {item.duration && <span className="ml-1 opacity-60">({item.duration}ч)</span>}
            </div>
          )}

          {/* Уровень */}
          {item.requiredLevel && (
            <div className={`p-2.5 rounded-xl text-xs font-medium ${levelLocked ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
              Требуется уровень {item.requiredLevel}{levelLocked ? ` (ваш: ${playerLevel})` : ''}
            </div>
          )}

          {/* Цена */}
          <div className={`flex items-center gap-1.5 text-base font-bold ${!canAfford && !owned ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500" />
            {item.price}
          </div>

          {/* Кнопки */}
          {!owned ? (
            <button
              onClick={onPurchase}
              disabled={loading || !canAfford || levelLocked}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                loading || !canAfford || levelLocked
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Покупка...' : levelLocked ? 'Уровень недостаточен' : !canAfford ? 'Недостаточно монет' : 'Купить'}
            </button>
          ) : (
            <div className="space-y-2">
              {['frame', 'title', 'theme'].includes(item.type) && (
                <button
                  onClick={() => onEquip(equipped ? 'unequip' : 'equip')}
                  disabled={loading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${
                    loading ? 'bg-gray-300 cursor-not-allowed opacity-50'
                      : equipped ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {loading ? '...' : equipped ? 'Снять' : 'Выбрать'}
                </button>
              )}
              <p className="text-center text-xs text-green-600 dark:text-green-400 font-medium">Куплено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
