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

const classDisplayInfo: Record<PlayerClass, { icon: string; name: string; evolvedIcon: string; evolvedName: string; bar: string }> = {
  warrior:   { icon: "рџ’Є", name: "Р’РѕРёРЅ",   evolvedIcon: "вљ”пёЏ", evolvedName: "РўРёС‚Р°РЅ",     bar: "bg-orange-500" },
  scout:     { icon: "рџЏѓ", name: "РЎРєР°СѓС‚",  evolvedIcon: "рџ¦…", evolvedName: "РЎР»РµРґРѕРїС‹С‚",  bar: "bg-blue-500" },
  monk:      { icon: "рџ§", name: "РњРѕРЅР°С…",  evolvedIcon: "рџЊџ", evolvedName: "РњСѓРґСЂРµС†",    bar: "bg-violet-500" },
  berserker: { icon: "рџ”Ґ", name: "Р‘РµСЂСЃРµСЂРє",evolvedIcon: "рџ‘№", evolvedName: "Р”РµРјРѕРЅ",     bar: "bg-red-500" },
};

const classFrameGradient: Record<PlayerClass, string> = {
  warrior:   "from-red-500 to-orange-600",
  scout:     "from-blue-500 to-cyan-600",
  monk:      "from-purple-500 to-pink-600",
  berserker: "from-orange-500 to-red-700",
};

