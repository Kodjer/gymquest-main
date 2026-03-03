// src/pages/api/shop/purchase.ts
// API для покупки товаров в магазине

import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "@/lib/prisma";
import { getShopItem } from "@/lib/shopData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuthSession(req, res);
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  try {
    const { itemId, playerCoins } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "Не указан ID товара" });
    }

    const item = getShopItem(itemId);
    if (!item) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { player: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверяем уровень
    if (item.requiredLevel && (user.player?.level || 1) < item.requiredLevel) {
      return res.status(400).json({ 
        error: `Требуется уровень ${item.requiredLevel}` 
      });
    }

    // Проверяем монеты (передаются с клиента)
    if (playerCoins < item.price) {
      return res.status(400).json({ 
        error: "Недостаточно монет",
        required: item.price,
        current: playerCoins,
      });
    }

    // Проверяем, не куплен ли уже (для постоянных товаров)
    if (item.type !== 'boost' && item.type !== 'utility') {
      const existingPurchase = await prisma.playerPurchase.findUnique({
        where: {
          userId_itemId: {
            userId: user.id,
            itemId: item.id,
          },
        },
      });

      if (existingPurchase) {
        return res.status(400).json({ error: "Товар уже куплен" });
      }
    }

    // Создаём покупку
    if (item.type === 'boost') {
      // Для бустов создаём активный буст
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (item.duration || 24));

      await prisma.activeBoost.create({
        data: {
          userId: user.id,
          boostType: item.effect?.type || 'unknown',
          multiplier: item.effect?.value || 1,
          expiresAt,
        },
      });

      // Также сохраняем в историю покупок
      await prisma.playerPurchase.create({
        data: {
          userId: user.id,
          itemId: item.id,
          itemType: item.type,
          expiresAt,
        },
      });
    } else if (item.type === 'utility') {
      // Утилиты используются сразу, просто записываем в историю
      await prisma.playerPurchase.create({
        data: {
          userId: user.id,
          itemId: `${item.id}_${Date.now()}`, // Уникальный ID для каждой покупки
          itemType: item.type,
        },
      });
    } else {
      // Постоянные товары (рамки, титулы, аватары, темы, питомцы)
      await prisma.playerPurchase.create({
        data: {
          userId: user.id,
          itemId: item.id,
          itemType: item.type,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Вы купили: ${item.name}`,
      item,
      newBalance: playerCoins - item.price,
    });
  } catch (error) {
    console.error("Ошибка покупки:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
