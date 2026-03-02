// src/components/AddQuestForm.tsx
import { useState, FormEvent } from "react";
import { v4 as uuid } from "uuid";
import { ThemedInput } from "./ThemedInput";
import { useAppTheme } from "@/lib/ThemeContext";

type Quest = {
  id: string;
  title: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
};

const difficultyMeta = {
  easy:   { label: "Легко",  xp: 5,  active: "bg-green-500 text-white",  inactive: "bg-green-500/10 text-green-600 dark:text-green-400" },
  medium: { label: "Средне", xp: 10, active: "bg-yellow-500 text-white", inactive: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  hard:   { label: "Сложно", xp: 20, active: "bg-red-500 text-white",    inactive: "bg-red-500/10 text-red-600 dark:text-red-400" },
} as const;

export function AddQuestForm({
  quests,
  setQuests,
}: {
  quests: Quest[];
  setQuests: (q: Quest[]) => void;
}) {
  const { colors } = useAppTheme();
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setQuests([
      ...quests,
      {
        id: uuid(),
        title: title.trim(),
        xpReward: difficultyMeta[difficulty].xp,
        status: "pending",
        difficulty,
      },
    ]);
    setTitle("");
    setDifficulty("medium");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${colors.cardBg} ${colors.text} rounded-2xl px-4 pt-4 pb-3 shadow-sm mb-4`}
    >
      <div className="flex gap-2 mb-3">
        <ThemedInput
          placeholder="Название квеста"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors flex-shrink-0"
        >
          Добавить
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs opacity-40 font-semibold uppercase tracking-wide mr-1">Сложность:</span>
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => setDifficulty(diff)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              difficulty === diff
                ? difficultyMeta[diff].active
                : difficultyMeta[diff].inactive
            }`}
          >
            {difficultyMeta[diff].label}
          </button>
        ))}
        <span className="text-xs opacity-40 ml-auto">{difficultyMeta[difficulty].xp} XP</span>
      </div>
    </form>
  );
}
