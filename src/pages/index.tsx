// src/pages/index.tsx
import { useState, useEffect, useCallback, Component, ReactNode, ErrorInfo } from "react";
import { SplashScreen } from "../components/SplashScreen";
import { useRouter } from "next/router";
import { useLocalStorage } from "../lib/useLocalStorage";
import { usePlayer } from "../lib/usePlayer";
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
import { LandingPage } from "../components/LandingPage";
import { GenerateQuestsButton } from "../components/GenerateQuestsButton";
import { QuestCard } from "../components/QuestCard";
import { MapProgress } from "../components/MapProgress";
import { Layout } from "../components/Layout";
import { ClassSelection, PlayerClass, ClassInfo } from "../components/ClassSelection";
import { Shop } from "../components/Shop";
import { useEquipment } from "@/lib/useEquipment";

// Error Boundary — catches crashes in AuthenticatedApp without kicking user to landing page
interface EBState { hasError: boolean; retries: number; recovering: boolean }
class AppErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, retries: 0, recovering: false };
  }
  static getDerivedStateFromError() { return { hasError: true, recovering: false }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AppErrorBoundary caught:", error, info);
    // Auto-recover up to 3 times
    if (this.state.retries < 3) {
      this.setState({ recovering: true });
      setTimeout(() => {
        this.setState(prev => ({
          hasError: false,
          recovering: false,
          retries: prev.retries + 1,
        }));
      }, 800);
    }
  }
  render() {
    if (this.state.hasError && !this.state.recovering) {
      // Exhausted retries — show full-screen with reload
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 p-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Что-то пошло не так</h2>
          <p className="text-purple-200 text-sm mb-6">Попробуйте перезапустить приложение</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl"
          >
            Перезапустить
          </button>
        </div>
      );
    }
    if (this.state.recovering) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800">
          <div className="text-white text-lg">Восстановление...</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Smaller boundary just for MapProgress — on crash shows "reload map" without killing app
class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; resetKey: number }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, resetKey: 0 };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("MapErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl bg-gray-100 dark:bg-gray-800 p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Ошибка загрузки карты</p>
          <button
            onClick={() => this.setState({ hasError: false, resetKey: this.state.resetKey + 1 })}
            className="px-5 py-2 bg-purple-500 text-white rounded-xl text-sm font-semibold"
          >
            Обновить карту
          </button>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}

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
  const [sessionTimedOut, setSessionTimedOut] = useState(false);
  // Если уже показывали сплэш в этой сессии — не показываем снова (при переходе с других вкладок)
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("gymquest_splash_done") === "1") {
      setSplashDone(true);
    }
  }, []);

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem("gymquest_splash_done", "1");
    setSplashDone(true);
  }, []);

  // Если сессия грузится дольше 5 секунд — считаем пользователя неавторизованным
  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setSessionTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [status]);

  // Рендерим содержимое (сплэш — оверлей поверх)
  const renderContent = () => {
    if ((status === "loading" && !sessionTimedOut) || !splashDone) {
      // Пустой фон пока грузится / показывается сплэш
      return <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900" />;
    }
    if (!session || sessionTimedOut) {
      return <LandingPage />;
    }
    return (
      <AppErrorBoundary>
        <AuthenticatedApp />
      </AppErrorBoundary>
    );
  };

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      {renderContent()}
    </>
  );
}

