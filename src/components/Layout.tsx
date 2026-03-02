// src/components/Layout.tsx
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ReactNode } from "react";
import { useAppTheme } from "../lib/ThemeContext";

type LayoutProps = {
  children: ReactNode;
  onSettingsClick?: () => void;
  onShopClick?: () => void;
};

export function Layout({ children, onSettingsClick, onShopClick }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, colors } = useAppTheme();

  const getBackgroundClasses = () => {
    switch (theme) {
      case "cyberpunk": return "min-h-screen bg-gray-950 text-pink-100";
      case "galaxy":    return "min-h-screen bg-indigo-950 text-purple-100";
      case "forest":    return "min-h-screen bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100";
      case "ocean":     return "min-h-screen bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-100";
      case "sunset":    return "min-h-screen bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100";
      default:          return "min-h-screen bg-white dark:bg-gray-900";
    }
  };

  // Единый flat-хедер, адаптированный под тему
  const headerBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-900/95 border-b border-fuchsia-500/30 backdrop-blur-sm";
      case "galaxy":    return "bg-indigo-900/95 border-b border-purple-500/30 backdrop-blur-sm";
      case "forest":    return "bg-green-600/95 dark:bg-green-800/95 border-b border-white/10 backdrop-blur-sm text-white";
      case "ocean":     return "bg-cyan-600/95 dark:bg-cyan-800/95 border-b border-white/10 backdrop-blur-sm text-white";
      case "sunset":    return "bg-orange-500/95 dark:bg-orange-700/95 border-b border-white/10 backdrop-blur-sm text-white";
      default:          return "bg-white/90 dark:bg-gray-900/90 border-b border-black/8 dark:border-white/8 backdrop-blur-sm";
    }
  };

  const titleClass = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent";
      case "galaxy":    return "bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent";
      case "forest":
      case "ocean":
      case "sunset":    return "text-white font-bold";
      default:          return `bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`;
    }
  };

  const navCls = () => {
    switch (theme) {
      case "cyberpunk": return "text-sm text-pink-300 hover:text-cyan-400 transition-colors";
      case "galaxy":    return "text-sm text-purple-300 hover:text-pink-400 transition-colors";
      case "forest":
      case "ocean":
      case "sunset":    return "text-sm text-white/80 hover:text-white transition-colors";
      default:          return "text-sm opacity-50 hover:opacity-80 transition-opacity";
    }
  };

  return (
    <div className={getBackgroundClasses()}>
      {/* Хедер */}
      <div className={`sticky top-0 z-50 ${headerBg()}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-xl font-bold ${titleClass()}`}>GymQuest</h1>
            {session && (
              <span className="hidden md:inline text-sm opacity-40 font-medium">
                {session.user?.name || session.user?.email}
              </span>
            )}
          </div>
          <nav className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className={navCls()}>Карта</button>
            <Link href="/profile"    className={navCls()}>Профиль</Link>
            <Link href="/nutrition"  className={navCls()}>Питание</Link>
            {onShopClick && (
              <button onClick={onShopClick} className={navCls()}>Магазин</button>
            )}
            {onSettingsClick && (
              <button onClick={onSettingsClick} className={navCls()}>Настройки</button>
            )}
            {session && (
              <button onClick={() => signOut()} className={navCls()}>Выйти</button>
            )}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}
