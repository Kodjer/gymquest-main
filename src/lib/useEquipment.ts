// src/lib/useEquipment.ts
// Хук для получения экипировки игрока

import { useState, useEffect } from 'react';
import { getShopItem, ShopItem } from './shopData';

export interface Equipment {
  activeFrame: string | null;
  activeTitle: string | null;
  activeAvatar: string | null;
  activeTheme: string | null;
  activePet: string | null;
}

export interface EquipmentItems {
  frame: ShopItem | null;
  title: ShopItem | null;
  avatar: ShopItem | null;
  theme: ShopItem | null;
  pet: ShopItem | null;
}

export interface ActiveBoost {
  id: string;
  boostType: string;
  multiplier: number;
  expiresAt: string;
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItems>({
    frame: null,
    title: null,
    avatar: null,
    theme: null,
    pet: null,
  });
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/shop');
      if (res.ok) {
        const data = await res.json();
        const eq = data.equipment as Equipment;
        setEquipment(eq);
        
        // Получаем полные данные о предметах
        setEquipmentItems({
          frame: eq?.activeFrame ? getShopItem(eq.activeFrame) || null : null,
          title: eq?.activeTitle ? getShopItem(eq.activeTitle) || null : null,
          avatar: eq?.activeAvatar ? getShopItem(eq.activeAvatar) || null : null,
          theme: eq?.activeTheme ? getShopItem(eq.activeTheme) || null : null,
          pet: eq?.activePet ? getShopItem(eq.activePet) || null : null,
        });

        setActiveBoosts(data.activeBoosts || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки экипировки:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Вычисляем множители от бустов и питомцев
  const getXpMultiplier = (): number => {
    let multiplier = 1;
    
    // Бусты
    activeBoosts.forEach(boost => {
      if (boost.boostType === 'xp_multiplier' || boost.boostType === 'mega_boost') {
        multiplier *= boost.multiplier;
      }
    });

    // Бонус от питомца
    if (equipmentItems.pet?.effect) {
      const effect = equipmentItems.pet.effect;
      if (effect.type === 'xp_bonus') {
        multiplier *= (1 + effect.value);
      }
    }

    return multiplier;
  };

  const getCoinMultiplier = (): number => {
    let multiplier = 1;
    
    // Бусты
    activeBoosts.forEach(boost => {
      if (boost.boostType === 'coin_multiplier' || boost.boostType === 'mega_boost') {
        multiplier *= boost.multiplier;
      }
    });

    // Бонус от питомца
    if (equipmentItems.pet?.effect) {
      const effect = equipmentItems.pet.effect;
      if (effect.type === 'coin_bonus') {
        multiplier *= (1 + effect.value);
      }
    }

    return multiplier;
  };

  const getStreakBonus = (): number => {
    let bonus = 0;
    
    // Бонус от питомца
    if (equipmentItems.pet?.effect) {
      const effect = equipmentItems.pet.effect;
      if (effect.type === 'streak_bonus') {
        bonus += effect.value;
      }
    }

    return bonus;
  };

  const hasStreakShield = (): boolean => {
    // Проверяем бусты
    const hasBoostShield = activeBoosts.some(b => b.boostType === 'streak_shield');
    
    // Проверяем питомца с авто-защитой
    const hasPetShield = equipmentItems.pet?.effect?.type === 'auto_streak_shield';

    return hasBoostShield || hasPetShield;
  };

  const getCategoryXpBonus = (category: string): number => {
    // Бонус за категорию от питомца
    if (equipmentItems.pet?.effect) {
      const effect = equipmentItems.pet.effect;
      if (effect.type === 'flexibility_xp_bonus' && category === 'flexibility') {
        return effect.value;
      }
    }
    return 0;
  };

  return {
    equipment,
    equipmentItems,
    activeBoosts,
    loading,
    refetch: fetchEquipment,
    getXpMultiplier,
    getCoinMultiplier,
    getStreakBonus,
    hasStreakShield,
    getCategoryXpBonus,
  };
}
