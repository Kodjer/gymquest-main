// src/components/QuestCard.tsx
import { useState } from "react";

type VisualDemo = {
  type: "image" | "video" | "gif" | "youtube";
  url: string;
  thumbnail?: string;
};

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
    visualDemo?: VisualDemo;
    stepByStep?: string[];
  };
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (quest: any) => void;
  showActions?: boolean;
};

const categoryEmojis: Record<string, string> = {
  strength: "💪",
  cardio: "🏃",
  flexibility: "🧘",
  wellness: "🌟",
};

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
}: QuestCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isDone = quest.status === "done";

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
            {quest.category && (
              <span
                className="text-2xl"
                title={categoryNames[quest.category] || quest.category}
              >
                {categoryEmojis[quest.category] || "📝"}
              </span>
            )}
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
            <span
              className={`px-2 py-1 rounded text-xs font-semibold border ${
                difficultyColors[quest.difficulty]
              }`}
            >
              {difficultyNames[quest.difficulty]}
            </span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300">
              +{quest.xpReward} XP
            </span>
            {quest.category && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300">
                {categoryNames[quest.category] || quest.category}
              </span>
            )}
          </div>
        </div>

        {/* Кнопка завершения */}
        <button
          onClick={() => onToggle(quest.id)}
          className={`text-3xl transition-transform hover:scale-125 ${
            isDone ? "cursor-pointer" : ""
          }`}
          title={isDone ? "Отменить завершение" : "Завершить квест"}
        >
          {isDone ? "✅" : "⭕"}
        </button>
      </div>

      {/* Инструкции */}
      {quest.instructions && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            📋 {quest.instructions}
          </p>
        </div>
      )}

      {/* Что прокачивает */}
      {quest.description && (
        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg">
          <p className="text-xs font-bold text-green-900 dark:text-green-200 mb-1">
            💪 Что прокачивает:
          </p>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {quest.description
              .split("\n\n")[0]
              .replace("Группы мышц:\n", "")
              .replace("Что развивает:\n", "")}
          </p>
        </div>
      )}

      {/* Визуальная демонстрация */}
      {quest.visualDemo && (
        <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-300 dark:border-purple-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">
              {quest.visualDemo.thumbnail || "🎬"}
            </span>
            <p className="text-sm font-bold text-purple-900 dark:text-purple-200">
              Как делать
            </p>
          </div>
          {quest.visualDemo.type === "youtube" && (
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={quest.visualDemo.url}
                title="Демонстрация упражнения"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
          {quest.visualDemo.type === "gif" && (
            <img
              src={quest.visualDemo.url}
              alt="Демонстрация упражнения"
              className="w-full rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {quest.visualDemo.type === "image" && (
            <img
              src={quest.visualDemo.url}
              alt="Демонстрация упражнения"
              className="w-full rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {quest.visualDemo.type === "video" && (
            <video
              src={quest.visualDemo.url}
              controls
              className="w-full rounded-lg"
              onError={(e) => {
                (e.target as HTMLVideoElement).style.display = "none";
              }}
            >
              Ваш браузер не поддерживает видео
            </video>
          )}
        </div>
      )}

      {/* Совет */}
      {quest.tip && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <p className="text-xs font-bold text-yellow-900 dark:text-yellow-200 mb-1">
            💡 Совет:
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
