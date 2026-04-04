// src/pages/api/shop/index.ts
// API для получения товаров магазина и покупок игрока

import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "@/lib/prisma";
import { allShopItems, getShopItemsByType, ShopItemType } from "@/lib/shopData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuthSession(req, res);
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { player: true },
      });

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      // Получаем покупки игрока
      const purchases = await prisma.playerPurchase.findMany({
        where: { userId: user.id },
      });

      // Получаем экипировку игрока
      let equipment = await prisma.playerEquipment.findUnique({
        where: { userId: user.id },
      });

      // Если экипировки нет, создаём пустую
      if (!equipment) {
        equipment = await prisma.playerEquipment.create({
          data: { userId: user.id },
        });
      }

      // Получаем активные бусты
      const activeBoosts = await prisma.activeBoost.findMany({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      // Фильтруем товары по типу, если указан
      const { type } = req.query;
      let items = allShopItems;
      if (type && type !== 'all') {
        items = getShopItemsByType(type as ShopItemType);
      }

      // Добавляем информацию о владении и доступности
      const itemsWithOwnership = items.map(item => ({
        ...item,
        owned: purchases.some(p => p.itemId === item.id),
        equipped: equipment?.activeFrame === item.id,
        canAfford: (user.player?.xp || 0) >= 0, // Проверяем монеты на клиенте
        levelLocked: item.requiredLevel ? (user.player?.level || 1) < item.requiredLevel : false,
      }));

      return res.status(200).json({
        items: itemsWithOwnership,
        purchases: purchases.map(p => p.itemId),
        equipment,
        activeBoosts,
        playerCoins: 0, // Монеты храним на клиенте, но можем синхронизировать
      });
    } catch (error) {
      console.error("Ошибка получения магазина:", error);
      return res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  return res.status(405).json({ error: "Метод не разрешён" });
}
