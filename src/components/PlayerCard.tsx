// src/components/PlayerCard.tsx
import { useRef, useState } from "react";
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

const classDisplayInfo: Record<
  PlayerClass,
  {
    icon: string;
    name: string;
    evolvedIcon: string;
    evolvedName: string;
    bar: string;
  }
> = {
  warrior: {
    icon: "💪",
    name: "Воин",
    evolvedIcon: "⚔️",
    evolvedName: "Титан",
    bar: "bg-orange-500",
  },
  scout: {
    icon: "🏃",
    name: "Скаут",
    evolvedIcon: "🦅",
    evolvedName: "Следопыт",
    bar: "bg-blue-500",
  },
  monk: {
    icon: "🧘",
    name: "Монах",
    evolvedIcon: "🌟",
    evolvedName: "Мудрец",
    bar: "bg-violet-500",
  },
  berserker: {
    icon: "🔥",
    name: "Берсерк",
    evolvedIcon: "👹",
    evolvedName: "Демон",
    bar: "bg-red-500",
  },
};

const classFrameGradient: Record<PlayerClass, string> = {
  warrior: "from-red-500 to-orange-600",
  scout: "from-blue-500 to-cyan-600",
  monk: "from-purple-500 to-pink-600",
  berserker: "from-orange-500 to-red-700",
};

export function PlayerCard({
  player,
  setPlayer,
  showResetButton = true,
  showDetailedStats = false,
  quests = [],
}: PlayerCardProps) {
  const { equipmentItems, getXpMultiplier, getCoinMultiplier } = useEquipment();
  const { colors, theme } = useAppTheme();

  const xpInLevel = player.xp % 100;
  const progressPercent = Math.round((xpInLevel / 100) * 100);

  const completedQuests = quests.filter((q) => q.status === "done").length;
  const pendingQuests = quests.filter((q) => q.status === "pending").length;
  const averageXp =
    completedQuests > 0 ? Math.round(player.xp / completedQuests) : 0;

  const classInfo = player.playerClass
    ? classDisplayInfo[player.playerClass]
    : null;
  const displayIcon =
    equipmentItems.avatar?.icon ||
    (classInfo
      ? player.isEvolved
        ? classInfo.evolvedIcon
        : classInfo.icon
      : "👤");
  const displayName = classInfo
    ? player.isEvolved
      ? classInfo.evolvedName
      : classInfo.name
    : null;

  const frameGradient =
    equipmentItems.frame?.preview ||
    (player.playerClass
      ? classFrameGradient[player.playerClass]
      : "from-purple-400 via-pink-500 to-red-500");

  const accentBar = classInfo?.bar || "bg-purple-500";
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";

  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("playerPhoto");
    return null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setCustomPhoto(url);
      localStorage.setItem("playerPhoto", url);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}
    >
      {/* Цветная полоска слева */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Верх: аватар + инфо + правая панель */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Аватар */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${frameGradient} p-0.5 shadow`}
              >
                <div
                  className={`w-full h-full rounded-full ${colors.cardBg} flex items-center justify-center text-2xl overflow-hidden`}
                >
                  {customPhoto ? (
                    <img
                      src={customPhoto}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    displayIcon
                  )}
                </div>
              </div>
              {/* Кнопка загрузки фото */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                title="Загрузить фото"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Имя / класс */}
            <div>
              {equipmentItems.title && (
                <p className="text-[11px] font-semibold text-amber-500 mb-0.5">
                  {equipmentItems.title.icon} {equipmentItems.title.name}
                </p>
              )}
              <h2 className="text-xl font-bold leading-tight">
                Уровень {player.level}
              </h2>
              {displayName && (
                <p className="text-sm opacity-50 font-medium">
                  {displayName}
                  {player.classLevel && player.classLevel > 1
                    ? ` · Кл. ${player.classLevel}`
                    : ""}
                </p>
              )}
              <p className="text-xs opacity-40 mt-0.5">{player.xp} XP всего</p>
            </div>
          </div>

          {/* Правая панель: бусты, питомец, серия, монеты */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Бусты */}
            {(getXpMultiplier() > 1 || getCoinMultiplier() > 1) && (
              <div className="flex gap-1.5">
                {getXpMultiplier() > 1 && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"}`}
                  >
                    XP x{getXpMultiplier().toFixed(1)}
                  </span>
                )}
                {getCoinMultiplier() > 1 && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"}`}
                  >
                    Монеты x{getCoinMultiplier().toFixed(1)}
                  </span>
                )}
              </div>
            )}

            {/* Серия */}
            {player.streak > 0 && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300"}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                Серия: {player.streak}
              </div>
            )}

            {/* Монеты */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"}`}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
              {player.coins || 0}
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div
          className={`rounded-full h-1.5 overflow-hidden ${isAlwaysDark ? "bg-white/10" : "bg-black/10 dark:bg-white/10"}`}
        >
          <div
            className={`h-full rounded-full ${accentBar} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs opacity-40 mt-1.5">
          {xpInLevel} / 100 XP ({progressPercent}%)
        </p>

        {/* Детальная статистика */}
        {showDetailedStats && (
          <FadeIn delay={200} direction="up">
            <div
              className={`grid grid-cols-2 gap-3 mt-4 p-4 rounded-xl ${colors.insetBg}`}
            >
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
            id="reset-btn"
            onClick={async () => {
              const btn = document.getElementById("reset-btn");
              if (btn) {
                btn.textContent = "Сброс...";
                btn.setAttribute("disabled", "true");
              }

              setPlayer({
                ...player,
                xp: 0,
                level: 1,
                coins: 0,
                streak: 0,
                lastQuestDate: null,
              });

              try {
                await fetch("/api/player", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ xp: 0, level: 1, currentWeek: 1 }),
                });
                await fetch("/api/quests/clear", { method: "DELETE" });
                const response = await fetch("/api/quests/generate-week", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                  window.location.href = "/";
                } else {
                  const data = await response.json();
                  alert(
                    "Ошибка: " +
                      (data.error || "Не удалось сгенерировать квесты"),
                  );
                }
              } catch (error) {
                console.error("Ошибка сброса прогресса:", error);
                alert("Ошибка при сбросе прогресса");
              } finally {
                if (btn) {
                  btn.textContent = "Сбросить прогресс";
                  btn.removeAttribute("disabled");
                }
              }
            }}
            className="mt-4 w-full text-xs opacity-40 hover:opacity-70 transition-opacity pt-3 border-t border-black/10 dark:border-white/10 text-center disabled:cursor-not-allowed"
          >
            Сбросить прогресс
          </button>
        )}
      </div>
    </div>
  );
}
