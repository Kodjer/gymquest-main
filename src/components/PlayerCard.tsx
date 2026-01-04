// src/components/PlayerCard.tsx
import { AnimatedStat, FadeIn } from "./AnimatedComponents";

interface Player {
  xp: number;
  level: number;
}

interface PlayerCardProps {
  player: Player;
  setPlayer: (player: Player) => void;
  showResetButton?: boolean;
  showDetailedStats?: boolean;
  quests?: Array<{
    status: "pending" | "done";
    difficulty: "easy" | "medium" | "hard";
  }>;
}

export function PlayerCard({
  player,
  setPlayer,
  showResetButton = true,
  showDetailedStats = false,
  quests = [],
}: PlayerCardProps) {
  const xpInLevel = player.xp % 100;
  const progressPercent = Math.round((xpInLevel / 100) * 100);

  // Статистика для профиля
  const completedQuests = quests.filter((q) => q.status === "done").length;
  const pendingQuests = quests.filter((q) => q.status === "pending").length;
  const averageXp =
    completedQuests > 0 ? Math.round(player.xp / completedQuests) : 0;

  return (
    <div className="profile-card bg-white text-black dark:bg-gray-900 dark:text-white border dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Уровень {player.level}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {player.xp} XP всего
          </p>
        </div>
        <div className="text-4xl">🏆</div>
      </div>

      {/* Прогресс-бар */}
      <div className="progress-bg bg-gray-200 dark:bg-gray-700">
        <div
          className="progress-fill bg-green-400 dark:bg-green-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        {xpInLevel} / 100 XP ({progressPercent}%)
      </p>

      {/* Детальная статистика для профиля */}
      {showDetailedStats && (
        <FadeIn delay={200} direction="up">
          <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AnimatedStat
              value={completedQuests}
              label="Выполнено"
              color="green"
              delay={300}
            />
            <AnimatedStat
              value={pendingQuests}
              label="В процессе"
              color="blue"
              delay={400}
            />
            <AnimatedStat
              value={averageXp}
              label="Средний XP"
              color="purple"
              delay={500}
            />
            <AnimatedStat
              value={completedQuests > 0 ? Math.ceil(completedQuests / 7) : 0}
              label="Недель активности"
              color="orange"
              delay={600}
            />
          </div>
        </FadeIn>
      )}

      {/* Кнопка сброса */}
      {showResetButton && (
        <button
          onClick={() => setPlayer({ ...player, xp: 0, level: 1 })}
          className="btn-reset mt-4 w-full hover:scale-105 active:scale-95 transition-transform"
        >
          Сбросить прогресс
        </button>
      )}
    </div>
  );
}
