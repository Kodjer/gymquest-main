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

  const filteredItems = activeCategory === 'all' 
    ? allShopItems 
    : getShopItemsByType(activeCategory as ShopItemType);

  console.log('Shop isOpen:', isOpen, 'filteredItems:', filteredItems.length);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <h2 className="text-2xl font-bold text-white">Магазин</h2>
            </div>
            <div className="flex items-center gap-4">
              {/* Баланс */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full shadow border border-yellow-200"></div>
                <span className="font-bold text-white text-lg">{playerCoins}</span>
              </div>
              {/* Закрыть */}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <span className="text-white text-xl">✕</span>
              </button>
            </div>
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
          <div className="w-48 bg-gray-100 dark:bg-gray-800 p-3 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {shopCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
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
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
                >
                  <span>🔄</span>
                  <span className="text-sm font-medium">Сбросить на дефолт</span>
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
  const colors = rarityColors[item.rarity];

  return (
    <button
      onClick={onSelect}
      className={`relative w-full p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg ${colors.border} ${colors.bg}`}
    >
        {/* Значки статуса */}
        <div className="absolute top-2 right-2 flex gap-1">
          {owned && (
            <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
          )}
          {equipped && (
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">⭐</span>
          )}
          {levelLocked && (
            <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🔒</span>
          )}
        </div>

        {/* Иконка */}
        <div className="text-4xl mb-2">{item.icon}</div>

        {/* Название */}
        <h3 className={`font-bold text-sm mb-1 ${colors.text}`}>{item.name}</h3>

        {/* Редкость */}
        <span className={`text-xs ${colors.text} opacity-70`}>
          {rarityNames[item.rarity]}
        </span>

        {/* Цена */}
        <div className={`flex items-center justify-center gap-1 mt-2 ${!canAfford && !owned ? 'text-red-500' : ''}`}>
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full"></div>
          <span className="font-bold">{item.price}</span>
        </div>

        {/* Превью рамки */}
        {item.type === 'frame' && item.preview && (
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${item.preview} opacity-50`}></div>
        )}
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
        className={`relative w-full max-w-md p-6 rounded-2xl border-2 ${colors.border} ${colors.bg} dark:bg-gray-800`}
        onClick={e => e.stopPropagation()}
      >
          {/* Закрыть */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ✕
          </button>

          {/* Контент */}
          <div className="text-center">
            {/* Иконка с превью */}
            <div className="relative inline-block mb-4">
              {item.type === 'frame' && item.preview ? (
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.preview} p-1`}>
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-5xl">
                    {item.icon}
                  </div>
                </div>
              ) : (
                <div className="text-6xl">{item.icon}</div>
              )}
            </div>

            {/* Название и редкость */}
            <h3 className={`text-2xl font-bold mb-1 ${colors.text}`}>{item.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border}`}>
              {rarityNames[item.rarity]}
            </span>

            {/* Описание */}
            <p className="mt-4 text-gray-600 dark:text-gray-300">{item.description}</p>

            {/* Эффект для бустов и питомцев */}
            {item.effect && (
              <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400">
                  {item.effect.type === 'xp_multiplier' && `⚡ XP x${item.effect.value}`}
                  {item.effect.type === 'coin_multiplier' && `💰 Монеты x${item.effect.value}`}
                  {item.effect.type === 'xp_bonus' && `⚡ +${Math.round(item.effect.value * 100)}% XP`}
                  {item.effect.type === 'coin_bonus' && `💰 +${Math.round(item.effect.value * 100)}% монет`}
                  {item.effect.type === 'streak_bonus' && `🔥 +${Math.round(item.effect.value * 100)}% бонус серии`}
                  {item.effect.type === 'streak_shield' && `🛡️ Защита серии`}
                  {item.effect.type === 'flexibility_xp_bonus' && `🧘 +${Math.round(item.effect.value * 100)}% XP за гибкость`}
                  {item.effect.type === 'auto_streak_shield' && `🔥 Авто-защита серии раз в неделю`}
                  {item.effect.type === 'mega_boost' && `🎁 XP x2 + Монеты x2`}
                </span>
                {item.duration && (
                  <span className="ml-2 text-gray-500">({item.duration}ч)</span>
                )}
              </div>
            )}

            {/* Требуемый уровень */}
            {item.requiredLevel && (
              <div className={`mt-3 p-2 rounded-lg ${levelLocked ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <span className={levelLocked ? 'text-red-600' : 'text-green-600'}>
                  🔒 Требуется уровень {item.requiredLevel}
                  {levelLocked && ` (ваш: ${playerLevel})`}
                </span>
              </div>
            )}

            {/* Цена */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow"></div>
              <span className={`text-2xl font-bold ${!canAfford && !owned ? 'text-red-500' : ''}`}>
                {item.price}
              </span>
            </div>

            {/* Кнопки */}
            <div className="mt-6 space-y-3">
              {!owned ? (
                <button
                  onClick={onPurchase}
                  disabled={loading || !canAfford || levelLocked}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${
                    loading || !canAfford || levelLocked
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                  }`}
                >
                  {loading ? '⏳ Покупка...' : 
                   levelLocked ? '🔒 Уровень недостаточен' :
                   !canAfford ? '💸 Недостаточно монет' : 
                   '🛒 Купить'}
                </button>
              ) : (
                <>
                  {['frame', 'title', 'avatar', 'theme', 'pet'].includes(item.type) && (
                    <button
                      onClick={() => onEquip(equipped ? 'unequip' : 'equip')}
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : equipped
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                      }`}
                    >
                      {loading ? '⏳...' : equipped ? '❌ Снять' : '✅ Надеть'}
                    </button>
                  )}
                  <div className="text-green-500 font-medium">✓ Куплено</div>
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default Shop;
