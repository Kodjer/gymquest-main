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

  // Получаем классы фона в зависимости от темы
  const getBackgroundClasses = () => {
    console.log('Current theme:', theme); // Для отладки
    switch (theme) {
      case 'cyberpunk':
        return 'min-h-screen bg-gray-950 text-pink-100';
      case 'galaxy':
        return 'min-h-screen bg-indigo-950 text-purple-100';
      case 'forest':
        return 'min-h-screen bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100';
      case 'ocean':
        return 'min-h-screen bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-100';
      case 'sunset':
        return 'min-h-screen bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100';
      default:
        return 'min-h-screen bg-white dark:bg-gray-900';
    }
  };

  const getHeaderClasses = () => {
    switch (theme) {
      case 'cyberpunk':
        return 'sticky top-0 z-50 bg-gray-900 border-b-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30';
      case 'galaxy':
        return 'sticky top-0 z-50 bg-indigo-900 border-b-2 border-purple-500 shadow-lg shadow-purple-500/30';
      case 'forest':
        return 'sticky top-0 z-50 bg-green-600 dark:bg-green-800 shadow-lg text-white';
      case 'ocean':
        return 'sticky top-0 z-50 bg-cyan-600 dark:bg-cyan-800 shadow-lg text-white';
      case 'sunset':
        return 'sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg text-white';
      default:
        return 'sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md';
    }
  };

  const getTitleGradient = () => {
    // Для тёмных тем используем яркие контрастные цвета
    switch (theme) {
      case 'cyberpunk':
        return 'bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent';
      case 'galaxy':
        return 'bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent';
      case 'forest':
      case 'ocean':
      case 'sunset':
        return 'text-white font-bold drop-shadow-lg';
      default:
        return `bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`;
    }
  };

  // Классы для навигационных ссылок
  const getNavLinkClasses = () => {
    switch (theme) {
      case 'cyberpunk':
        return 'text-sm text-pink-300 hover:text-cyan-400 transition-colors';
      case 'galaxy':
        return 'text-sm text-purple-300 hover:text-pink-400 transition-colors';
      case 'forest':
      case 'ocean':
      case 'sunset':
        return 'text-sm text-white/90 hover:text-white transition-colors';
      default:
        return 'text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors';
    }
  };

  // Классы для имени пользователя
  const getUsernameClasses = () => {
    switch (theme) {
      case 'cyberpunk':
        return 'hidden md:inline text-sm font-semibold text-fuchsia-300';
      case 'galaxy':
        return 'hidden md:inline text-sm font-semibold text-purple-300';
      case 'forest':
      case 'ocean':
      case 'sunset':
        return 'hidden md:inline text-sm font-semibold text-white/80';
      default:
        return 'hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={getBackgroundClasses()}>
      {/* Хедер */}
      <div className={getHeaderClasses()}>
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold ${getTitleGradient()}`}>
              GymQuest
            </h1>
            {session && (
              <span className={getUsernameClasses()}>
                {session.user?.name || session.user?.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className={getNavLinkClasses()}
            >
              Карта
            </button>
            <Link
              href="/profile"
              className={getNavLinkClasses()}
            >
              Профиль
            </Link>
            <Link
              href="/nutrition"
              className={getNavLinkClasses()}
            >
              Питание
            </Link>
            {onShopClick && (
              <button
                onClick={onShopClick}
                className={`${getNavLinkClasses()} flex items-center gap-1`}
                title="Магазин"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">Магазин</span>
              </button>
            )}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className={getNavLinkClasses()}
                title="Настройки"
              >
                Настройки
              </button>
            )}
            {session && (
              <button
                onClick={() => signOut()}
                className={getNavLinkClasses()}
              >
                Выйти
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Контент */}
      {children}
    </div>
  );
}