export function PlayerCard({
  player,
  setPlayer,
  showResetButton = true,
  showDetailedStats = false,
  quests = [],
}: PlayerCardProps) {
  const { equipmentItems, activeBoosts, getXpMultiplier, getCoinMultiplier } = useEquipment();
  const { colors, theme } = useAppTheme();

  const xpInLevel = player.xp % 100;
  const progressPercent = Math.round((xpInLevel / 100) * 100);

  const completedQuests = quests.filter((q) => q.status === "done").length;
  const pendingQuests   = quests.filter((q) => q.status === "pending").length;
  const averageXp = completedQuests > 0 ? Math.round(player.xp / completedQuests) : 0;

  const classInfo = player.playerClass ? classDisplayInfo[player.playerClass] : null;
  const displayIcon = equipmentItems.avatar?.icon || (classInfo ? (player.isEvolved ? classInfo.evolvedIcon : classInfo.icon) : "рџ‘¤");
  const displayName = classInfo ? (player.isEvolved ? classInfo.evolvedName : classInfo.name) : null;

  const frameGradient = equipmentItems.frame?.preview
    || (player.playerClass ? classFrameGradient[player.playerClass] : "from-purple-400 via-pink-500 to-red-500");

  const accentBar = classInfo?.bar || "bg-purple-500";

  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";

  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      {/* Р¦РІРµС‚РЅР°СЏ РїРѕР»РѕСЃРєР° СЃР»РµРІР° */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />

      <div className="pl-5 pr-4 pt-4 pb-4">
        {/* Р’РµСЂС…: Р°РІР°С‚Р°СЂ + РёРЅС„Рѕ + РїСЂР°РІР°СЏ РїР°РЅРµР»СЊ */}
        <div className="flex items-start justify-between gap-3 mb-4">

          {/* РђРІР°С‚Р°СЂ */}
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${frameGradient} p-0.5 shadow flex-shrink-0`}>
              <div className={`w-full h-full rounded-full ${colors.cardBg} flex items-center justify-center text-2xl`}>
                {displayIcon}
              </div>
            </div>

            {/* РРјСЏ / РєР»Р°СЃСЃ */}
            <div>
              {equipmentItems.title && (
                <p className="text-[11px] font-semibold text-amber-500 mb-0.5">
                  {equipmentItems.title.icon} {equipmentItems.title.name}
                </p>
              )}
              <h2 className="text-xl font-bold leading-tight">РЈСЂРѕРІРµРЅСЊ {player.level}</h2>
              {displayName && (
                <p className="text-sm opacity-50 font-medium">
                  {displayName}{player.classLevel && player.classLevel > 1 ? ` В· РљР». ${player.classLevel}` : ""}
                </p>
              )}
              <p className="text-xs opacity-40 mt-0.5">{player.xp} XP РІСЃРµРіРѕ</p>
            </div>
          </div>

          {/* РџСЂР°РІР°СЏ РїР°РЅРµР»СЊ */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Р‘СѓСЃС‚С‹ */}
            {(getXpMultiplier() > 1 || getCoinMultiplier() > 1) && (
              <div className="flex gap-1.5">
                {getXpMultiplier() > 1 && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"}`}>
                    XP x{getXpMultiplier().toFixed(1)}
                  </span>
                )}
                {getCoinMultiplier() > 1 && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"}`}>
                    РњРѕРЅРµС‚С‹ x{getCoinMultiplier().toFixed(1)}
                  </span>
                )}
              </div>
            )}

            {/* РџРёС‚РѕРјРµС† */}
            {equipmentItems.pet && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"}`}>
                <span className="text-base">{equipmentItems.pet.icon}</span>
                <span>{equipmentItems.pet.name}</span>
              </div>
            )}

            {/* РЎРµСЂРёСЏ */}
            {player.streak > 0 && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                РЎРµСЂРёСЏ: {player.streak}
              </div>
            )}

            {/* РњРѕРЅРµС‚С‹ */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAlwaysDark ? "bg-white/10 text-white/80" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300"}`}>
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex-shrink-0" />
              {player.coins || 0}
            </div>
          </div>
        </div>

        {/* РџСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ */}
        <div className={`rounded-full h-1.5 overflow-hidden ${isAlwaysDark ? "bg-white/10" : "bg-black/10 dark:bg-white/10"}`}>
          <div
            className={`h-full rounded-full ${accentBar} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs opacity-40 mt-1.5">
          {xpInLevel} / 100 XP ({progressPercent}%)
        </p>

        {/* Р”РµС‚Р°Р»СЊРЅР°СЏ СЃС‚Р°С‚РёСЃС‚РёРєР° */}
        {showDetailedStats && (
          <FadeIn delay={200} direction="up">
            <div className={`grid grid-cols-2 gap-3 mt-4 p-4 rounded-xl ${colors.insetBg}`}>
              <AnimatedStat value={completedQuests} label="Р’С‹РїРѕР»РЅРµРЅРѕ"         color="green"  delay={300} />
              <AnimatedStat value={pendingQuests}   label="Р’ РїСЂРѕС†РµСЃСЃРµ"        color="blue"   delay={400} />
              <AnimatedStat value={averageXp}       label="РЎСЂРµРґРЅРёР№ XP"        color="purple" delay={500} />
              <AnimatedStat value={completedQuests > 0 ? Math.ceil(completedQuests / 7) : 0} label="РќРµРґРµР»СЊ Р°РєС‚РёРІРЅРѕСЃС‚Рё" color="orange" delay={600} />
            </div>
          </FadeIn>
        )}

        {/* РљРЅРѕРїРєР° СЃР±СЂРѕСЃР° */}
        {showResetButton && (
          <button
            id="reset-btn"
            onClick={async () => {
              const btn = document.getElementById("reset-btn");
              if (btn) { btn.textContent = "РЎР±СЂРѕСЃ..."; btn.setAttribute("disabled", "true"); }

              setPlayer({ ...player, xp: 0, level: 1, coins: 0, streak: 0, lastQuestDate: null });

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
                  alert("РћС€РёР±РєР°: " + (data.error || "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРіРµРЅРµСЂРёСЂРѕРІР°С‚СЊ РєРІРµСЃС‚С‹"));
                }
              } catch (error) {
                console.error("РћС€РёР±РєР° СЃР±СЂРѕСЃР° РїСЂРѕРіСЂРµСЃСЃР°:", error);
                alert("РћС€РёР±РєР° РїСЂРё СЃР±СЂРѕСЃРµ РїСЂРѕРіСЂРµСЃСЃР°");
              } finally {
                if (btn) { btn.textContent = "РЎР±СЂРѕСЃРёС‚СЊ РїСЂРѕРіСЂРµСЃСЃ"; btn.removeAttribute("disabled"); }
              }
            }}
            className="mt-4 w-full text-xs opacity-40 hover:opacity-70 transition-opacity pt-3 border-t border-black/10 dark:border-white/10 text-center disabled:cursor-not-allowed"
          >
            РЎР±СЂРѕСЃРёС‚СЊ РїСЂРѕРіСЂРµСЃСЃ
          </button>
        )}
      </div>
    </div>
  );
}

