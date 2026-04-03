// src/components/Leaderboard.tsx
import { useState, useEffect } from "react";
import { useAppTheme } from "../lib/ThemeContext";

type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  level: number;
  playerClass: string | null;
  completedQuests: number;
  isCurrentUser: boolean;
};

const classMeta: Record<string, { label: string; color: string; bg: string }> = {
  warrior:   { label: "Воин",    color: "text-orange-500", bg: "bg-orange-500/10" },
  scout:     { label: "Скаут",   color: "text-blue-500",   bg: "bg-blue-500/10" },
  monk:      { label: "Монах",   color: "text-violet-500", bg: "bg-violet-500/10" },
  berserker: { label: "Берсерк", color: "text-red-500",    bg: "bg-red-500/10" },
};

const rankStyles: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "bg-yellow-400/15", text: "text-yellow-500", border: "border-yellow-400/30" },
  2: { bg: "bg-gray-300/15",   text: "text-gray-400",   border: "border-gray-300/30" },
  3: { bg: "bg-orange-400/15", text: "text-orange-400", border: "border-orange-400/30" },
};

function RankBadge({ rank }: { rank: number }) {
  const style = rankStyles[rank];
  if (style) {
    return (
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border ${style.bg} ${style.text} ${style.border} flex-shrink-0`}>
        {rank}
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-black/5 dark:bg-white/5 opacity-50 flex-shrink-0">
      {rank}
    </div>
  );
}

export function Leaderboard() {
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const nativeToken = typeof window !== "undefined" ? localStorage.getItem("gymquest_native_token") : null;
    const headers: Record<string, string> = {};
    if (nativeToken) headers["X-Native-Auth"] = nativeToken;

    fetch("/api/leaderboard", { headers })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => { setError("Не удалось загрузить рейтинг"); setLoading(false); });
  }, []);

  const top = entries.filter((e) => e.rank <= 20 && !e.isCurrentUser || e.rank <= 20);
  // Если текущий игрок вне топ-20 — он будет последним в массиве
  const currentUserOutside = entries.find((e) => e.isCurrentUser && e.rank > 20);
  const listEntries = entries.filter((e) => e.rank <= 20);

  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />

      <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 pt-3 sm:pt-4 pb-3 sm:pb-4">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold">Таблица лидеров</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isAlwaysDark ? "bg-white/10 text-white/50" : "bg-black/5 dark:bg-white/10 opacity-50"}`}>
            ТОП {listEntries.length}
          </span>
        </div>

        {/* Состояния */}
        {loading && (
          <div className="py-8 text-center">
            <div className={`text-sm opacity-40`}>Загрузка рейтинга...</div>
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-center">
            <p className="text-sm opacity-40">{error}</p>
          </div>
        )}

        {!loading && !error && listEntries.length === 0 && (
          <div className="py-6 text-center">
            <p className="text-sm opacity-40">Пока нет игроков в рейтинге</p>
          </div>
        )}

        {!loading && !error && listEntries.length > 0 && (
          <div className="space-y-1.5">
            {listEntries.map((entry) => {
              const cls = entry.playerClass ? classMeta[entry.playerClass] : null;
              const isMe = entry.isCurrentUser;
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isMe
                      ? isAlwaysDark
                        ? "bg-violet-500/20 ring-1 ring-violet-500/40"
                        : "bg-violet-50 dark:bg-violet-500/15 ring-1 ring-violet-400/30"
                      : rankStyles[entry.rank]
                        ? `${rankStyles[entry.rank].bg} border ${rankStyles[entry.rank].border}`
                        : isAlwaysDark ? "bg-white/4 hover:bg-white/6" : "bg-black/3 dark:bg-white/4 hover:bg-black/6 dark:hover:bg-white/6"
                  }`}
                >
                  <RankBadge rank={entry.rank} />

                  {/* Имя и класс */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-sm font-semibold truncate ${isMe ? (isAlwaysDark ? "text-violet-200" : "text-violet-700 dark:text-violet-300") : ""}`}>
                        {entry.name}
                        {isMe && <span className="ml-1 text-[10px] opacity-60 font-normal">(вы)</span>}
                      </span>
                      {cls && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cls.bg} ${cls.color}`}>
                          {cls.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] opacity-40">Ур. {entry.level}</span>
                      <span className="text-[11px] opacity-25">·</span>
                      <span className="text-[11px] opacity-40">{entry.completedQuests} квестов</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold ${entry.rank === 1 ? "text-yellow-500" : entry.rank === 2 ? "text-gray-400" : entry.rank === 3 ? "text-orange-400" : isMe ? (isAlwaysDark ? "text-violet-300" : "text-violet-600 dark:text-violet-400") : ""}`}>
                      {entry.xp.toLocaleString("ru")}
                    </span>
                    <span className="block text-[10px] opacity-40">XP</span>
                  </div>
                </div>
              );
            })}

            {/* Текущий пользователь вне топ-20 */}
            {currentUserOutside && (
              <>
                <div className="flex items-center gap-2 py-1 px-3 opacity-30">
                  <div className="flex-1 border-t border-dashed border-current" />
                  <span className="text-[10px] font-semibold">...</span>
                  <div className="flex-1 border-t border-dashed border-current" />
                </div>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isAlwaysDark ? "bg-violet-500/20 ring-1 ring-violet-500/40" : "bg-violet-50 dark:bg-violet-500/15 ring-1 ring-violet-400/30"}`}>
                  <RankBadge rank={currentUserOutside.rank} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold ${isAlwaysDark ? "text-violet-200" : "text-violet-700 dark:text-violet-300"}`}>
                      {currentUserOutside.name} <span className="text-[10px] opacity-60 font-normal">(вы)</span>
                    </span>
                    {currentUserOutside.playerClass && classMeta[currentUserOutside.playerClass] && (
                      <span className={`ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${classMeta[currentUserOutside.playerClass].bg} ${classMeta[currentUserOutside.playerClass].color}`}>
                        {classMeta[currentUserOutside.playerClass].label}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold ${isAlwaysDark ? "text-violet-300" : "text-violet-600 dark:text-violet-400"}`}>
                      {currentUserOutside.xp.toLocaleString("ru")}
                    </span>
                    <span className="block text-[10px] opacity-40">XP</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
