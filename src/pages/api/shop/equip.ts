// src/pages/api/shop/equip.ts
// API для экипировки купленных предметов

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
    const { itemId, action } = req.body; // action: 'equip' | 'unequip'

    if (!itemId) {
      return res.status(400).json({ error: "Не указан ID товара" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверка на сброс категории
    if (itemId.startsWith('reset_')) {
      const category = itemId.replace('reset_', '');
      const fieldMap: Record<string, string> = {
        frame: 'activeFrame',
      };

      const field = fieldMap[category];
      if (!field) {
        return res.status(400).json({ error: "Неверная категория для сброса" });
      }

      // Сбрасываем экипировку
      const equipment = await prisma.playerEquipment.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          [field]: null,
        },
        update: {
          [field]: null,
        },
      });

      return res.status(200).json({ 
        success: true, 
        message: "Сброшено на дефолт",
        equipment 
      });
    }

    const item = getShopItem(itemId);
    if (!item) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    // Проверяем, что товар куплен
    const purchase = await prisma.playerPurchase.findUnique({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: item.id,
        },
      },
    });

    if (!purchase) {
      return res.status(400).json({ error: "Товар не куплен" });
    }

    // Определяем поле для обновления
    const fieldMap: Record<string, string> = {
      frame: 'activeFrame',
    };

    const field = fieldMap[item.type];
    if (!field) {
      return res.status(400).json({ error: "Этот тип товара нельзя экипировать" });
    }

    // Обновляем или создаём экипировку
    const equipment = await prisma.playerEquipment.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        [field]: action === 'equip' ? item.id : null,
      },
      update: {
        [field]: action === 'equip' ? item.id : null,
      },
    });

    return res.status(200).json({
      success: true,
      message: action === 'equip' 
        ? `${item.name} экипирован!` 
        : `${item.name} снят`,
      equipment,
    });
  } catch (error) {
    console.error("Ошибка экипировки:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
