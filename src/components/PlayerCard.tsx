// src/components/PlayerCard.tsx
import { AnimatedStat, FadeIn } from "./AnimatedComponents";
import { useEquipment } from "@/lib/useEquipment";
import { useAppTheme } from "@/lib/ThemeContext";

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface Player {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastQuestDate: string | null;
  playerClass?: PlayerClass;
  classLevel?: number;
  isEvolved?: boolean;
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

// Информация о классах для отображения
const classDisplayInfo: Record<PlayerClass, { icon: string; name: string; evolvedIcon: string; evolvedName: string; color: string }> = {
  warrior: { icon: "💪", name: "Воин", evolvedIcon: "⚔️", evolvedName: "Титан", color: "from-red-500 to-orange-600" },
  scout: { icon: "🏃", name: "Скаут", evolvedIcon: "🦅", evolvedName: "Следопыт", color: "from-blue-500 to-cyan-600" },
  monk: { icon: "🧘", name: "Монах", evolvedIcon: "🌟", evolvedName: "Мудрец", color: "from-purple-500 to-pink-600" },
  berserker: { icon: "🔥", name: "Берсерк", evolvedIcon: "👹", evolvedName: "Демон", color: "from-orange-500 to-red-700" },
};

export function PlayerCard({
  player,
  setPlayer,
  showResetButton = true,
  showDetailedStats = false,
  quests = [],
}: PlayerCardProps) {
  const { equipmentItems, activeBoosts, getXpMultiplier, getCoinMultiplier } = useEquipment();
  const { theme } = useAppTheme();
  
  const xpInLevel = player.xp % 100;
  const progressPercent = Math.round((xpInLevel / 100) * 100);

  // Статистика для профиля
  const completedQuests = quests.filter((q) => q.status === "done").length;
  const pendingQuests = quests.filter((q) => q.status === "pending").length;
  const averageXp =
    completedQuests > 0 ? Math.round(player.xp / completedQuests) : 0;

  // Информация о классе
  const classInfo = player.playerClass ? classDisplayInfo[player.playerClass] : null;
  
  // Приоритет: купленный аватар > класс > дефолт
  const displayIcon = equipmentItems.avatar?.icon || (classInfo ? (player.isEvolved ? classInfo.evolvedIcon : classInfo.icon) : "👤");
  const displayName = classInfo ? (player.isEvolved ? classInfo.evolvedName : classInfo.name) : null;
  
  // Рамка: купленная рамка > класс > дефолт
  const frameGradient = equipmentItems.frame?.preview || (classInfo ? classInfo.color : "from-purple-400 via-pink-500 to-red-500");

  // Тематические стили для карточки
  const getCardClasses = () => {
    switch (theme) {
      case 'forest':
        return 'profile-card bg-green-50 dark:bg-green-900/50 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700';
      case 'ocean':
        return 'profile-card bg-cyan-50 dark:bg-cyan-900/50 text-cyan-900 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-700';
      case 'sunset':
        return 'profile-card bg-orange-50 dark:bg-orange-900/50 text-orange-900 dark:text-orange-100 border border-orange-300 dark:border-orange-700';
      case 'cyberpunk':
        return 'profile-card bg-gray-900 text-pink-100 border-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/20';
      case 'galaxy':
        return 'profile-card bg-indigo-900/70 text-purple-100 border-2 border-purple-500 shadow-lg shadow-purple-500/20';
      default:
        return 'profile-card bg-white text-black dark:bg-gray-900 dark:text-white border dark:border-gray-700';
    }
  };

  const getSecondaryTextClasses = () => {
    switch (theme) {
      case 'forest':
        return 'text-green-600 dark:text-green-400';
      case 'ocean':
        return 'text-cyan-600 dark:text-cyan-400';
      case 'sunset':
        return 'text-orange-600 dark:text-orange-400';
      case 'cyberpunk':
        return 'text-fuchsia-400';
      case 'galaxy':
        return 'text-purple-300';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressBarBg = () => {
    switch (theme) {
      case 'forest':
        return 'bg-green-200 dark:bg-green-800';
      case 'ocean':
        return 'bg-cyan-200 dark:bg-cyan-800';
      case 'sunset':
        return 'bg-orange-200 dark:bg-orange-800';
      case 'cyberpunk':
        return 'bg-gray-800';
      case 'galaxy':
        return 'bg-indigo-800';
      default:
        return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  const getProgressBarFill = () => {
    switch (theme) {
      case 'forest':
        return 'from-green-400 to-emerald-500';
      case 'ocean':
        return 'from-cyan-400 to-blue-500';
      case 'sunset':
        return 'from-orange-400 to-red-500';
      case 'cyberpunk':
        return 'from-fuchsia-500 to-cyan-400';
      case 'galaxy':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-green-400 to-emerald-500';
    }
  };

  return (
    <div className={getCardClasses()}>
      <div className="flex items-center justify-between mb-4">
        {/* Аватар и уровень */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${frameGradient} p-1 shadow-lg`}>
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-4xl">
              {displayIcon}
            </div>
          </div>
          <div>
            {/* Титул */}
            {equipmentItems.title && (
              <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                {equipmentItems.title.icon} {equipmentItems.title.name}
              </p>
            )}
            <h2 className="text-2xl font-bold">Уровень {player.level}</h2>
            {displayName && (
              <p className={`text-sm font-semibold ${getSecondaryTextClasses()}`}>
                {displayName} {player.classLevel && player.classLevel > 1 ? `(Кл. ${player.classLevel})` : ""}
              </p>
            )}
            <p className={getSecondaryTextClasses()}>
              {player.xp} XP всего
            </p>
          </div>
        </div>

        {/* Правая панель - монеты, стрик, питомец, бусты */}
        <div className="flex flex-col items-end gap-2">
          {/* Активные бусты */}
          {activeBoosts.length > 0 && (
            <div className="flex gap-1">
              {activeBoosts.map(boost => (
                <div 
                  key={boost.id} 
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm shadow-lg animate-pulse"
                  title={`${boost.boostType} x${boost.multiplier}`}
                >
                  {boost.boostType.includes('xp') ? '⚡' : boost.boostType.includes('coin') ? '💰' : '🛡️'}
                </div>
              ))}
            </div>
          )}
          
          {/* XP/Coin множители */}
          {(getXpMultiplier() > 1 || getCoinMultiplier() > 1) && (
            <div className="flex gap-2 text-xs">
              {getXpMultiplier() > 1 && (
                <span className="px-2 py-1 bg-purple-500 text-white rounded-full">
                  XP x{getXpMultiplier().toFixed(1)}
                </span>
              )}
              {getCoinMultiplier() > 1 && (
                <span className="px-2 py-1 bg-amber-500 text-white rounded-full">
                  💰 x{getCoinMultiplier().toFixed(1)}
                </span>
              )}
            </div>
          )}

          {/* Питомец */}
          {equipmentItems.pet && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl shadow-lg">
              <span className="text-xl">{equipmentItems.pet.icon}</span>
              <span className="text-xs font-medium text-white">{equipmentItems.pet.name}</span>
            </div>
          )}
          
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
      <div className={`progress-bg ${getProgressBarBg()}`}>
        <div
          className={`progress-fill bg-gradient-to-r ${getProgressBarFill()} transition-all duration-500`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className={`text-sm ${getSecondaryTextClasses()} mt-2`}>
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
