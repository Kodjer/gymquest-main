// src/components/AddQuestForm.tsx
import { useState, FormEvent } from "react";
import { v4 as uuid } from "uuid";
import { ThemedInput } from "./ThemedInput";

type Quest = {
  id: string;
  title: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
};

export function AddQuestForm({
  quests,
  setQuests,
}: {
  quests: Quest[];
  setQuests: (q: Quest[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  // Автоматическое изменение XP в зависимости от сложности
  const handleDifficultyChange = (
    newDifficulty: "easy" | "medium" | "hard"
  ) => {
    setDifficulty(newDifficulty);
    const xpByDifficulty = {
      easy: 5,
      medium: 10,
      hard: 20,
    };
    setXp(xpByDifficulty[newDifficulty]);
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setQuests([
      ...quests,
      {
        id: uuid(),
        title: title.trim(),
        xpReward: xp,
        status: "pending",
        difficulty,
      },
    ]);
    setTitle("");
    setDifficulty("medium");
    setXp(10);
  }

  const getDifficultyColor = (diff: "easy" | "medium" | "hard") => {
    const colors = {
      easy: "text-green-600 dark:text-green-400",
      medium: "text-yellow-600 dark:text-yellow-400",
      hard: "text-red-600 dark:text-red-400",
    };
    return colors[diff];
  };

  const getDifficultyEmoji = (diff: "easy" | "medium" | "hard") => {
    const emojis = { easy: "🟢", medium: "🟡", hard: "🔴" };
    return emojis[diff];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex gap-2">
        <ThemedInput
          placeholder="Название квеста"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <ThemedInput
          type="number"
          min={1}
          max={100}
          value={xp}
          onChange={(e) => setXp(+e.target.value)}
          className="w-20"
          variant="default"
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          type="submit"
        >
          Добавить
        </button>
      </div>

      {/* Селектор сложности */}
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Сложность:
        </span>
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => handleDifficultyChange(diff)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              difficulty === diff
                ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                : "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
            } ${getDifficultyColor(diff)}`}
          >
            {getDifficultyEmoji(diff)}{" "}
            {diff === "easy"
              ? "Легко"
              : diff === "medium"
              ? "Средне"
              : "Сложно"}
          </button>
        ))}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {xp} XP
        </span>
      </div>
    </form>
  );
}
