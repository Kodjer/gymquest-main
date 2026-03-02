// src/components/Achievements.tsx
import { useAppTheme } from "@/lib/ThemeContext";

interface Quest {
  id: string;
  title: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
}

interface Player {
  xp: number;
  level: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "quests" | "xp" | "streak" | "difficulty";
}

interface AchievementsProps {
  player: Player;
  quests: Quest[];
}

const categoryMeta: Record<Achievement["category"], { label: string; bar: string }> = {
  quests:     { label: "Квесты",    bar: "bg-blue-500" },
  xp:         { label: "Опыт",      bar: "bg-violet-500" },
  streak:     { label: "Серия",     bar: "bg-orange-500" },
  difficulty: { label: "Сложность", bar: "bg-red-500" },
};

export function Achievements({ player, quests }: AchievementsProps) {
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";

  const completedQuests = quests.filter((q) => q.status === "done");
  const totalCompleted = completedQuests.length;
  const easyCompleted = completedQuests.filter((q) => q.difficulty === "easy").length;
  const mediumCompleted = completedQuests.filter((q) => q.difficulty === "medium").length;
  const hardCompleted = completedQuests.filter((q) => q.difficulty === "hard").length;

  const achievements: Achievement[] = [
    { id: "first_quest",      title: "Первые шаги",           description: "Выполните первый квест",                    isUnlocked: totalCompleted >= 1,  progress: Math.min(totalCompleted, 1),   maxProgress: 1,   category: "quests" },
    { id: "five_quests",      title: "Опытный искатель",       description: "Выполните 5 квестов",                       isUnlocked: totalCompleted >= 5,  progress: Math.min(totalCompleted, 5),   maxProgress: 5,   category: "quests" },
    { id: "ten_quests",       title: "Мастер квестов",         description: "Выполните 10 квестов",                      isUnlocked: totalCompleted >= 10, progress: Math.min(totalCompleted, 10),  maxProgress: 10,  category: "quests" },
    { id: "xp_hunter",        title: "Охотник за опытом",      description: "Наберите 100 XP",                           isUnlocked: player.xp >= 100,     progress: Math.min(player.xp, 100),      maxProgress: 100, category: "xp" },
    { id: "xp_master",        title: "Мастер опыта",           description: "Наберите 500 XP",                           isUnlocked: player.xp >= 500,     progress: Math.min(player.xp, 500),      maxProgress: 500, category: "xp" },
    { id: "level_five",       title: "Уровень 5",              description: "Достигните 5 уровня",                       isUnlocked: player.level >= 5,    progress: Math.min(player.level, 5),     maxProgress: 5,   category: "xp" },
    { id: "easy_master",      title: "Мастер лёгких квестов",  description: "Выполните 10 лёгких квестов",               isUnlocked: easyCompleted >= 10,  progress: Math.min(easyCompleted, 10),   maxProgress: 10,  category: "difficulty" },
    { id: "hard_challenger",  title: "Любитель вызовов",       description: "Выполните 5 сложных квестов",               isUnlocked: hardCompleted >= 5,   progress: Math.min(hardCompleted, 5),    maxProgress: 5,   category: "difficulty" },
    { id: "balanced_player",  title: "Сбалансированный игрок", description: "Выполните по 3 квеста каждой сложности",    isUnlocked: easyCompleted >= 3 && mediumCompleted >= 3 && hardCompleted >= 3, progress: Math.min(3, Math.min(easyCompleted, mediumCompleted, hardCompleted)), maxProgress: 3, category: "difficulty" },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      {/* Левая полоска */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold">Достижения</h3>
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/70" : "bg-black/8 dark:bg-white/10 opacity-60"}`}>
            {unlockedCount}/{achievements.length}
          </div>
        </div>

        {/* Список */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {achievements.map((a) => {
            const meta = categoryMeta[a.category];
            const pct = Math.round((a.progress / a.maxProgress) * 100);
            return (
              <div key={a.id} className={`relative rounded-xl overflow-hidden ${colors.insetBg}`}>
                {/* Боковая полоска */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${a.isUnlocked ? meta.bar : "bg-black/10 dark:bg-white/10"}`} />
                <div className="pl-4 pr-3 py-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${a.isUnlocked ? meta.bar : "bg-black/10 dark:bg-white/10"}`}>
                        {a.isUnlocked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-semibold ${a.isUnlocked ? "" : "opacity-50"}`}>{a.title}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isAlwaysDark ? "bg-white/10 text-white/60" : "bg-black/8 dark:bg-white/10 opacity-60"}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs opacity-40 ml-7 mb-2">{a.description}</p>
                  <div className="ml-7">
                    <div className={`rounded-full h-1 overflow-hidden ${isAlwaysDark ? "bg-white/10" : "bg-black/8 dark:bg-white/10"}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${a.isUnlocked ? meta.bar : "bg-black/20 dark:bg-white/20"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] opacity-40 mt-1">{a.progress}/{a.maxProgress}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Итог */}
        <div className={`grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-black/8 dark:border-white/8`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{unlockedCount}</div>
            <div className="text-xs opacity-40">Получено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
            <div className="text-xs opacity-40">Прогресс</div>
          </div>
        </div>
      </div>
    </div>
  );
}
