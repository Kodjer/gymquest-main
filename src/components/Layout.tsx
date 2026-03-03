// src/components/Layout.tsx
import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppTheme } from "../lib/ThemeContext";

type LayoutProps = {
  children: ReactNode;
  onSettingsClick?: () => void;
  onShopClick?: () => void;
};

// Иконки SVG для нижней навигации
const IconMap    = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconUser   = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconApple  = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2a3 3 0 0 0-3 3c0 1.6.8 2.8 2 3.4V9H8a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-1a5 5 0 0 0-5-5h-3V8.4c1.2-.6 2-1.8 2-3.4a3 3 0 0 0-3-3z"/></svg>;
const IconShop   = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IconGear   = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;

export function Layout({ children, onSettingsClick, onShopClick }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, colors } = useAppTheme();

  const isColoredTheme = ["forest", "ocean", "sunset"].includes(theme);
  const isDarkTheme    = ["cyberpunk", "galaxy"].includes(theme);

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
      case "cyberpunk": return "bg-gray-950 border-gray-800";
      case "galaxy":    return "bg-indigo-950 border-indigo-900";
      case "forest":    return "bg-green-700 dark:bg-green-900 border-green-600";
      case "ocean":     return "bg-cyan-700 dark:bg-cyan-900 border-cyan-600";
      case "sunset":    return "bg-orange-600 dark:bg-orange-800 border-orange-500";
      default:          return "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";
    }
  };

  const bottomNavBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-950 border-gray-800";
      case "galaxy":    return "bg-indigo-950 border-indigo-900";
      case "forest":    return "bg-green-800 border-green-700";
      case "ocean":     return "bg-cyan-800 border-cyan-700";
      case "sunset":    return "bg-orange-700 border-orange-600";
      default:          return "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";
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

  const activeColor = () => {
    switch (theme) {
      case "cyberpunk": return "text-cyan-400";
      case "galaxy":    return "text-purple-300";
      case "forest":    return "text-green-200";
      case "ocean":     return "text-cyan-200";
      case "sunset":    return "text-orange-200";
      default:          return "text-blue-500 dark:text-blue-400";
    }
  };

  const inactiveColor = () => {
    if (isColoredTheme || isDarkTheme) return "text-white/40";
    return "text-gray-400 dark:text-gray-500";
  };

  const navItems: { href?: string; label: string; icon: React.ReactNode; onClick?: () => void }[] = [
    { href: "/",          label: "Карта",    icon: <IconMap /> },
    { href: "/profile",   label: "Профиль",  icon: <IconUser /> },
    { href: "/nutrition", label: "Питание",  icon: <IconApple /> },
    ...(onShopClick     ? [{ label: "Магазин",   icon: <IconShop />,  onClick: onShopClick }]     : []),
    ...(onSettingsClick ? [{ label: "Настройки", icon: <IconGear />,  onClick: onSettingsClick }] : []),
  ];

  return (
    <div className={`${getBackgroundClasses()} overflow-x-hidden`}>
      {/* Верхняя шапка — только лого */}
      <div className={`sticky top-0 z-50 border-b safe-top ${headerBg()}`}>
        <div className="px-4 h-12 flex items-center justify-between">
          <span className={`text-lg font-bold tracking-tight ${logoClass()}`}>GymQuest</span>
          {session && (
            <span className={`text-xs truncate max-w-[140px] ${
              isColoredTheme || isDarkTheme ? "text-white/50" : "text-gray-400 dark:text-gray-500"
            }`}>
              {session.user?.name || session.user?.email}
            </span>
          )}
        </div>
      </div>

      {/* Контент — с паддингом снизу под нижний бар */}
      <div className="pb-bottom-nav">
        {children}
      </div>

      {/* Нижняя навигация */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 border-t safe-bottom ${bottomNavBg()}`}>
        <div className="flex items-stretch justify-around">
          {navItems.map((item) => {
            const active = item.href ? router.pathname === item.href : false;
            const cls = `flex flex-col items-center justify-center gap-0.5 py-2 flex-1 min-w-0 transition-colors ${
              active ? activeColor() : inactiveColor()
            }`;
            const content = (
              <>
                {item.icon}
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </>
            );
            if (item.onClick) {
              return <button key={item.label} onClick={item.onClick} className={cls}>{content}</button>;
            }
            return <Link key={item.label} href={item.href!} className={cls}>{content}</Link>;
          })}
        </div>
      </div>
    </div>
  );
}
