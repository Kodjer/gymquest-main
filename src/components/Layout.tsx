// src/components/Layout.tsx
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  onSettingsClick?: () => void;
};

export function Layout({ children, onSettingsClick }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Хедер */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              GymQuest
            </h1>
            {session && (
              <span className="hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-300">
                {session.user?.name || session.user?.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Карта
            </button>
            <Link
              href="/profile"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Профиль
            </Link>
            <Link
              href="/nutrition"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Питание
            </Link>
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                title="Настройки"
              >
                Настройки
              </button>
            )}
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

      {/* Контент */}
      {children}
    </div>
  );
}
