// src/pages/index.tsx
import { useState, useEffect } from "react";
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
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<"full" | "edit-program">(
    "full"
  );
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);

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
            hasInstructions: !!data[0].instructions,
            hasTip: !!data[0].tip,
            hasVisualDemo: !!data[0].visualDemo,
            hasStepByStep: !!data[0].stepByStep,
            visualDemo: data[0].visualDemo,
            stepByStep: data[0].stepByStep,
          });
        }
        setQuests(data);
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

  const [filter, setFilter] = useState<Filter>("all");
  const filteredQuests = quests.filter((q) =>
    filter === "all" ? true : q.status === filter
  );

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

        // Если квест завершен, обновляем XP
        if (newStatus === "done") {
          const newXp = player.xp + quest.xpReward;
          const newLevel = Math.floor(newXp / 100) + 1;

          setPlayer({ ...player, xp: newXp, level: newLevel });
          setXpHistory((hist) => [...hist, { xp: newXp, time: Date.now() }]);

          celebrateQuestComplete(quest.difficulty);
        }
      }
    } catch (error) {
      console.error("Error toggling quest:", error);
    }
  }

  // Удаление квеста
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Хедер */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="font-semibold">
                Привет, {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/nutrition"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                🍎 Питание
              </Link>
              <Link
                href="/profile"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                📊 Профиль
              </Link>
              <button onClick={() => signOut()} className="text-sm underline">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/nutrition"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Питание
              </Link>
              <Link
                href="/profile"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Профиль
              </Link>
              <button onClick={() => signIn()} className="text-sm underline">
                Войти
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-sm underline"
            title="Настройки"
          >
            Настройки
          </button>
          <button
            className="text-2xl md:hidden"
            onClick={() => setMobileFilterOpen((open) => !open)}
            aria-label="Toggle filter menu"
          >
            {isMobileFilterOpen ? "✖️" : "☰"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Профиль игрока */}
        <PlayerCard
          player={player}
          setPlayer={setPlayer}
          showDetailedStats={false}
          quests={quests}
          showResetButton={true}
        />

        {/* Кнопка генерации квестов */}
        <GenerateQuestsButton onQuestsGenerated={loadQuests} />

        {/* Десктоп-фильтр */}
        <div className="hidden md:flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "btn-filter-active" : "btn-filter"}
          >
            Все ({quests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={
              filter === "pending" ? "btn-filter-active" : "btn-filter"
            }
          >
            Активные ({quests.filter((q) => q.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={filter === "done" ? "btn-filter-active" : "btn-filter"}
          >
            Завершённые ({quests.filter((q) => q.status === "done").length})
          </button>
        </div>

        {/* Мобильный фильтр */}
        {isMobileFilterOpen && (
          <div className="flex flex-col gap-2 mb-4 md:hidden">
            <button
              onClick={() => {
                setFilter("all");
                setMobileFilterOpen(false);
              }}
              className={filter === "all" ? "btn-filter-active" : "btn-filter"}
            >
              Все ({quests.length})
            </button>
            <button
              onClick={() => {
                setFilter("pending");
                setMobileFilterOpen(false);
              }}
              className={
                filter === "pending" ? "btn-filter-active" : "btn-filter"
              }
            >
              Активные ({quests.filter((q) => q.status === "pending").length})
            </button>
            <button
              onClick={() => {
                setFilter("done");
                setMobileFilterOpen(false);
              }}
              className={filter === "done" ? "btn-filter-active" : "btn-filter"}
            >
              Завершённые ({quests.filter((q) => q.status === "done").length})
            </button>
          </div>
        )}

        {/* Список квестов */}
        {isLoadingQuests ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Загрузка квестов...
            </p>
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xl mb-2">🎯</p>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "Нет квестов. Нажмите кнопку выше, чтобы получить новые!"
                : filter === "pending"
                ? "Нет активных квестов"
                : "Нет завершенных квестов"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onToggle={toggleQuest}
                onDelete={(id) => setDeleteId(id)}
                showActions={false}
              />
            ))}
          </div>
        )}

        {/* Кнопка замены всех квестов */}
        {quests.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Заменить квесты
            </button>
          </div>
        )}

        {/* Модалка подтверждения удаления */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-box bg-white text-black dark:bg-gray-800 dark:text-white border dark:border-gray-700">
              <p className="mb-4">Вы точно хотите удалить этот квест?</p>
              <div className="flex justify-end gap-2">
                <button onClick={cancelDelete} className="btn-cancel-modal">
                  Отмена
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-confirm bg-red-500 text-white dark:bg-red-600"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модалка подтверждения замены квестов */}
        {showClearConfirm && (
          <div className="modal-overlay">
            <div className="modal-box bg-white text-black dark:bg-gray-800 dark:text-white border dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4">Заменить квесты</h3>
              <p className="mb-4">
                Вы действительно хотите заменить текущие квесты на новые?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Все текущие квесты будут удалены, и вы сможете получить новые
                квесты с обновленными описаниями.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn-cancel-modal"
                >
                  Отмена
                </button>
                <button
                  onClick={clearAllQuests}
                  className="btn-confirm bg-purple-600 text-white dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800"
                >
                  Заменить
                </button>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
}
