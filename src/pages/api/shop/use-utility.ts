// src/pages/api/shop/use-utility.ts
// API для использования утилит из магазина

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
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
      bonus_quest: 200, // Бонусный квест
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

      case "bonus_quest":
        // Добавляем бонусный квест с повышенной наградой
        const bonusQuests = [
          {
            title: "🎁 Бонус: 50 отжиманий",
            description: "Специальный бонусный квест! Выполните 50 отжиманий за любое количество подходов.",
            xpReward: 100,
            difficulty: "hard",
            category: "strength",
          },
          {
            title: "🎁 Бонус: 10 минут планки",
            description: "Специальный бонусный квест! Удерживайте планку суммарно 10 минут.",
            xpReward: 100,
            difficulty: "hard",
            category: "strength",
          },
          {
            title: "🎁 Бонус: 100 приседаний",
            description: "Специальный бонусный квест! Выполните 100 приседаний за любое количество подходов.",
            xpReward: 100,
            difficulty: "hard", 
            category: "strength",
          },
          {
            title: "🎁 Бонус: 30 минут кардио",
            description: "Специальный бонусный квест! Выполните 30 минут любого кардио.",
            xpReward: 100,
            difficulty: "hard",
            category: "cardio",
          },
        ];

        const randomBonus = bonusQuests[Math.floor(Math.random() * bonusQuests.length)];
        const todayBonus = new Date();
        const dayOfWeekBonus = todayBonus.getDay();
        const nodeIdBonus = `node-${dayOfWeekBonus === 0 ? 7 : dayOfWeekBonus}`;

        await prisma.quest.create({
          data: {
            userId: user.id,
            title: randomBonus.title,
            description: randomBonus.description,
            xpReward: randomBonus.xpReward,
            difficulty: randomBonus.difficulty,
            category: randomBonus.category,
            status: "pending",
            isGenerated: false,
            nodeId: nodeIdBonus,
            location: "both",
            showInAllMode: true,
          },
        });

        result = { 
          message: `Добавлен бонусный квест: ${randomBonus.title}`,
          action: "refresh"
        };
        break;
    }

    // Записываем использование утилиты
    await prisma.playerPurchase.create({
      data: {
        userId: user.id,
        itemId: `utility_${utilityType}_${Date.now()}`,
        itemType: "utility",
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
