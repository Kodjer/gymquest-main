// src/pages/profile.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { usePlayer } from "../lib/usePlayer";
import { PlayerCard } from "../components/PlayerCard";
import { ProgressChart, XpEntry } from "../components/ProgressChart";
import { Achievements } from "../components/Achievements";

type Quest = {
  id: string;
  title: string;
  xpReward: number;
  status: "pending" | "done";
  difficulty: "easy" | "medium" | "hard";
};

export default function Profile() {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);
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
    time: Date.now() - (completedQuests.length - index - 1) * 24 * 60 * 60 * 1000,
  }));

  // Используем сгенерированный history если localStorage пуст
  const displayXpHistory = xpHistory.length > 0 ? xpHistory : generatedXpHistory;

  // Не рендерим контент до монтирования на клиенте
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4">
        {/* Заголовок с навигацией */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
            >
              ← Назад к квестам
            </Link>
            <Link
              href="/nutrition"
              className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block ml-4"
            >
              🍎 Питание
            </Link>
            <h1 className="text-3xl font-bold">Профиль игрока</h1>
            {session?.user?.email && (
              <p className="text-gray-600 dark:text-gray-400">
                {session.user.email}
              </p>
            )}
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Левая колонка - Карточка игрока и статистика */}
          <div className="space-y-6">
            <PlayerCard
              player={player}
              setPlayer={setPlayer}
              showDetailedStats={true}
              quests={quests}
              showResetButton={true}
            />

            {/* Дополнительная статистика */}
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                📊 Детальная статистика
              </h3>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Загрузка статистики...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Всего квестов:
                    </span>
                    <span className="font-semibold">{quests.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Выполнено:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {totalCompletedQuests}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      В процессе:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {totalPendingQuests}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Процент выполнения:
                    </span>
                    <span className="font-semibold">
                      {quests.length > 0
                        ? Math.round((totalCompletedQuests / quests.length) * 100)
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Средний XP за квест:
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {averageXpPerQuest}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Активных дней:
                    </span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {daysWithQuests}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - График прогресса */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                📈 График прогресса XP
              </h3>
              {displayXpHistory.length > 0 ? (
                <ProgressChart xpHistory={displayXpHistory} />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p className="mb-2">📊</p>
                  <p>
                    Выполните несколько квестов,
                    <br />
                    чтобы увидеть график прогресса
                  </p>
                </div>
              )}
            </div>

            {/* Система достижений */}
            <Achievements player={player} quests={quests} />
          </div>
        </div>
      </div>
    </div>
  );
}
