// src/pages/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useLocalStorage } from "../lib/useLocalStorage";
import { usePlayer, OnboardingData } from "../lib/usePlayer";
import { useDBSync } from "../lib/useDBSync";
import Link from "next/link";
import { PlayerCard } from "../components/PlayerCard";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  celebrateQuestComplete,
  getAudioSettings,
  setSoundEnabled,
} from "../lib/gameEffects";
import { Settings } from "../components/Settings";
import { OnboardingQuestionnaire } from "../components/OnboardingQuestionnaire";
import { LandingPage } from "../components/LandingPage";
import { GenerateQuestsButton } from "../components/GenerateQuestsButton";
import { QuestCard } from "../components/QuestCard";
import { MapProgress } from "../components/MapProgress";
import { Layout } from "../components/Layout";

type Filter = "all" | "pending" | "done";

type XpEntry = {
  xp: number;
  time: number;
};

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
  isGenerated?: boolean;
  nodeId?: string;
  location?: "home" | "gym" | "both";
  showInAllMode?: boolean; // Показывать ли в режиме "Все"
  visualDemo?: {
    type: "image" | "video" | "gif" | "youtube";
    url: string;
    thumbnail?: string;
  };
  stepByStep?: string[];
};

export default function Home() {
  const { data: session, status } = useSession();

  // Показываем Landing Page для неавторизованных пользователей
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
        <div className="text-white text-2xl">Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  // Основной интерфейс для авторизованных пользователей
  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const { data: session } = useSession();
  const router = useRouter();
  const { nodeId } = router.query; // Получаем nodeId из URL
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<"full" | "edit-program">(
    "full"
  );
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<"home" | "gym">(
    "home"
  );

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);

    const { soundEnabled: savedSound } = getAudioSettings();
    setSoundEnabledState(savedSound);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabledState(newSoundState);
    setSoundEnabled(newSoundState);
  };

  const [hasMounted, setHasMounted] = useState(false);

  const sessionKey = session?.user?.email || "guest";

  const [xpHistory, setXpHistory] = useLocalStorage<XpEntry[]>(
    `xpHistory_${sessionKey}`,
    []
  );

  const [player, setPlayer] = usePlayer();
  const db = useDBSync();

  // Проверяем, нужно ли показать опросник
  useEffect(() => {
    if (session && !player.onboardingCompleted) {
      setOnboardingMode("full");
      setShowOnboarding(true);
    }
  }, [session, player.onboardingCompleted]);

  // Автоматическая генерация квестов
  const generateQuests = async () => {
    try {
      const response = await fetch("/api/quests/generate-week", {
        method: "POST",
      });
      if (response.ok) {
        console.log("✅ Квесты сгенерированы автоматически");
        await loadQuests();
      }
    } catch (error) {
      console.error("Error generating quests:", error);
    }
  };

  // Загрузка квестов из API
  const loadQuests = async () => {
    setIsLoadingQuests(true);
    try {
      const response = await fetch("/api/quests");
      if (response.ok) {
        const data = await response.json();
        console.log("🎮 Загружено квестов:", data.length);
        if (data.length > 0) {
          console.log("📝 Первый квест:", {
            title: data[0].title,
            nodeId: data[0].nodeId,
            category: data[0].category,
            hasInstructions: !!data[0].instructions,
            hasTip: !!data[0].tip,
            hasVisualDemo: !!data[0].visualDemo,
            hasStepByStep: !!data[0].stepByStep,
          });
        }
        setQuests(data);

        // Если квестов нет и пройден onboarding - генерируем автоматически
        if (data.length === 0 && player.onboardingCompleted) {
          console.log("🤖 Нет квестов, запускаем автогенерацию...");
          await generateQuests();
        }
      }
    } catch (error) {
      console.error("Error loading quests:", error);
    } finally {
      setIsLoadingQuests(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadQuests();
    }
  }, [session]);

  // Проверка завершения недели (все 7 дней должны быть завершены в ЛЮБОЙ локации)
  useEffect(() => {
    const checkWeekCompletion = async () => {
      if (quests.length === 0) return;

      // Проверяем каждую ноду (день) - она завершена если ВСЕ квесты в ЛЮБОЙ локации выполнены
      const nodeIds = ["node-1", "node-2", "node-3", "node-4", "node-5", "node-6", "node-7"];
      
      const allNodesCompleted = nodeIds.every((nodeId) => {
        const nodeQuests = quests.filter((q) => q.nodeId === nodeId);
        if (nodeQuests.length === 0) return false;
        
        // Группируем по локации
        const homeQuests = nodeQuests.filter((q) => q.location === "home");
        const gymQuests = nodeQuests.filter((q) => q.location === "gym");
        
        // Нода завершена если ВСЕ квесты в ЛЮБОЙ локации выполнены
        const homeComplete = homeQuests.length > 0 && homeQuests.every((q) => q.status === "done");
        const gymComplete = gymQuests.length > 0 && gymQuests.every((q) => q.status === "done");
        
        return homeComplete || gymComplete;
      });

      if (allNodesCompleted) {
        console.log(
          "🎉 Все 7 дней недели завершены! Переход на следующую неделю..."
        );

        // Переходим на следующую неделю
        try {
          const response = await fetch("/api/player/next-week", {
            method: "POST",
          });

          if (response.ok) {
            const data = await response.json();
            console.log("📅 Теперь неделя:", data.weekNumber);

            // Генерируем новые квесты
            await generateQuests();
          }
        } catch (error) {
          console.error("Error advancing week:", error);
        }
      }
    };

    checkWeekCompletion();
  }, [quests]);

  const [filter, setFilter] = useState<Filter>("all");

  // Если открыт узел, фильтруем только его квесты
  const filteredQuests = quests.filter((q) => {
    // Фильтр по узлу (если выбран)
    if (nodeId && typeof nodeId === "string") {
      if (q.nodeId !== nodeId) return false;
    }

    // Фильтр по локации (дом/зал)
    if (locationFilter === "home") {
      // Показываем домашние квесты без инвентаря (location === "home")
      if (q.location !== "home") return false;
    }
    if (locationFilter === "gym") {
      // Показываем зальные квесты с инвентарем (location === "gym")
      if (q.location !== "gym") return false;
    }

    // Фильтр по статусу
    const statusMatch = filter === "all" ? true : q.status === filter;
    // Фильтр по категории (если выбрана)
    const categoryMatch = selectedCategory
      ? q.category === selectedCategory
      : true;
    return statusMatch && categoryMatch;
  });

  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const xpInLevel = player.xp % 100;
  const progressPercent = Math.round((xpInLevel / 100) * 100);

  // Переключить статус квеста
  async function toggleQuest(id: string) {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;

    const newStatus = quest.status === "pending" ? "done" : "pending";

    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Обновляем локально
        setQuests((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );

        // Если квест завершен, начисляем XP и монеты
        if (newStatus === "done") {
          const today = new Date().toISOString().split("T")[0];
          let newStreak = player.streak;

          // Обновляем стрик
          if (player.lastQuestDate === today) {
            // Уже выполняли квест сегодня
            newStreak = player.streak;
          } else if (player.lastQuestDate) {
            const lastDate = new Date(player.lastQuestDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor(
              (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 1) {
              // Продолжаем стрик
              newStreak = player.streak + 1;
            } else {
              // Стрик прервался
              newStreak = 1;
            }
          } else {
            // Первый квест
            newStreak = 1;
          }

          // Награды за квест
          const baseCoins =
            quest.difficulty === "easy"
              ? 10
              : quest.difficulty === "medium"
              ? 20
              : 30;
          const streakBonus = Math.floor(newStreak / 7) * 5; // +5 монет за каждые 7 дней стрика
          const totalCoins = baseCoins + streakBonus;

          const newXp = player.xp + quest.xpReward;
          const newLevel = Math.floor(newXp / 500) + 1;
          const newCoins = player.coins + totalCoins;

          setPlayer({
            ...player,
            xp: newXp,
            level: newLevel,
            coins: newCoins,
            streak: newStreak,
            lastQuestDate: today,
          });
          setXpHistory((hist) => [...hist, { xp: newXp, time: Date.now() }]);

          celebrateQuestComplete(quest.difficulty);
        }
        // Если квест отменен, отнимаем XP
        else if (newStatus === "pending") {
          const newXp = Math.max(0, player.xp - quest.xpReward);
          const newLevel = Math.floor(newXp / 500) + 1;

          setPlayer({ ...player, xp: newXp, level: newLevel });
          setXpHistory((hist) => [...hist, { xp: newXp, time: Date.now() }]);
        }
      }
    } catch (error) {
      console.error("Error toggling quest:", error);
    }
  }

  // Удаление квеста
  function deleteQuest(id: string) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/quests/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuests((prev) => prev.filter((q) => q.id !== deleteId));
      }
    } catch (error) {
      console.error("Error deleting quest:", error);
    } finally {
      setDeleteId(null);
    }
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  // Очистка всех квестов
  async function clearAllQuests() {
    try {
      const response = await fetch("/api/quests/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        setQuests([]);
        setShowClearConfirm(false);
      }
    } catch (error) {
      console.error("Error clearing quests:", error);
    }
  }

  // Обработчик завершения опросника
  async function handleOnboardingComplete(data: OnboardingData) {
    setPlayer({
      ...player,
      onboardingCompleted: true,
      onboardingData: data,
    });

    if (session) {
      await db.saveOnboarding(data);
    }

    setShowOnboarding(false);

    // Автоматически генерируем первые квесты
    setTimeout(() => {
      loadQuests();
    }, 500);
  }

  async function handleOnboardingSkip() {
    setPlayer({
      ...player,
      onboardingCompleted: true,
    });

    if (session) {
      await db.updatePlayer({ onboardingCompleted: true });
    }

    setShowOnboarding(false);
  }

  return (
    <Layout onSettingsClick={() => setSettingsOpen(true)}>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Профиль игрока */}
          <PlayerCard
            player={player}
            setPlayer={setPlayer}
            showDetailedStats={false}
            quests={quests}
            showResetButton={true}
          />

          {/* Если открыт узел - показываем кнопку возврата и список квестов */}
          {nodeId ? (
            <div className="space-y-6">
              {/* Кнопка возврата к карте */}
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
              >
                <span className="text-xl">←</span>
                Вернуться к карте
              </button>

              {/* Заголовок узла */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  {nodeId === "node-1"
                    ? "День 1"
                    : nodeId === "node-2"
                    ? "День 2"
                    : nodeId === "node-3"
                    ? "День 3"
                    : nodeId === "node-4"
                    ? "День 4"
                    : nodeId === "node-5"
                    ? "День 5"
                    : nodeId === "node-6"
                    ? "День 6"
                    : nodeId === "node-7"
                    ? "День 7"
                    : "Тренировка"}
                </h2>
                <p className="opacity-90">
                  Выполните все квесты, чтобы открыть следующий узел
                </p>
              </div>

              {/* Список квестов узла */}
              {isLoadingQuests ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    Загрузка квестов...
                  </div>
                </div>
              ) : filteredQuests.length > 0 ? (
                <div className="space-y-4">
                  {filteredQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onToggle={toggleQuest}
                      onDelete={deleteQuest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
                    В этом узле пока нет квестов
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Вернитесь к карте и сгенерируйте новые квесты
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Карта прогресса - главный элемент */
            <MapProgress
              quests={quests}
              onLocationFilterChange={setLocationFilter}
              trainingMode={
                player.onboardingData?.workoutPreference?.[0] ===
                "Силовые тренировки"
                  ? "strength"
                  : player.onboardingData?.workoutPreference?.[0] ===
                    "Кардио-тренировки"
                  ? "cardio"
                  : player.onboardingData?.workoutPreference?.[0] ===
                    "Йога и растяжка"
                  ? "flexibility"
                  : "mixed"
              }
            />
          )}
        </div>
      </div>

      {/* Модалка настроек */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        onThemeToggle={() => setIsDark((prev) => !prev)}
        onChangeProgram={() => {
          setOnboardingMode("edit-program");
          setShowOnboarding(true);
        }}
      />

      {/* Опросник для новых пользователей */}
      {showOnboarding && (
        <OnboardingQuestionnaire
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
          mode={onboardingMode}
        />
      )}
    </Layout>
  );
}
