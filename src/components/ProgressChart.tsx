// src/components/ProgressChart.tsx
import dayjs from "dayjs";
import { useMemo } from "react";

// Тип записи истории XP
export interface XpEntry {
  xp: number;
  time: number;
}

type Quest = {
  id: string;
  nodeId?: string;
  status: "pending" | "done";
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  title?: string;
};

interface ProgressChartProps {
  xpHistory?: XpEntry[];
  quests?: Quest[];
}

interface DayActivity {
  date: string;
  count: number;
  xpGained: number;
}

type NodeProgress = {
  nodeId: string;
  day: number;
  dayName: string;
  completed: number;
  total: number;
  xpGained: number;
  percentage: number;
};

export function ProgressChart({
  xpHistory = [],
  quests = [],
}: ProgressChartProps) {
  // Вычисляем прогресс по узлам (node-1 до node-7 = дни недели)
  const nodeProgress = useMemo((): NodeProgress[] => {
    const nodes: NodeProgress[] = [];
    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    for (let day = 1; day <= 7; day++) {
      const nodeId = `node-${day}`;
      const nodeQuests = quests.filter((q) => q.nodeId === nodeId);
      const completedQuests = nodeQuests.filter((q) => q.status === "done");
      const xpGained = completedQuests.reduce((sum, q) => sum + q.xpReward, 0);

      nodes.push({
        nodeId,
        day,
        dayName: dayNames[day - 1],
        completed: completedQuests.length,
        total: nodeQuests.length,
        xpGained,
        percentage:
          nodeQuests.length > 0
            ? (completedQuests.length / nodeQuests.length) * 100
            : 0,
      });
    }

    return nodes;
  }, [quests]);

  // Общая статистика
  const totalQuests = quests.length;
  const completedQuestsCount = quests.filter((q) => q.status === "done").length;
  const totalXpEarned = quests
    .filter((q) => q.status === "done")
    .reduce((sum, q) => sum + q.xpReward, 0);
  const completionRate =
    totalQuests > 0
      ? Math.round((completedQuestsCount / totalQuests) * 100)
      : 0;

  // Получаем максимальное значение для масштабирования
  const maxTotal = Math.max(...nodeProgress.map((n) => n.total), 1);

  // Функция для определения цвета в зависимости от процента выполнения
  const getNodeColor = (percentage: number) => {
    if (percentage === 0) return "bg-gray-300 dark:bg-gray-700/30";
    if (percentage < 30) return "bg-red-400 dark:bg-red-500/50";
    if (percentage < 60) return "bg-yellow-400 dark:bg-yellow-500/50";
    if (percentage < 100) return "bg-blue-400 dark:bg-blue-500/50";
    return "bg-green-500 dark:bg-green-500/70";
  };

  // Функция для получения цвета прогресс-бара
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return "bg-gray-400";
    if (percentage < 30) return "bg-gradient-to-r from-red-500 to-red-600";
    if (percentage < 60)
      return "bg-gradient-to-r from-yellow-500 to-orange-500";
    if (percentage < 100) return "bg-gradient-to-r from-blue-500 to-purple-500";
    return "bg-gradient-to-r from-green-500 to-emerald-600";
  };

  // Получаем высоту столбца
  const getBarHeight = (total: number) => {
    if (total === 0) return 12;
    const minHeight = 24;
    const maxHeight = 96;
    const ratio = total / maxTotal;
    return minHeight + (maxHeight - minHeight) * ratio;
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-purple-500/20 shadow-lg">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Прогресс по дням
        </h3>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {completionRate}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            выполнено
          </div>
        </div>
      </div>

      {/* График по узлам/дням */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3 h-32 mt-16">
          {nodeProgress.map((node) => (
            <div
              key={node.nodeId}
              className="flex-1 flex flex-col items-center gap-2 group relative"
            >
              {/* Столбец с количеством квестов */}
              <div className="w-full flex flex-col justify-end items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${getNodeColor(
                    node.percentage
                  )} hover:opacity-80 cursor-pointer flex items-end justify-center pb-1`}
                  style={{ height: `${getBarHeight(node.total)}px` }}
                >
                  {node.total > 0 && (
                    <span className="text-xs font-bold text-white dark:text-gray-900">
                      {node.completed}/{node.total}
                    </span>
                  )}
                </div>

                {/* Прогресс-бар под столбцом */}
                {node.total > 0 && (
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressColor(
                        node.percentage
                      )}`}
                      style={{ width: `${node.percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Подсказка при наведении */}
              {node.total > 0 && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl">
                  <div className="font-semibold text-purple-300">
                    День {node.day} - {node.dayName}
                  </div>
                  <div className="text-white">
                    {node.completed} из {node.total} квестов
                  </div>
                  <div className="text-green-300">+{node.xpGained} XP</div>
                  <div className="text-blue-300">
                    {node.percentage.toFixed(0)}% выполнено
                  </div>
                  {/* Треугольник */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}

              {/* День недели */}
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {node.dayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                День {node.day}
              </div>
            </div>
          ))}
        </div>

        {/* Легенда */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-700/30"></div>
            <span>Нет квестов</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span>&lt;30%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-yellow-400"></div>
            <span>30-60%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-blue-400"></div>
            <span>60-99%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>100%</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {completedQuestsCount}/{totalQuests}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Квестов выполнено
            </div>
          </div>
          <div className="bg-green-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalXpEarned}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              XP заработано
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {nodeProgress.filter((n) => n.percentage === 100).length}/7
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Дней завершено
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
