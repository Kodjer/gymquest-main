// src/components/ProgressChart.tsx
import { useMemo } from "react";
import { useAppTheme } from "@/lib/ThemeContext";

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

type NodeProgress = {
  nodeId: string;
  day: number;
  dayName: string;
  completed: number;
  total: number;
  xpGained: number;
  percentage: number;
};

export function ProgressChart({ xpHistory = [], quests = [] }: ProgressChartProps) {
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";

  const nodeProgress = useMemo((): NodeProgress[] => {
    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    return Array.from({ length: 7 }, (_, i) => {
      const day = i + 1;
      const nodeId = `node-${day}`;
      const nodeQuests = quests.filter((q) => q.nodeId === nodeId);
      const completedQuests = nodeQuests.filter((q) => q.status === "done");
      const xpGained = completedQuests.reduce((sum, q) => sum + q.xpReward, 0);
      return {
        nodeId,
        day,
        dayName: dayNames[i],
        completed: completedQuests.length,
        total: nodeQuests.length,
        xpGained,
        percentage: nodeQuests.length > 0 ? (completedQuests.length / nodeQuests.length) * 100 : 0,
      };
    });
  }, [quests]);

  const totalQuests = quests.length;
  const completedCount = quests.filter((q) => q.status === "done").length;
  const totalXp = quests.filter((q) => q.status === "done").reduce((s, q) => s + q.xpReward, 0);
  const completionRate = totalQuests > 0 ? Math.round((completedCount / totalQuests) * 100) : 0;
  const daysCompleted = nodeProgress.filter((n) => n.percentage === 100).length;

  const barColor = (pct: number) => {
    if (pct === 0) return isAlwaysDark ? "bg-white/10" : "bg-black/10 dark:bg-white/10";
    if (pct < 30) return "bg-red-400";
    if (pct < 60) return "bg-amber-400";
    if (pct < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-bold">Прогресс по дням</p>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/70" : "bg-black/8 dark:bg-white/10 opacity-70"}`}>
            {completionRate}%
          </span>
        </div>

        {/* Строки по дням */}
        <div className="space-y-2.5">
          {nodeProgress.map((node) => (
            <div key={node.nodeId} className="flex items-center gap-3">
              {/* День */}
              <div className="w-7 flex-shrink-0 text-center">
                <p className="text-xs font-bold">{node.dayName}</p>
              </div>

              {/* Бар */}
              <div className="flex-1">
                <div className={`w-full h-2 rounded-full overflow-hidden ${isAlwaysDark ? "bg-white/8" : "bg-black/8 dark:bg-white/8"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor(node.percentage)}`}
                    style={{ width: `${node.percentage}%` }}
                  />
                </div>
              </div>

              {/* Дробь */}
              <div className="w-10 text-right flex-shrink-0">
                {node.total > 0 ? (
                  <span className="text-xs font-semibold opacity-60">{node.completed}/{node.total}</span>
                ) : (
                  <span className="text-xs opacity-25">—</span>
                )}
              </div>

              {/* XP */}
              <div className="w-14 text-right flex-shrink-0">
                {node.xpGained > 0 ? (
                  <span className="text-xs text-amber-500 font-semibold">+{node.xpGained}</span>
                ) : (
                  <span className="text-xs opacity-20">0 XP</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Итоговая строка */}
        <div className={`grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-black/8 dark:border-white/8`}>
          <div className={`${colors.insetBg} rounded-xl p-2.5 text-center`}>
            <p className="text-base font-bold">{completedCount}<span className="text-xs opacity-40">/{totalQuests}</span></p>
            <p className="text-[10px] opacity-40 mt-0.5">Квестов</p>
          </div>
          <div className={`${colors.insetBg} rounded-xl p-2.5 text-center`}>
            <p className="text-base font-bold text-amber-500">{totalXp}</p>
            <p className="text-[10px] opacity-40 mt-0.5">XP заработано</p>
          </div>
          <div className={`${colors.insetBg} rounded-xl p-2.5 text-center`}>
            <p className="text-base font-bold text-green-500">{daysCompleted}<span className="text-xs opacity-40">/7</span></p>
            <p className="text-[10px] opacity-40 mt-0.5">Дней</p>
          </div>
        </div>
      </div>
    </div>
  );
}
