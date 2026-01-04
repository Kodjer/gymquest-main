// src/components/ProgressChart.tsx
import dayjs from "dayjs";
import { useMemo } from "react";

// Тип записи истории XP
export interface XpEntry {
  xp: number;
  time: number;
}

interface ProgressChartProps {
  xpHistory: XpEntry[];
}

interface DayActivity {
  date: string;
  count: number;
  xpGained: number;
}

export function ProgressChart({ xpHistory }: ProgressChartProps) {
  // Группируем активность по дням
  const dailyActivity = useMemo(() => {
    const activityMap = new Map<string, DayActivity>();

    xpHistory.forEach((entry, index) => {
      const dateKey = dayjs(entry.time).format("YYYY-MM-DD");

      if (!activityMap.has(dateKey)) {
        activityMap.set(dateKey, {
          date: dateKey,
          count: 0,
          xpGained: 0,
        });
      }

      const dayData = activityMap.get(dateKey)!;
      dayData.count++;

      // Вычисляем прирост XP за этот день
      if (index > 0) {
        const prevXp = xpHistory[index - 1].xp;
        dayData.xpGained += entry.xp - prevXp;
      }
    });

    return Array.from(activityMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [xpHistory]);

  // Последние 14 дней для отображения
  const last14Days = useMemo(() => {
    const days = [];
    const today = dayjs();

    for (let i = 13; i >= 0; i--) {
      const date = today.subtract(i, "day");
      const dateKey = date.format("YYYY-MM-DD");
      const activity = dailyActivity.find((d) => d.date === dateKey);

      days.push({
        date: dateKey,
        day: date.format("DD"),
        dayName: date.format("dd"),
        count: activity?.count || 0,
        xpGained: activity?.xpGained || 0,
        isToday: i === 0,
      });
    }

    return days;
  }, [dailyActivity]);

  // Вычисляем текущий стрик
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    // Проверяем, была ли активность сегодня или вчера
    const hasActivityToday = dailyActivity.some((d) => d.date === today);
    const hasActivityYesterday = dailyActivity.some(
      (d) => d.date === yesterday
    );

    if (!hasActivityToday && !hasActivityYesterday) {
      return 0;
    }

    // Считаем стрик с конца
    for (let i = 0; i < 365; i++) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      const hasActivity = dailyActivity.some((d) => d.date === date);

      if (hasActivity) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [dailyActivity]);

  // Получаем максимальное значение для масштабирования
  const maxCount = Math.max(...last14Days.map((d) => d.count), 1);

  // Функция для определения цвета в зависимости от активности
  const getActivityColor = (count: number) => {
    if (count === 0) return "bg-gray-300 dark:bg-gray-700/30";
    if (count < 2) return "bg-purple-300 dark:bg-purple-500/40";
    if (count < 4) return "bg-purple-400 dark:bg-purple-500/60";
    if (count < 6) return "bg-purple-500 dark:bg-purple-500/80";
    return "bg-purple-600 dark:bg-purple-500";
  };

  // Получаем высоту столбца
  const getBarHeight = (count: number) => {
    if (count === 0) return 8;
    const minHeight = 16;
    const maxHeight = 80;
    const ratio = count / maxCount;
    return minHeight + (maxHeight - minHeight) * ratio;
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-purple-500/20 shadow-lg">
      {/* Заголовок с стриком */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Твой прогресс</h3>
        <div className="flex items-center gap-2">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">
              {currentStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentStreak === 1
                ? "день"
                : currentStreak < 5
                ? "дня"
                : "дней"}
            </div>
          </div>
        </div>
      </div>

      {/* График активности */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2 h-28">
          {last14Days.map((day) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-2 group relative"
            >
              {/* Столбец */}
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${getActivityColor(
                  day.count
                )} ${
                  day.isToday ? "ring-2 ring-purple-400" : ""
                } hover:opacity-80 cursor-pointer`}
                style={{ height: `${getBarHeight(day.count)}px` }}
              >
                {/* Подсказка при наведении */}
                {day.count > 0 && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    <div className="font-semibold">
                      {dayjs(day.date).format("DD MMM")}
                    </div>
                    <div className="text-purple-300">
                      {day.count} {day.count === 1 ? "квест" : "квестов"}
                    </div>
                    <div className="text-green-300">+{day.xpGained} XP</div>
                    {/* Треугольник */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>

              {/* День недели */}
              <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                {day.dayName}
              </div>
            </div>
          ))}
        </div>

        {/* Легенда */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-700/30"></div>
            <span>Нет активности</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-purple-300 dark:bg-purple-500/40"></div>
            <span>Низкая</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-purple-600 dark:bg-purple-500"></div>
            <span>Высокая</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dailyActivity.reduce((sum, d) => sum + d.count, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Всего квестов</div>
          </div>
          <div className="bg-green-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dailyActivity.reduce((sum, d) => sum + d.xpGained, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Всего XP</div>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dailyActivity.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Активных дней</div>
          </div>
        </div>
      </div>
    </div>
  );
}
