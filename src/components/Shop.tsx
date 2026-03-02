// src/components/Shop.tsx
// Компонент магазина GymQuest

import { useState, useEffect } from 'react';
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
      setPurchaseMessage('❌ Недостаточно монет!');
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
        setPurchaseMessage(`✅ ${data.message}`);
        onPurchase({ price } as ShopItem, data.newBalance);
        setSelectedItem(null);
        
        // Если нужно обновить страницу
        if (data.action === 'refresh' || data.action === 'regenerate') {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setPurchaseMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setPurchaseMessage('❌ Ошибка');
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
      setPurchaseMessage('❌ Недостаточно монет!');
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (item.requiredLevel && playerLevel < item.requiredLevel) {
      setPurchaseMessage(`❌ Требуется уровень ${item.requiredLevel}`);
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    if (purchasedItems[item.id] && item.type !== 'boost' && item.type !== 'utility') {
      setPurchaseMessage('❌ Уже куплено!');
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
        setPurchaseMessage(`✅ ${data.message}`);
        setPurchasedItems(prev => ({ ...prev, [item.id]: true }));
        onPurchase(item, data.newBalance);
        setSelectedItem(null);
      } else {
        setPurchaseMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setPurchaseMessage('❌ Ошибка покупки');
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
        setPurchaseMessage(`✅ ${data.message}`);
        setEquipment(data.equipment);
        
        // Если это тема - применяем её сразу
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
        setPurchaseMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setPurchaseMessage('❌ Ошибка');
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
        setPurchaseMessage(`✅ ${category === 'theme' ? 'Тема' : 'Экипировка'} сброшена`);
        setEquipment(data.equipment);
        
        // Если сбрасываем тему - применяем дефолт
        if (category === 'theme') {
          setTheme('default');
        }
      } else {
        setPurchaseMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setPurchaseMessage('❌ Ошибка сброса');
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 dark:border-white/8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Магазин</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-sm font-semibold">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
              {playerCoins}
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full opacity-40 hover:opacity-70 transition-opacity text-gray-900 dark:text-white">
              ✕
            </button>
          </div>
        </div>

        {/* Сообщение о покупке */}
        {purchaseMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-gray-900 text-white rounded-xl shadow-lg animate-bounce">
            {purchaseMessage}
          </div>
        )}

        {/* Основной контент - категории слева, товары справа */}
        <div className="flex flex-1 overflow-hidden">
          {/* Категории - левая панель */}
          <div className="w-44 bg-gray-50 dark:bg-gray-800/60 p-2 overflow-y-auto border-r border-black/8 dark:border-white/8">
            <div className="space-y-1">
              {visibleCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${
                    activeCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Товары - правая панель */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Кнопка сброса на дефолт */}
            {activeCategory !== 'all' && 
             activeCategory !== 'boost' && 
             activeCategory !== 'utility' && 
             hasEquippedInCategory(activeCategory as ShopItemType) && (
              <div className="mb-4">
                <button
                  onClick={() => handleResetCategory(activeCategory as ShopItemType)}
                  disabled={loading}
                  className="text-xs opacity-40 hover:opacity-70 transition-opacity font-medium"
                >
                  Сбросить на дефолт
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
  return (
    <button
      onClick={onSelect}
      className={`relative w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02] ${
        equipped
          ? 'bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-400'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {/* Значки */}
      <div className="absolute top-2 right-2 flex gap-1">
        {equipped && <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>}
        {!equipped && owned && <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>}
        {levelLocked && <span className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center text-white text-[10px]">!</span>}
      </div>

      <div className="text-3xl mb-2">{item.icon}</div>
      <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">{item.name}</h3>
      <p className="text-xs opacity-40 mb-2">{rarityNames[item.rarity]}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${!canAfford && !owned ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            {item.type === 'frame' && item.preview ? (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.preview} p-0.5 flex-shrink-0`}>
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">{item.icon}</div>
              </div>
            ) : (
              <span className="text-4xl">{item.icon}</span>
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
              <p className="text-xs opacity-40">{rarityNames[item.rarity]}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full opacity-40 hover:opacity-70 transition-opacity text-gray-900 dark:text-white">✕</button>
        </div>

        <div className="px-5 pb-5 space-y-3">
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
              <p className="text-center text-xs text-green-600 dark:text-green-400 font-medium">✓ Куплено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
