// src/components/PlayerCard.tsx
import { AnimatedStat, FadeIn } from "./AnimatedComponents";

interface Player {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastQuestDate: string | null;
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
        {/* Аватар и уровень */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Уровень {player.level}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {player.xp} XP всего
            </p>
          </div>
        </div>

        {/* Монеты и стрик */}
        <div className="flex flex-col items-end gap-2">
          {player.streak > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl shadow-lg">
              <span className="font-bold text-lg text-white">Серия: </span>
              <span className="font-bold text-lg text-white">
                {player.streak}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full shadow-lg border-2 border-yellow-200"></div>
            <span className="font-bold text-lg text-white">
              {player.coins || 0}
            </span>
          </div>
        </div>
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

      {/* Кнопка сброса прогресса и генерации квестов */}
      {showResetButton && (
        <button
          onClick={async () => {
            const btn = document.getElementById('reset-btn');
            if (btn) {
              btn.textContent = '⏳ Сброс и генерация...';
              btn.setAttribute('disabled', 'true');
            }
            
            // Сбрасываем прогресс игрока
            setPlayer({
              ...player,
              xp: 0,
              level: 1,
              coins: 0,
              streak: 0,
              lastQuestDate: null,
            });

            try {
              // Сбрасываем неделю в базе данных
              await fetch("/api/player", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  xp: 0,
                  level: 1,
                  currentWeek: 1,
                }),
              });

              // Удаляем старые квесты
              await fetch("/api/quests/clear", { method: "DELETE" });
              
              // Генерируем новые квесты
              const response = await fetch("/api/quests/generate-week", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              
              if (response.ok) {
                window.location.href = "/";
              } else {
                const data = await response.json();
                alert("Ошибка: " + (data.error || "Не удалось сгенерировать квесты"));
              }
            } catch (error) {
              console.error("Ошибка сброса прогресса:", error);
              alert("Ошибка при сбросе прогресса");
            } finally {
              if (btn) {
                btn.textContent = 'Сбросить прогресс';
                btn.removeAttribute('disabled');
              }
            }
          }}
          id="reset-btn"
          className="btn-reset mt-4 w-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Сбросить прогресс
        </button>
      )}
    </div>
  );
}
