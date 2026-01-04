// src/components/GenerateQuestsButton.tsx
import { useState } from "react";

type GenerateQuestsButtonProps = {
  onQuestsGenerated: () => void;
};

export function GenerateQuestsButton({ onQuestsGenerated }: GenerateQuestsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateQuests = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/quests/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsOnboarding) {
          setError("⚠️ Сначала заполните анкету в настройках профиля!");
        } else {
          setError(data.error || "Ошибка при генерации квестов");
        }
        return;
      }

      setSuccess(`✅ Сгенерировано ${data.count} новых квестов!`);
      onQuestsGenerated();

      // Очищаем сообщение об успехе через 3 секунды
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("❌ Ошибка сети: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerateQuests}
        disabled={isGenerating}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 
                   text-white font-bold rounded-lg shadow-md hover:shadow-xl 
                   transition-all duration-300 hover:scale-105 disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Генерация квестов...
          </span>
        ) : (
          "🎯 Получить новые квесты"
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm animate-pulse">
          {success}
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Квесты генерируются автоматически на основе вашего профиля и уровня
      </div>
    </div>
  );
}
