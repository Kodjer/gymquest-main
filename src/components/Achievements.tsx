// src/components/Achievements.tsx
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
  emoji: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "quests" | "xp" | "streak" | "difficulty";
}

interface AchievementsProps {
  player: Player;
  quests: Quest[];
}

export function Achievements({ player, quests }: AchievementsProps) {
  const completedQuests = quests.filter((q) => q.status === "done");
  const totalCompleted = completedQuests.length;
  const easyCompleted = completedQuests.filter(
    (q) => q.difficulty === "easy"
  ).length;
  const mediumCompleted = completedQuests.filter(
    (q) => q.difficulty === "medium"
  ).length;
  const hardCompleted = completedQuests.filter(
    (q) => q.difficulty === "hard"
  ).length;

  const achievements: Achievement[] = [
    {
      id: "first_quest",
      title: "Первые шаги",
      description: "Выполните первый квест",
      emoji: "",
      isUnlocked: totalCompleted >= 1,
      progress: Math.min(totalCompleted, 1),
      maxProgress: 1,
      category: "quests",
    },
    {
      id: "five_quests",
      title: "Опытный искатель",
      description: "Выполните 5 квестов",
      emoji: "",
      isUnlocked: totalCompleted >= 5,
      progress: Math.min(totalCompleted, 5),
      maxProgress: 5,
      category: "quests",
    },
    {
      id: "ten_quests",
      title: "Мастер квестов",
      description: "Выполните 10 квестов",
      emoji: "",
      isUnlocked: totalCompleted >= 10,
      progress: Math.min(totalCompleted, 10),
      maxProgress: 10,
      category: "quests",
    },
    {
      id: "xp_hunter",
      title: "Охотник за опытом",
      description: "Наберите 100 XP",
      emoji: "",
      isUnlocked: player.xp >= 100,
      progress: Math.min(player.xp, 100),
      maxProgress: 100,
      category: "xp",
    },
    {
      id: "xp_master",
      title: "Мастер опыта",
      description: "Наберите 500 XP",
      emoji: "",
      isUnlocked: player.xp >= 500,
      progress: Math.min(player.xp, 500),
      maxProgress: 500,
      category: "xp",
    },
    {
      id: "level_five",
      title: "Уровень 5",
      description: "Достигните 5 уровня",
      emoji: "",
      isUnlocked: player.level >= 5,
      progress: Math.min(player.level, 5),
      maxProgress: 5,
      category: "xp",
    },
    {
      id: "easy_master",
      title: "Мастер легких квестов",
      description: "Выполните 10 легких квестов",
      emoji: "",
      isUnlocked: easyCompleted >= 10,
      progress: Math.min(easyCompleted, 10),
      maxProgress: 10,
      category: "difficulty",
    },
    {
      id: "hard_challenger",
      title: "Любитель вызовов",
      description: "Выполните 5 сложных квестов",
      emoji: "",
      isUnlocked: hardCompleted >= 5,
      progress: Math.min(hardCompleted, 5),
      maxProgress: 5,
      category: "difficulty",
    },
    {
      id: "balanced_player",
      title: "Сбалансированный игрок",
      description: "Выполните по 3 квеста каждой сложности",
      emoji: "",
      isUnlocked:
        easyCompleted >= 3 && mediumCompleted >= 3 && hardCompleted >= 3,
      progress: Math.min(
        3,
        Math.min(easyCompleted, mediumCompleted, hardCompleted)
      ),
      maxProgress: 3,
      category: "difficulty",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Достижения</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {unlockedCount}/{totalAchievements} получено
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              achievement.isUnlocked
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  achievement.isUnlocked
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                }`}
              >
                ✓
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4
                    className={`font-semibold ${
                      achievement.isUnlocked
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {achievement.category === "quests"
                      ? "Квесты"
                      : achievement.category === "xp"
                      ? "Опыт"
                      : achievement.category === "streak"
                      ? "Серия"
                      : "Сложность"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {achievement.description}
                </p>

                {/* Прогресс-бар */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.isUnlocked
                        ? "bg-green-500 dark:bg-green-400"
                        : "bg-blue-500 dark:bg-blue-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (achievement.progress / achievement.maxProgress) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                  <span>
                    {Math.round(
                      (achievement.progress / achievement.maxProgress) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Статистика достижений */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {unlockedCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Получено
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((unlockedCount / totalAchievements) * 100)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Прогресс
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
