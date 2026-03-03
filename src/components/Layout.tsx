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

  const headerBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-950";
      case "galaxy":    return "bg-indigo-950";
      case "forest":    return "bg-green-700 dark:bg-green-900 text-white";
      case "ocean":     return "bg-cyan-700 dark:bg-cyan-900 text-white";
      case "sunset":    return "bg-orange-600 dark:bg-orange-800 text-white";
      default:          return "bg-white dark:bg-gray-900";
    }
  };

  const logoClass = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent";
      case "galaxy":    return "bg-gradient-to-r from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent";
      case "forest":
      case "ocean":
      case "sunset":    return "text-white";
      default:          return `bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent`;
    }
  };

  const isColoredTheme = ["forest", "ocean", "sunset"].includes(theme);
  const isDarkTheme = ["cyberpunk", "galaxy"].includes(theme);

  const navLink = (href: string, label: string, onClick?: () => void) => {
    const active = router.pathname === href;
    let cls = "";
    if (isColoredTheme) {
      cls = active
        ? "text-sm font-semibold text-white"
        : "text-sm text-white/60 hover:text-white/90 transition-colors";
    } else if (isDarkTheme) {
      cls = active
        ? `text-sm font-semibold ${theme === "cyberpunk" ? "text-cyan-400" : "text-purple-300"}`
        : `text-sm ${theme === "cyberpunk" ? "text-pink-300/60 hover:text-pink-300" : "text-purple-300/60 hover:text-purple-300"} transition-colors`;
    } else {
      cls = active
        ? "text-sm font-semibold text-blue-500 dark:text-blue-400"
        : "text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors";
    }

    if (onClick) return <button onClick={onClick} className={cls}>{label}</button>;
    return <Link href={href} className={cls}>{label}</Link>;
  };

  return (
    <div className={getBackgroundClasses()}>
      <div className={`sticky top-0 z-50 ${headerBg()}`}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Лого + имя */}
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold tracking-tight ${logoClass()}`}>GymQuest</span>
            {session && (
              <span className={`hidden md:inline text-xs font-medium ${
                isColoredTheme ? "text-white/50" : isDarkTheme ? "opacity-40" : "text-gray-400 dark:text-gray-500"
              }`}>
                {session.user?.name || session.user?.email}
              </span>
            )}
          </div>

          {/* Навигация */}
          <div className="flex items-center gap-5">
            {navLink("/", "Карта")}
            {navLink("/profile", "Профиль")}
            {navLink("/nutrition", "Питание")}

            {onShopClick && navLink("", "Магазин", onShopClick)}
            {onSettingsClick && navLink("", "Настройки", onSettingsClick)}
            {session && navLink("", "Выйти", () => signOut())}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
