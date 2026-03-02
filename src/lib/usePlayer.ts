// src/lib/usePlayer.ts
import { useLocalStorage } from "./useLocalStorage";

export type OnboardingData = {
  howDidYouHear: string; // Как узнали о приложении
  age: number; // Возраст
  weight: number; // Вес в кг
  height: number; // Рост в см
  fitnessExperience: string; // Опыт тренировок (начинающий, средний, продвинутый)
  availableTime: string; // Доступное время (30 мин, 1 час, 2+ часа)
  workoutPreference: string[]; // Предпочитаемые типы тренировок
  fitnessGoals: string[]; // Цели (похудение, набор массы, здоровье, выносливость)
  injuries: string; // Травмы или ограничения
  dietPreference: string; // Предпочтения в питании
  completedAt: number; // Timestamp завершения опроса
};

export type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

export type Player = {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastQuestDate: string | null; // Дата последнего выполненного квеста (YYYY-MM-DD)
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData;
  // Система классов
  playerClass?: PlayerClass;
  classLevel?: number;
  classXp?: number;
  isEvolved?: boolean;
};

export function usePlayer() {
  // по умолчанию 0 XP, уровень 1, 0 монет, 0 стрик
  return useLocalStorage<Player>("player", {
    xp: 0,
    level: 1,
    coins: 0,
    streak: 0,
    lastQuestDate: null,
    onboardingCompleted: false,
    playerClass: undefined,
    classLevel: 1,
    classXp: 0,
    isEvolved: false,
  });
}
