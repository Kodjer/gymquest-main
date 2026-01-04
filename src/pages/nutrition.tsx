// src/pages/nutrition.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { NutritionTips } from "../components/NutritionTips";
import { useState, useEffect } from "react";
import { Settings } from "../components/Settings";
import { LandingPage } from "../components/LandingPage";

export default function NutritionPage() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Хедер */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              GymQuest
            </Link>
            {session ? (
              <>
                <span className="hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {session.user?.name || session.user?.email}
                </span>
              </>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              🏠 Главная
            </Link>
            <Link
              href="/profile"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              📊 Профиль
            </Link>
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title="Настройки"
            >
              ⚙️
            </button>
            {session && (
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Выйти
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <NutritionTips />

      {/* Модалка настроек */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        onThemeToggle={() => setIsDark((prev) => !prev)}
        onChangeProgram={() => {}}
      />
    </div>
  );
}
