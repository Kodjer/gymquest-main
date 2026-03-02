// src/components/QuestCard.tsx
import { useState, useEffect } from "react";
import { LottieAnimation } from "./LottieAnimation";

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

// Расчёт бонуса класса для отображения
function getClassBonusInfo(
  category: string | undefined,
  difficulty: string,
  playerClass: PlayerClass | undefined
): { hasBonus: boolean; bonusPercent: number; bonusText: string } {
  if (!playerClass) return { hasBonus: false, bonusPercent: 0, bonusText: "" };

  switch (playerClass) {
    case "warrior":
      if (category === "strength") {
        return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      }
      break;
    case "scout":
      if (category === "cardio") {
        return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      }
      break;
    case "monk":
      if (category === "flexibility") {
        return { hasBonus: true, bonusPercent: 25, bonusText: "+25%" };
      }
      break;
    case "berserker":
      if (difficulty === "hard") {
        return { hasBonus: true, bonusPercent: 40, bonusText: "+40%" };
      } else if (difficulty === "easy") {
        return { hasBonus: true, bonusPercent: -15, bonusText: "-15%" };
      }
      break;
  }
  return { hasBonus: false, bonusPercent: 0, bonusText: "" };
}

const categoryNames: Record<string, string> = {
  strength: "Силовые",
  cardio: "Кардио",
  flexibility: "Гибкость",
  wellness: "Здоровье",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300",
  medium:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300",
  hard: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300",
};

const difficultyNames: Record<string, string> = {
  easy: "Легко",
  medium: "Средне",
  hard: "Сложно",
};

export function QuestCard({
  quest,
  onToggle,
  onDelete,
  onEdit,
  showActions = true,
  playerClass,
}: QuestCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isDone = quest.status === "done";
  
  // Получаем бонус класса
  const classBonus = getClassBonusInfo(quest.category, quest.difficulty, playerClass);

  return (
    <div
      className={`p-4 rounded-lg shadow-md border-2 transition-all duration-300 ${
        isDone
          ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-75"
          : "bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700"
      }`}
    >
      {/* Заголовок и статус */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-bold text-lg ${
                isDone ? "line-through text-gray-500" : ""
              }`}
            >
              {quest.title}
            </h3>
          </div>

          {/* Бейджи */}
          <div className="flex flex-wrap gap-2 mt-2">
            {quest.category && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                {categoryNames[quest.category] || quest.category}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold border ${
                difficultyColors[quest.difficulty]
              }`}
            >
              {difficultyNames[quest.difficulty]}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${
              classBonus.hasBonus && classBonus.bonusPercent > 0
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-400"
                : classBonus.hasBonus && classBonus.bonusPercent < 0
                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-400"
                : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300"
            }`}>
              +{quest.xpReward} XP
              {classBonus.hasBonus && (
                <span className={`ml-1 font-bold ${classBonus.bonusPercent > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  ({classBonus.bonusText})
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка завершения */}
      {!isDone && (
        <button
          onClick={() => onToggle(quest.id)}
          className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          ✓ Завершить квест
        </button>
      )}

      {/* Инструкции */}
      {quest.instructions && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {quest.instructions}
          </p>
        </div>
      )}

      {/* Что прокачивает */}
      {quest.description && (
        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <p className="text-xs font-bold text-green-900 dark:text-green-200 mb-1">
            Что прокачивает:
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {quest.description
              .split("\n\n")[0]
              .replace("Группы мышц:\n", "")
              .replace("Что развивает:\n", "")}
          </p>
        </div>
      )}

      {/* Визуальная демонстрация упражнения (нет для lifestyle wellness-квестов) */}
      {!(quest.category === "wellness" && (() => {
        const t = quest.title.toLowerCase();
        return t.includes("сахар") || t.includes("детокс") || t.includes("питан") ||
               t.includes("отдых") || t.includes("здоровь") || t.includes("день");
      })()) && (
        <div className="mt-3">
          <LottieAnimation title={quest.title} />
        </div>
      )}

      {/* Совет */}
      {quest.tip && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <p className="text-xs font-bold text-yellow-900 dark:text-yellow-200 mb-1">
            Совет:
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {quest.tip}
          </p>
        </div>
      )}

      {/* Действия (редактировать/удалить) */}
      {showActions && !isDone && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={() => onEdit(quest)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Редактировать
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(quest.id)}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
}
