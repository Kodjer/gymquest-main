// src/components/DailyChallenge.tsx
import { useAppTheme } from "../lib/ThemeContext";
import { QuestCard } from "./QuestCard";

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

type Quest = {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  tip?: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  nodeId?: string;
  location?: "home" | "gym" | "both";
  showInAllMode?: boolean;
  visualDemo?: { type: "image" | "video" | "gif" | "youtube"; url: string; thumbnail?: string };
  stepByStep?: string[];
};

interface DailyChallengeProps {
  quests: Quest[];
  onToggle: (id: string) => void;
  playerClass?: PlayerClass;
}

function getDailyQuestId(quests: Quest[]): string | null {
  if (quests.length === 0) return null;
  const today = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) & 0xfffffff;
  }
  return quests[hash % quests.length].id;
}

export function DailyChallenge({ quests, onToggle, playerClass }: DailyChallengeProps) {
  const { theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";

  const dailyId = getDailyQuestId(quests);
  const quest = quests.find((q) => q.id === dailyId);

  if (!quest) return null;

  const questWithDoubleXp = { ...quest, xpReward: quest.xpReward * 2 };

  return (
    <div>
      <div className={`flex items-center justify-between px-4 py-2 rounded-t-2xl -mb-1 ${
        isAlwaysDark ? "bg-violet-900/60" : "bg-violet-100 dark:bg-violet-900/40"
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
            </svg>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${isAlwaysDark ? "text-violet-300" : "text-violet-600 dark:text-violet-400"}`}>
            Вызов дня
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isAlwaysDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-200 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
        }`}>
          x2 XP
        </span>
      </div>

      <QuestCard
        quest={questWithDoubleXp}
        onToggle={onToggle}
        playerClass={playerClass}
      />
    </div>
  );
}
