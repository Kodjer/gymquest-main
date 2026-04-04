// src/pages/api/shop/use-utility.ts
// API для использования утилит из магазина

import { NextApiRequest, NextApiResponse } from "next";
import { getAuthSession } from "../../../lib/getAuthSession";
import { prisma } from "@/lib/prisma";

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
    const { utilityType, playerCoins } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { player: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Цены утилит
    const utilityPrices: Record<string, number> = {
      reroll: 100,      // Перегенерация квестов
      easy_day: 150,    // Лёгкий день
      protein: 120,     // Протеиновый шок
      double_drop: 120, // Двойной дроп
      quest_skip: 200,  // Пропуск квеста
      streak_revival: 350, // Восстановление серии
    };

    const price = utilityPrices[utilityType];
    if (!price) {
      return res.status(400).json({ error: "Неизвестная утилита" });
    }

    if (playerCoins < price) {
      return res.status(400).json({ error: "Недостаточно монет" });
    }

    let result: { message: string; action?: string } = { message: "" };

    switch (utilityType) {
      case "reroll":
        // Удаляем pending квесты на сегодня и регенерируем
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Находим текущий nodeId (день недели)
        const dayOfWeek = today.getDay(); // 0 = воскресенье
        const nodeId = `node-${dayOfWeek === 0 ? 7 : dayOfWeek}`;
        
        // Удаляем только pending квесты текущего дня
        await prisma.quest.deleteMany({
          where: {
            userId: user.id,
            nodeId: nodeId,
            status: "pending",
          },
        });

        result = { 
          message: "Квесты перегенерированы! Обновите страницу.",
          action: "regenerate"
        };
        break;

      case "easy_day":
        // Уменьшаем сложность всех pending квестов на сегодня
        const todayEasy = new Date();
        todayEasy.setHours(0, 0, 0, 0);
        const dayOfWeekEasy = todayEasy.getDay();
        const nodeIdEasy = `node-${dayOfWeekEasy === 0 ? 7 : dayOfWeekEasy}`;

        // Обновляем сложность: hard -> medium, medium -> easy
        await prisma.quest.updateMany({
          where: {
            userId: user.id,
            nodeId: nodeIdEasy,
            status: "pending",
            difficulty: "hard",
          },
          data: { difficulty: "medium" },
        });

        await prisma.quest.updateMany({
          where: {
            userId: user.id,
            nodeId: nodeIdEasy,
            status: "pending",
            difficulty: "medium",
          },
          data: { difficulty: "easy" },
        });

        result = { 
          message: "Сложность квестов снижена! Обновите страницу.",
          action: "refresh"
        };
        break;

      case "protein":
        // XP x2 на 3 часа
        {
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 3);
          await prisma.activeBoost.create({
            data: {
              userId: user.id,
              boostType: 'xp_multiplier',
              multiplier: 2,
              expiresAt,
            },
          });
          result = { message: 'Протеиновый шок активирован! XP x2 на 3 часа.' };
        }
        break;

      case "double_drop":
        // Монеты x2 на 3 часа
        {
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 3);
          await prisma.activeBoost.create({
            data: {
              userId: user.id,
              boostType: 'coin_multiplier',
              multiplier: 2,
              expiresAt,
            },
          });
          result = { message: 'Двойной дроп активирован! Монеты x2 на 3 часа.' };
        }
        break;

      case "quest_skip":
        // Засчитать один pending квест как выполненный
        {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayOfWeek = today.getDay();
          const nodeId = `node-${dayOfWeek === 0 ? 7 : dayOfWeek}`;

          const pendingQuest = await prisma.quest.findFirst({
            where: { userId: user.id, nodeId, status: 'pending' },
          });

          if (!pendingQuest) {
            return res.status(400).json({ error: 'Нет активных квестов для пропуска' });
          }

          await prisma.quest.update({
            where: { id: pendingQuest.id },
            data: { status: 'completed' },
          });

          result = { message: `Квест "${pendingQuest.title}" засчитан!`, action: 'refresh' };
        }
        break;

      case "streak_revival":
        // Восстановить серию — установить lastQuestDate на вчера
        {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          await prisma.player.update({
            where: { userId: user.id },
            data: { lastQuestDate: yesterdayStr },
          });

          result = { message: 'Серия восстановлена! Сделайте хотя бы один квест сегодня.' };
        }
        break;
    }

    // Записываем использование
    const isConsumable = ['protein', 'double_drop', 'quest_skip', 'streak_revival'].includes(utilityType);
    await prisma.playerPurchase.create({
      data: {
        userId: user.id,
        itemId: `${isConsumable ? 'consumable' : 'utility'}_${utilityType}_${Date.now()}`,
        itemType: isConsumable ? 'consumable' : 'utility',
      },
    });

    return res.status(200).json({
      success: true,
      ...result,
      newBalance: playerCoins - price,
    });
  } catch (error) {
    console.error("Ошибка использования утилиты:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
}
