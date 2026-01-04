// src/lib/useDBSync.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Quest {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  tip?: string;
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "done";
  category?: string;
  visualDemo?: {
    type: "image" | "video" | "gif" | "youtube";
    url: string;
    thumbnail?: string;
  };
  stepByStep?: string[];
  createdAt?: string;
}

interface Player {
  id?: string;
  level: number;
  xp: number;
  onboardingCompleted?: boolean;
  onboardingData?: any;
}

export function useDBSync() {
  const { data: session, status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [syncError, setSyncError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" && !!session;

  // Получение всех квестов
  const fetchQuests = async (): Promise<Quest[]> => {
    if (!isAuthenticated) return [];

    try {
      const response = await fetch("/api/quests");
      if (!response.ok) {
        if (response.status === 401) return []; // Не авторизован - это нормально
        throw new Error("Failed to fetch quests");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch quests error:", error);
      return [];
    }
  };

  // Создание квеста
  const createQuest = async (
    quest: Omit<Quest, "id" | "createdAt">
  ): Promise<Quest | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quest),
      });

      if (!response.ok) throw new Error("Failed to create quest");
      return await response.json();
    } catch (error) {
      console.error("Create quest error:", error);
      setSyncError("Ошибка создания квеста");
      return null;
    }
  };

  // Обновление квеста
  const updateQuest = async (
    id: string,
    updates: Partial<Quest>
  ): Promise<Quest | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update quest");
      return await response.json();
    } catch (error) {
      console.error("Update quest error:", error);
      setSyncError("Ошибка обновления квеста");
      return null;
    }
  };

  // Удаление квеста
  const deleteQuest = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch(`/api/quests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quest");
      return true;
    } catch (error) {
      console.error("Delete quest error:", error);
      setSyncError("Ошибка удаления квеста");
      return false;
    }
  };

  // Получение профиля игрока
  const fetchPlayer = async (): Promise<Player | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch("/api/player");
      if (!response.ok) {
        if (response.status === 401) return null; // Не авторизован - это нормально
        throw new Error("Failed to fetch player");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch player error:", error);
      return null;
    }
  };

  // Обновление профиля игрока
  const updatePlayer = async (
    updates: Partial<Player>
  ): Promise<Player | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch("/api/player", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update player");
      return await response.json();
    } catch (error) {
      console.error("Update player error:", error);
      setSyncError("Ошибка обновления профиля");
      return null;
    }
  };

  // Сохранение данных опросника
  const saveOnboarding = async (data: any): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch("/api/player/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save onboarding data");
      setLastSyncTime(new Date().toISOString());
      return true;
    } catch (error) {
      console.error("Save onboarding error:", error);
      setSyncError("Ошибка сохранения анкеты");
      return false;
    }
  };

  // Получение данных опросника
  const fetchOnboarding = async (): Promise<any | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch("/api/player/onboarding");
      if (response.status === 401 || response.status === 404) return null; // Не авторизован или не заполнен
      if (!response.ok) {
        throw new Error("Failed to fetch onboarding data");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch onboarding error:", error);
      return null;
    }
  };

  // Синхронизация всех данных
  const syncAll = async () => {
    if (!isAuthenticated || isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      await Promise.all([fetchQuests(), fetchPlayer(), fetchOnboarding()]);
      setLastSyncTime(new Date().toISOString());
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError("Ошибка синхронизации");
    } finally {
      setIsSyncing(false);
    }
  };

  // Автоматическая синхронизация при изменении статуса авторизации
  useEffect(() => {
    if (isAuthenticated) {
      syncAll();
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    syncError,
    // Квесты
    fetchQuests,
    createQuest,
    updateQuest,
    deleteQuest,
    // Игрок
    fetchPlayer,
    updatePlayer,
    // Опросник
    saveOnboarding,
    fetchOnboarding,
    // Общая синхронизация
    syncAll,
  };
}
