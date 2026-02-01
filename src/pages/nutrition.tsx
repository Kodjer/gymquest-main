// src/pages/nutrition.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { NutritionTips } from "../components/NutritionTips";
import { useState, useEffect } from "react";
import { Settings } from "../components/Settings";
import { LandingPage } from "../components/LandingPage";
import { Layout } from "../components/Layout";

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
    <Layout onSettingsClick={() => setSettingsOpen(true)}>
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
    </Layout>
  );
}
