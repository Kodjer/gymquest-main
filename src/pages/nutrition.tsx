// src/pages/nutrition.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { NutritionTips } from "../components/NutritionTips";
import { useState, useEffect } from "react";
import { Settings } from "../components/Settings";
import { Shop } from "../components/Shop";
import { LandingPage } from "../components/LandingPage";
import { Layout } from "../components/Layout";
import { usePlayer } from "../lib/usePlayer";

export default function NutritionPage() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [player, setPlayer] = usePlayer();

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
    <Layout onSettingsClick={() => setSettingsOpen(true)} onShopClick={() => setShopOpen(true)}>
      {/* Основной контент */}
      <NutritionTips />

      {/* Модалка настроек */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        onThemeToggle={() => setIsDark((prev) => !prev)}
        onChangeClass={() => {}}
        onSignOut={() => {
          localStorage.removeItem("gymquest_native_session");
          localStorage.removeItem("gymquest_native_token");
          localStorage.removeItem("gymquest_native_user");
          const isNative = !!(window as any)?.Capacitor?.isNativePlatform?.();
          if (isNative) {
            window.location.replace("/");
          } else {
            signOut({ redirect: false }).then(() => {
              window.location.href = "/auth/signin";
            });
          }
        }}
      />

      {/* Магазин */}
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
