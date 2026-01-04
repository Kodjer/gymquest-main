// src/lib/useSupabaseSync.ts
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useLocalStorage } from "./useLocalStorage";

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
  level: number;
  xp: number;
  totalQuests: number;
  completedQuests: number;
}

export function useSupabaseSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useLocalStorage("lastSyncTime", "");

  // Проверка подключения к интернету
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Получение ID пользователя (можно заменить на NextAuth)
  const getUserId = () => {
    const userId = localStorage.getItem("gymquest_user_id");
    if (!userId) {
      const newUserId = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("gymquest_user_id", newUserId);
      return newUserId;
    }
    return userId;
  };

  // Синхронизация квестов с Supabase
  const syncQuests = async (localQuests: Quest[]): Promise<Quest[]> => {
    if (!isOnline) return localQuests;

    try {
      setIsSyncing(true);
      const userId = getUserId();

      // Получаем квесты из Supabase
      const { data: remoteQuests, error: fetchError } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", userId);

      if (fetchError) {
        console.error("Error fetching quests:", fetchError);
        return localQuests;
      }

      // Конвертируем формат данных
      const convertedRemoteQuests: Quest[] = (remoteQuests || []).map((q) => ({
        id: q.id,
        title: q.title,
        xpReward: q.xp_reward,
        difficulty: q.difficulty,
        status: q.status,
        createdAt: q.created_at,
      }));

      // Синхронизируем локальные квесты в Supabase
      for (const quest of localQuests) {
        const existsRemote = convertedRemoteQuests.find(
          (q) => q.id === quest.id
        );

        if (!existsRemote) {
          // Добавляем новый квест
          const { error } = await supabase.from("quests").insert({
            id: quest.id,
            user_id: userId,
            title: quest.title,
            xp_reward: quest.xpReward,
            difficulty: quest.difficulty,
            status: quest.status,
          });

          if (error) console.error("Error inserting quest:", error);
        } else {
          // Обновляем существующий квест
          const { error } = await supabase
            .from("quests")
            .update({
              title: quest.title,
              xp_reward: quest.xpReward,
              difficulty: quest.difficulty,
              status: quest.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", quest.id)
            .eq("user_id", userId);

          if (error) console.error("Error updating quest:", error);
        }
      }

      // Получаем обновленные данные
      const { data: updatedQuests } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", userId);

      const finalQuests: Quest[] = (updatedQuests || []).map((q) => ({
        id: q.id,
        title: q.title,
        xpReward: q.xp_reward,
        difficulty: q.difficulty,
        status: q.status,
        createdAt: q.created_at,
      }));

      setLastSyncTime(new Date().toISOString());
      return finalQuests;
    } catch (error) {
      console.error("Sync error:", error);
      return localQuests;
    } finally {
      setIsSyncing(false);
    }
  };

  // Синхронизация профиля игрока
  const syncPlayer = async (localPlayer: Player): Promise<Player> => {
    if (!isOnline) return localPlayer;

    try {
      const userId = getUserId();

      // Проверяем существование игрока
      const { data: existingPlayer } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existingPlayer) {
        // Обновляем данные игрока
        const { error } = await supabase
          .from("players")
          .update({
            level: localPlayer.level,
            xp: localPlayer.xp,
            total_quests: localPlayer.totalQuests,
            completed_quests: localPlayer.completedQuests,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) console.error("Error updating player:", error);
      } else {
        // Создаем нового игрока
        const { error } = await supabase.from("players").insert({
          user_id: userId,
          level: localPlayer.level,
          xp: localPlayer.xp,
          total_quests: localPlayer.totalQuests,
          completed_quests: localPlayer.completedQuests,
        });

        if (error) console.error("Error creating player:", error);
      }

      return localPlayer;
    } catch (error) {
      console.error("Player sync error:", error);
      return localPlayer;
    }
  };

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    syncQuests,
    syncPlayer,
    getUserId,
  };
}
