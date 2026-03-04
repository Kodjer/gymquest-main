// src/pages/profile.tsx
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { usePlayer } from "../lib/usePlayer";
import { PlayerCard } from "../components/PlayerCard";
import { ProgressChart, XpEntry } from "../components/ProgressChart";
import { Achievements } from "../components/Achievements";
import { Settings } from "../components/Settings";
import { Shop } from "../components/Shop";
import { Layout } from "../components/Layout";
import { useAppTheme } from "../lib/ThemeContext";

type Quest = {
  id: string;
  title: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
  nodeId?: string;
};

function StatCard({ isLoading, rows }: { isLoading: boolean; rows: { label: string; value: string; accent?: string }[] }) {
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";
  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
      <div className="pl-5 pr-4 pt-4 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-40 mb-3">Статистика</p>
        {isLoading ? (
          <p className="text-sm opacity-40 py-4 text-center">Загрузка...</p>
        ) : (
          <div className="space-y-0">
            {rows.map((row, i) => (
              <div key={i} className={`flex items-center justify-between py-2 ${
                i < rows.length - 1 ? "border-b border-black/5 dark:border-white/5" : ""
              }`}>
                <span className="text-sm opacity-60">{row.label}</span>
                <span className={`text-sm font-semibold ${row.accent ?? ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyChart() {
  const { colors } = useAppTheme();
  return (
    <div className={`relative ${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
      <div className="pl-5 pr-4 py-8 text-center">
        <p className="text-sm opacity-40">Сгенерируйте недельный план,<br />чтобы увидеть прогресс</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Загружаем данные из localStorage для совместимости
  const [xpHistory] = useLocalStorage<XpEntry[]>("xpHistory", []);
  const [player, setPlayer] = usePlayer();

  // Устанавливаем флаг монтирования для предотвращения hydration ошибки
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Загружаем квесты из API
  useEffect(() => {
    if (session) {
      loadQuests();
    }
  }, [session]);

  const loadQuests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quests");
      if (response.ok) {
        const data = await response.json();
        setQuests(data);
      }
    } catch (error) {
      console.error("Error loading quests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Тема
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Статистика
  const completedQuests = quests.filter((q) => q.status === "done");
  const totalCompletedQuests = completedQuests.length;
  const totalPendingQuests = quests.filter(
    (q) => q.status === "pending"
  ).length;
  const totalXpFromQuests = completedQuests.reduce(
    (sum, q) => sum + q.xpReward,
    0
  );
  const averageXpPerQuest =
    totalCompletedQuests > 0
      ? Math.round(totalXpFromQuests / totalCompletedQuests)
      : 0;

  // Статистика по дням (для streak)
  const today = new Date().toDateString();
  const daysWithQuests = new Set(
    completedQuests.map((q) => new Date().toDateString()) // В реальности здесь была бы дата завершения квеста
  ).size;

  // Генерируем xpHistory из завершенных квестов
  const generatedXpHistory: XpEntry[] = completedQuests.map((quest, index) => ({
    xp: quest.xpReward,
    time:
      Date.now() - (completedQuests.length - index - 1) * 24 * 60 * 60 * 1000,
  }));

  // Используем сгенерированный history если localStorage пуст
  const displayXpHistory =
    xpHistory.length > 0 ? xpHistory : generatedXpHistory;

  // Не рендерим контент до монтирования на клиенте
  if (!hasMounted) {
    return null;
  }

  return (
    <Layout onSettingsClick={() => setSettingsOpen(true)} onShopClick={() => setShopOpen(true)}>
      <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4">

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {/* Левая колонка */}
          <div className="space-y-4">
            <PlayerCard
              player={player}
              setPlayer={setPlayer}
              showDetailedStats={true}
              quests={quests}
              showResetButton={true}
            />

            {/* Статистика */}
            <StatCard isLoading={isLoading} rows={[
              { label: "Всего квестов",       value: String(quests.length) },
              { label: "Выполнено",           value: String(totalCompletedQuests),  accent: "text-green-500" },
              { label: "В процессе",          value: String(totalPendingQuests),    accent: "text-blue-500" },
              { label: "Процент выполнения",  value: `${quests.length > 0 ? Math.round((totalCompletedQuests / quests.length) * 100) : 0}%` },
              { label: "Средний XP за квест", value: String(averageXpPerQuest),     accent: "text-violet-500" },
            ]} />
          </div>

          {/* Правая колонка */}
          <div className="space-y-4">
            {quests.some((q) => q.nodeId) ? (
              <ProgressChart quests={quests} />
            ) : (
              <EmptyChart />
            )}
            <Achievements player={player} quests={quests} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <Settings
          isOpen={settingsOpen}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onChangeClass={() => {}}
          onClose={() => setSettingsOpen(false)}
          onSignOut={() => signOut({ callbackUrl: "/auth/signin" })}
        />
      )}

      {/* Shop Modal */}
      <Shop
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        playerCoins={player.coins || 0}
        playerLevel={player.level || 1}
        onPurchase={() => {}}
      />
    </Layout>
  );
}
