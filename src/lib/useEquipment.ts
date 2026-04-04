// src/lib/useEquipment.ts
// Хук для получения экипировки игрока

import { useState, useEffect } from 'react';
import { getShopItem, ShopItem } from './shopData';

export interface Equipment {
  activeFrame: string | null;
}

export interface EquipmentItems {
  frame: ShopItem | null;
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

    return multiplier;
  };

  const hasStreakShield = (): boolean => {
    return activeBoosts.some(b => b.boostType === 'streak_shield');
  };

  return {
    equipment,
    equipmentItems,
    activeBoosts,
    loading,
    refetch: fetchEquipment,
    getXpMultiplier,
    getCoinMultiplier,
    hasStreakShield,
  };
}
