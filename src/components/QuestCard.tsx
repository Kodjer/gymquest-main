// src/components/QuestCard.tsx
import { useState, Component, ReactNode } from "react";
import { LottieAnimation } from "./LottieAnimation";
import { useAppTheme } from "../lib/ThemeContext";

// Catch any crash inside DotLottie without killing the whole card
class LottieErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null; // silently hide broken animation
    return this.props.children;
  }
}

type VisualDemo = {
  type: "image" | "video" | "gif" | "youtube" | "lottie";
  url: string;
  thumbnail?: string;
};

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

type QuestCardProps = {
  quest: {
    id: string;
    title: string;
    description?: string;
    instructions?: string;
    tip?: string;
    xpReward: number;
    status: "pending" | "done";
    difficulty: "easy" | "medium" | "hard";
    category?: string;
    location?: "home" | "gym" | "both";
    visualDemo?: VisualDemo;
    stepByStep?: string[];
  };
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (quest: any) => void;
  showActions?: boolean;
  playerClass?: PlayerClass;
};

function getClassBonusInfo(
  category: string | undefined,
  difficulty: string,
  playerClass: PlayerClass | undefined
): { hasBonus: boolean; bonusPercent: number; bonusText: string } {
  if (!playerClass) return { hasBonus: false, bonusPercent: 0, bonusText: "" };
  switch (playerClass) {
    case "warrior":
      if (category === "strength") return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      break;
    case "scout":
      if (category === "cardio") return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      break;
    case "monk":
      if (category === "flexibility") return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      break;
    case "berserker":
      if (difficulty === "hard") return { hasBonus: true, bonusPercent: 40, bonusText: "+40%" };
      if (difficulty === "easy") return { hasBonus: true, bonusPercent: -15, bonusText: "-15%" };
      break;
  }
  return { hasBonus: false, bonusPercent: 0, bonusText: "" };
}

const categoryMeta: Record<string, { name: string; bar: string; btn: string; pillText: string; pillBg: string }> = {
  strength:    { name: "Силовые",  bar: "bg-orange-500", btn: "bg-orange-500 hover:bg-orange-600", pillText: "text-orange-600 dark:text-orange-400", pillBg: "bg-orange-50 dark:bg-orange-900/30" },
  cardio:      { name: "Кардио",   bar: "bg-blue-500",   btn: "bg-blue-500 hover:bg-blue-600",     pillText: "text-blue-600 dark:text-blue-400",   pillBg: "bg-blue-50 dark:bg-blue-900/30" },
  flexibility: { name: "Гибкость", bar: "bg-violet-500", btn: "bg-violet-500 hover:bg-violet-600", pillText: "text-violet-600 dark:text-violet-400", pillBg: "bg-violet-50 dark:bg-violet-900/30" },
  wellness:    { name: "Здоровье", bar: "bg-emerald-500",btn: "bg-emerald-500 hover:bg-emerald-600",pillText: "text-emerald-600 dark:text-emerald-400", pillBg: "bg-emerald-50 dark:bg-emerald-900/30" },
};