function AuthenticatedApp() {
  const { data: session } = useSession();
  const router = useRouter();
  const { nodeId } = router.query; // Получаем nodeId из URL
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showClassSelection, setShowClassSelection] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [equipmentVersion, setEquipmentVersion] = useState(0); // Для обновления PlayerCard
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<"home" | "gym">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locationFilter");
      if (saved === "gym" || saved === "home") return saved;
    }
    return "home";
  });

  // Сохраняем выбор локации при каждом изменении
  useEffect(() => {
    localStorage.setItem("locationFilter", locationFilter);
  }, [locationFilter]);

  // Хук для экипировки и бустов
  const equipmentData = useEquipment();

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

  // Восстановить данные из БД при входе (если localStorage пустой после переустановки)
  const [dbHydrated, setDbHydrated] = useState(false);
  useEffect(() => {
    if (!session?.user?.email) return;
    // Если в localStorage уже есть класс — гидрация не нужна
    if (player.onboardingCompleted && player.playerClass) {
      setDbHydrated(true);
      return;
    }
    // Загружаем данные игрока из БД
    fetch("/api/player")
      .then(r => r.ok ? r.json() : null)
      .then(dbPlayer => {
        if (dbPlayer?.onboardingCompleted && dbPlayer?.playerClass) {
          // Восстанавливаем эксперт-данные из БД в localStorage
          setPlayer(prev => ({
            ...prev,
            onboardingCompleted: true,
            playerClass: dbPlayer.playerClass,
            xp: dbPlayer.xp ?? prev.xp,
            level: dbPlayer.level ?? prev.level,
            coins: dbPlayer.coins ?? prev.coins,
            streak: dbPlayer.streak ?? prev.streak,
            lastQuestDate: dbPlayer.lastQuestDate ?? prev.lastQuestDate,
          }));
        }
        setDbHydrated(true);
      })
      .catch(() => setDbHydrated(true));
  }, [session?.user?.email]);

  // Показываем выбор класса только после гидрации из БД
  useEffect(() => {
    if (session && dbHydrated && !player.onboardingCompleted) {
      setShowClassSelection(true);
    }
  }, [session, dbHydrated, player.onboardingCompleted]);

  // Автоматическая генерация квестов
  const generateQuests = async () => {
    try {
      const nativeToken = localStorage.getItem("gymquest_native_token");
      const response = await fetch("/api/quests/generate-week", {
        method: "POST",
        headers: nativeToken ? { "X-Native-Auth": nativeToken } : {},
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
    // Сразу показываем кэш если есть (без спиннера задержки)
    try {
      const cached = localStorage.getItem("gymquest_quests_cache");
      if (cached) {
        setQuests(JSON.parse(cached));
      } else {
        setIsLoadingQuests(true);
      }
    } catch {}

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 сек таймаут
      let response: Response;
      try {
        response = await fetch("/api/quests", { signal: controller.signal });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr?.name === "AbortError") {
          console.warn("⏱ Загрузка квестов: таймаут 15с");
        } else {
          console.error("Fetch /api/quests error:", fetchErr);
        }
        return;
      }
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
        // Сохраняем свежие данные в кэш
        try { localStorage.setItem("gymquest_quests_cache", JSON.stringify(data)); } catch {}

        // Если квестов нет и пройден onboarding - генерируем автоматически
        if (data.length === 0 && player.onboardingCompleted) {
          console.log("🤖 Нет квестов, запускаем автогенерацию...");
          await generateQuests();
        }

        // Если ВСЕ квесты выполнены - генерируем новую неделю
        if (data.length > 0 && player.onboardingCompleted) {
          const allDone = data.every((q: any) => q.status === "done");
          if (allDone) {
            console.log("🏆 Неделя завершена! Генерируем новую неделю...");
            try { localStorage.removeItem("gymquest_quests_cache"); } catch {}
            await generateQuests();
          }
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

  // После DB-гидрации: если квестов нет и onboarding завершён — генерируем
  useEffect(() => {
    if (session && dbHydrated && player.onboardingCompleted && quests.length === 0) {
      generateQuests();
    }
  }, [dbHydrated]);

  // Android Back button — предотвращает случайный выход из приложения
  useEffect(() => {
    const isNative = !!(window as any)?.Capacitor?.isNativePlatform?.();
    if (!isNative) return;
    let lastBackPress = 0;
    const handleBack = (e: Event) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastBackPress < 2000) {
        // Дважды нажали Back в течение 2с — выходим
        (window as any)?.Capacitor?.nativeCallback?.("App", "exitApp", {});
        return;
      }
      lastBackPress = now;
      // Возвращаемся по истории, или показываем подсказку
      if (window.history.length > 1) {
        window.history.back();
      }
    };
    document.addEventListener("backbutton", handleBack);
    return () => document.removeEventListener("backbutton", handleBack);
  }, []);

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

  // Расчёт бонусов класса
  function calculateClassBonus(
    baseXp: number,
    baseCoins: number,
    questCategory: string | undefined,
    questDifficulty: string,
    playerClass: PlayerClass | undefined,
    streak: number
  ): { xp: number; coins: number; bonusText: string } {
    let xpMultiplier = 1;
    let coinMultiplier = 1;
    let bonusText = "";

    if (playerClass) {
      switch (playerClass) {
        case "warrior":
          // +25% XP за силовые
          if (questCategory === "strength") {
            xpMultiplier = 1.25;
            bonusText = "+25% XP (Воин)";
          }
          break;
        case "scout":
          // +25% XP за кардио, +10% бонус стрика
          if (questCategory === "cardio") {
            xpMultiplier = 1.25;
            bonusText = "+25% XP (Скаут)";
          }
          // Бонус к стрику обрабатывается отдельно
          break;
        case "monk":
          // +25% XP за гибкость, +15% монет
          if (questCategory === "flexibility") {
            xpMultiplier = 1.25;
            bonusText = "+25% XP (Монах)";
          }
          coinMultiplier = 1.15;
          break;
        case "berserker":
          // +40% XP за сложные, -15% за лёгкие
          if (questDifficulty === "hard") {
            xpMultiplier = 1.4;
            bonusText = "+40% XP (Берсерк)";
          } else if (questDifficulty === "easy") {
            xpMultiplier = 0.85;
            bonusText = "-15% XP (Берсерк)";
          }
          break;
      }
    }

    return {
      xp: Math.round(baseXp * xpMultiplier),
      coins: Math.round(baseCoins * coinMultiplier),
      bonusText,
    };
  }

  // Переключить статус квеста
  async function toggleQuest(id: string) {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;

    const newStatus = quest.status === "pending" ? "done" : "pending";

    // Сохраняем предыдущее состояние для возможного отката
    const previousQuests = quests;
    const previousPlayer = { ...player };

    // === ОПТИМИСТИЧНОЕ ОБНОВЛЕНИЕ — мгновенно меняем UI ===
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

      // Базовые награды за квест
      const baseCoins =
        quest.difficulty === "easy"
          ? 10
          : quest.difficulty === "medium"
          ? 20
          : 30;
      
      // Применяем бонусы класса
      const classBonus = calculateClassBonus(
        quest.xpReward,
        baseCoins,
        quest.category,
        quest.difficulty,
        player.playerClass,
        newStreak
      );

      // Бонус стрика для Скаута (+10%)
      let streakMultiplier = 1;
      if (player.playerClass === "scout" && newStreak >= 3) {
        streakMultiplier = 1.1;
      }

      // Добавляем бонус стрика от питомца
      const petStreakBonus = equipmentData.getStreakBonus();
      streakMultiplier += petStreakBonus;

      const streakBonus = Math.floor(newStreak / 7) * 5; // +5 монет за каждые 7 дней стрика
      
      // Применяем множители от бустов и питомцев
      const xpMultiplier = equipmentData.getXpMultiplier();
      const coinMultiplier = equipmentData.getCoinMultiplier();
      const categoryBonus = equipmentData.getCategoryXpBonus(quest.category || '');
      
      let totalXp = Math.round(classBonus.xp * streakMultiplier * xpMultiplier);
      // Добавляем категорийный бонус (например, от кота-йога за гибкость)
      if (categoryBonus > 0) {
        totalXp = Math.round(totalXp * (1 + categoryBonus));
      }
      
      const totalCoins = Math.round(classBonus.coins * streakMultiplier * coinMultiplier) + streakBonus;

      const newXp = player.xp + totalXp;
      const newLevel = Math.floor(newXp / 500) + 1;
      const newCoins = player.coins + totalCoins;

      // Логируем бонус если есть
      if (classBonus.bonusText) {
        console.log(`🎮 Бонус класса: ${classBonus.bonusText}`);
      }
      if (xpMultiplier > 1 || coinMultiplier > 1) {
        console.log(`✨ Множители: XP x${xpMultiplier.toFixed(1)}, Монеты x${coinMultiplier.toFixed(1)}`);
      }

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

    // === Синхронизируем с сервером в фоне ===
    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Откатываем оптимистичные изменения при ошибке
        setQuests(previousQuests);
        setPlayer(previousPlayer);
        console.error("Ошибка сохранения квеста, откат изменений");
      } else {
        // Обновляем кэш после успешного сохранения
        try {
          const updatedQuests = previousQuests.map((q) =>
            q.id === id ? { ...q, status: newStatus } : q
          );
          localStorage.setItem("gymquest_quests_cache", JSON.stringify(updatedQuests));
        } catch {}
      }
    } catch (error) {
      // Откатываем изменения при ошибке сети
      setQuests(previousQuests);
      setPlayer(previousPlayer);
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

  // Обработчик выбора класса
  async function handleClassSelect(classId: PlayerClass, classInfo: ClassInfo) {
    try {
      // Если игрок уже имеет класс, проверяем монеты
      if (player.playerClass && player.coins < 500) {
        alert("Недостаточно монет для смены класса! Нужно 500 монет.");
        return;
      }

      const response = await fetch("/api/player/select-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerClass: classId }),
      });

      if (response.ok) {
        // Если это смена класса, снимаем монеты
        const newCoins = player.playerClass ? player.coins - 500 : player.coins;
        
        setPlayer({
          ...player,
          onboardingCompleted: true,
          playerClass: classId,
          coins: newCoins,
        });
        setShowClassSelection(false);

        // Автоматически генерируем первые квесты только для новых игроков
        if (!player.playerClass) {
          setTimeout(async () => {
            // Вызываем generateQuests напрямую (не loadQuests), чтобы не зависеть
            // от устаревшего замыкания player.onboardingCompleted
            await generateQuests();
          }, 500);
        }
      } else {
        console.error("Failed to save class");
      }
    } catch (error) {
      console.error("Error selecting class:", error);
    }
  }

  // Обработчик покупки в магазине
  const handleShopPurchase = (item: { price: number }, newBalance: number) => {
    setPlayer({
      ...player,
      coins: newBalance,
    });
  };

  return (
    <Layout 
      onSettingsClick={() => setSettingsOpen(true)}
      onShopClick={() => setShopOpen(true)}
    >
      <div className="p-3 sm:p-4 overflow-x-hidden w-full">
        <div className="space-y-4 sm:space-y-6">
          {/* Профиль игрока */}
          <PlayerCard
            key={`player-card-${equipmentVersion}`}
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
                onClick={() => router.push("/", undefined, { scroll: false })}
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
              >
                <span className="text-xl">←</span>
                Вернуться к карте
              </button>

              {/* Заголовок узла */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 sm:p-6 text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">
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
                <p className="text-sm sm:text-base opacity-90">
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
                      playerClass={player.playerClass}
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
            <div className="overflow-hidden rounded-xl">
            <MapErrorBoundary>
            <MapProgress
              quests={quests}
              onLocationFilterChange={setLocationFilter}
              trainingMode={
                player.playerClass === "warrior" || player.playerClass === "berserker"
                  ? "strength"
                  : player.playerClass === "scout"
                  ? "cardio"
                  : player.playerClass === "monk"
                  ? "flexibility"
                  : "mixed"
              }
            />
            </MapErrorBoundary>
            </div>
          )}
        </div>
      </div>

      {/* Модалка настроек */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        onThemeToggle={() => setIsDark((prev) => !prev)}
        onChangeClass={() => {
          setShowClassSelection(true);
        }}
        currentClass={player.playerClass}
        onSignOut={() => {
          // Очищаем нативную сессию APK
          localStorage.removeItem("gymquest_native_session");
          localStorage.removeItem("gymquest_native_token");
          localStorage.removeItem("gymquest_native_user");
          const isNative = !!(window as any)?.Capacitor?.isNativePlatform?.();
          if (isNative) {
            // В APK не вызываем NextAuth signOut (он проксируется на Vercel и открывает браузер)
            // Просто перезагружаем — index покажет LandingPage без сессии
            window.location.replace("/");
          } else {
            signOut({ redirect: false }).then(() => {
              window.location.href = "/auth/signin";
            });
          }
        }}
      />

      {/* Выбор класса */}
      {showClassSelection && (
        <ClassSelection 
          onSelectClass={handleClassSelect} 
          onClose={player.playerClass ? () => setShowClassSelection(false) : undefined}
        />
      )}

      {/* Магазин */}
      <Shop
        isOpen={shopOpen}
        onClose={() => {
          setShopOpen(false);
          // Обновляем экипировку после закрытия магазина
          equipmentData.refetch?.();
          setEquipmentVersion(v => v + 1); // Перезагружаем PlayerCard
        }}
        playerCoins={player.coins || 0}
        playerLevel={player.level || 1}
        onPurchase={handleShopPurchase}
      />
    </Layout>
  );
}
