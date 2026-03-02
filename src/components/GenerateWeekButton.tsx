// src/components/GenerateWeekButton.tsx
import { useState } from "react";

type GenerateWeekButtonProps = {
  onGenerated: () => void;
  weekNumber: number;
};

export function GenerateWeekButton({
  onGenerated,
  weekNumber,
}: GenerateWeekButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quests/generate-week", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        onGenerated();
      } else {
        setError(data.error || "Не удалось сгенерировать квесты");
      }
    } catch (err) {
      setError("Произошла ошибка при генерации квестов");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Неделя {weekNumber}</h3>
          <p className="opacity-90 text-sm mt-1">
            {weekNumber <= 2
              ? "Начальный уровень - легкие упражнения"
              : weekNumber <= 4
              ? "Средний уровень - добавляем интенсивность"
              : weekNumber <= 6
              ? "Продвинутый уровень - увеличиваем нагрузку"
              : "Экспертный уровень - максимальная сложность"}
          </p>
        </div>
        <div className="text-5xl">📅</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-white text-purple-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            Генерация...
          </span>
        ) : (
          <>✨ Сгенерировать квесты на неделю</>
        )}
      </button>

      <div className="mt-4 text-xs opacity-75 text-center">
        Будет создано{" "}
        {weekNumber <= 2
          ? "~14"
          : weekNumber <= 4
          ? "~21"
          : weekNumber <= 6
          ? "~28"
          : "~35"}{" "}
        квестов на 7 дней
        <br />
        Сложность:{" "}
        {weekNumber <= 2
          ? "легкая → легкая-средняя"
          : weekNumber <= 4
          ? "легкая-средняя → средняя"
          : weekNumber <= 6
          ? "средняя → средняя-высокая"
          : "средняя-высокая → высокая"}
        <br />
        <span className="text-[10px]">Плавный рост к концу недели</span>
      </div>
    </div>
  );
}