const difficultyMeta: Record<string, { label: string; dot: string; text: string }> = {
  easy:   { label: "Легко",  dot: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
  medium: { label: "Средне", dot: "bg-amber-400",   text: "text-amber-600 dark:text-amber-400" },
  hard:   { label: "Сложно", dot: "bg-rose-500",    text: "text-rose-600 dark:text-rose-400" },
};

const isLifestyleWellness = (quest: { category?: string; title: string }) => {
  if (quest.category !== "wellness") return false;
  const t = quest.title.toLowerCase();
  return ["сахар", "детокс", "питан", "отдых", "здоровь", "день"].some(w => t.includes(w));
};

function getYouTubeSearchUrl(title: string, category?: string): string | null {
  if (category === "wellness") {
    const t = title.toLowerCase();
    if (["сахар", "детокс", "питан", "отдых", "здоровь", "день", "сон", "завтрак", "медитац", "водн"].some(w => t.includes(w))) {
      return null;
    }
  }
  const t = title.toLowerCase();
  let suffix = "техника выполнения";
  if (category === "flexibility" || t.includes("йога") || t.includes("растяж") || t.includes("пилатес")) {
    suffix = "для начинающих";
  } else if (category === "cardio" || t.includes("бег") || t.includes("hiit") || t.includes("табата") || t.includes("кардио")) {
    suffix = "правильная техника";
  }
  const query = `${title} ${suffix}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function QuestCard({
  quest,
  onToggle,
  onDelete,
  onEdit,
  showActions = true,
  playerClass,
}: QuestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isDone = quest.status === "done";
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";
  const classBonus = getClassBonusInfo(quest.category, quest.difficulty, playerClass);
  const catMeta = categoryMeta[quest.category || ""] || {
    name: quest.category || "", bar: "bg-gray-400", btn: "bg-gray-500 hover:bg-gray-600",
    pillText: "text-gray-600 dark:text-gray-400", pillBg: "bg-gray-100 dark:bg-gray-700",
  };
  // На тёмных темах (cyberpunk/galaxy) пилюли используют белый цвет
  const pillText = isAlwaysDark ? "text-white/80" : catMeta.pillText;
  const pillBg   = isAlwaysDark ? "bg-white/10"  : catMeta.pillBg;
  const xpText   = isAlwaysDark ? "text-white/90" : catMeta.pillText;
  const diffMeta = difficultyMeta[quest.difficulty];
  const hasAnimation = !isLifestyleWellness(quest);
  const videoUrl = isLifestyleWellness(quest) ? null : getYouTubeSearchUrl(quest.title, quest.category);
  const hasDetails = !!(quest.instructions || quest.description || quest.tip || videoUrl);

  return (
    <div
      className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden transition-all duration-200 ${
        isDone
          ? "opacity-50 shadow-sm"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      {/* Цветная полоска слева */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? "opacity-20" : ""} ${catMeta.bar}`} />

      {/* Контент */}
      <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 pt-3 sm:pt-4 pb-3 sm:pb-4">

        {/* Верхняя строка: заголовок + XP */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
          <h3 className={`font-semibold text-[14px] sm:text-[15px] leading-snug flex-1 ${isDone ? "line-through opacity-40" : ""}`}>
            {quest.title}
          </h3>
          <div className="flex-shrink-0 text-right">
            <span className={`text-sm font-bold ${xpText}`}>
              {quest.xpReward} XP
            </span>
            {classBonus.hasBonus && (
              <span className={`ml-1 text-xs font-semibold ${classBonus.bonusPercent > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {classBonus.bonusText}
              </span>
            )}
          </div>
        </div>

        {/* Пилюли: категория + сложность */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-3 sm:mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${pillText} ${pillBg}`}>
            {catMeta.name}
          </span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isAlwaysDark ? "text-white/70" : diffMeta.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
            {diffMeta.label}
          </span>
        </div>

        {/* Анимация */}
        {hasAnimation && !isDone && (
          <div className="mb-3 sm:mb-4">
            <LottieErrorBoundary>
              <LottieAnimation title={quest.title} />
            </LottieErrorBoundary>
          </div>
        )}

        {/* Детали — выпадающий блок */}
        {hasDetails && (
          <div className="mb-3 sm:mb-4">
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-2 text-xs font-medium opacity-40 hover:opacity-70 transition-opacity"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              {expanded ? "Скрыть детали" : "Детали квеста"}
            </button>

            {expanded && (
              <div className={`mt-2 space-y-px rounded-xl overflow-hidden border border-black/5 dark:border-white/5`}>
                {quest.instructions && (
                  <div className={`px-4 py-3 ${colors.insetBg}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-1">Инструкция</p>
                    <p className="text-[13px] opacity-90 leading-relaxed">{quest.instructions}</p>
                  </div>
                )}
                {quest.description && (
                  <div className={`px-4 py-3 ${colors.insetBg}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-1">Что прокачивает</p>
                    <p className="text-[13px] opacity-90 leading-relaxed">
                      {quest.description.split("\n\n")[0].replace("Группы мышц:\n", "").replace("Что развивает:\n", "")}
                    </p>
                  </div>
                )}
                {quest.tip && (
                  <div className={`px-4 py-3 ${colors.insetBg}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-1">Совет</p>
                    <p className="text-[13px] opacity-90 leading-relaxed">{quest.tip}</p>
                  </div>
                )}
                {videoUrl && (
                  <button
                    onClick={() => window.open(videoUrl, '_blank')}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 ${colors.insetBg} hover:bg-red-500/10 transition-colors text-left`}
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider opacity-50 mb-0.5">Видео-инструкция</span>
                      <span className="block text-[13px] text-red-500 dark:text-red-400 font-medium">Смотреть технику на YouTube</span>
                    </span>
                    <svg className="w-3.5 h-3.5 opacity-30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Кнопка завершения */}
        {!isDone ? (
          <button
            onClick={() => onToggle(quest.id)}
            className={`w-full py-2 sm:py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] ${catMeta.btn}`}
          >
            Завершить
          </button>
        ) : (
          <p className="text-xs font-medium opacity-40 text-center py-1">Выполнено</p>
        )}

        {/* Действия */}
        {showActions && !isDone && (onEdit || onDelete) && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
            {onEdit && (
              <button onClick={() => onEdit(quest)} className="text-xs opacity-40 hover:opacity-80 transition-opacity">
                Редактировать
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(quest.id)} className="text-xs opacity-40 hover:text-rose-500 hover:opacity-100 transition-all">
                Удалить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
