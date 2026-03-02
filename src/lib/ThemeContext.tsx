// src/lib/ThemeContext.tsx
// Контекст для управления темами интерфейса

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppTheme = 'default' | 'forest' | 'ocean' | 'sunset' | 'cyberpunk' | 'galaxy';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  cardBg: string;
  insetBg: string;
  text: string;
}

const themeColors: Record<AppTheme, ThemeColors> = {
  default: {
    primary: 'from-purple-600 to-indigo-600',
    secondary: 'from-pink-500 to-rose-500',
    accent: 'from-blue-500 to-cyan-500',
    background: 'bg-gray-100 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-800',
    cardBg: 'bg-gray-200/60 dark:bg-gray-800',
    insetBg: 'bg-gray-100/80 dark:bg-gray-700/50',
    text: 'text-gray-900 dark:text-white',
  },
  forest: {
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-lime-500 to-green-500',
    accent: 'from-teal-500 to-green-500',
    background: 'bg-green-50 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-800',
    cardBg: 'bg-green-100/70 dark:bg-gray-800',
    insetBg: 'bg-green-50/80 dark:bg-gray-700/50',
    text: 'text-gray-900 dark:text-white',
  },
  ocean: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-sky-500 to-blue-500',
    accent: 'from-cyan-500 to-teal-500',
    background: 'bg-blue-50 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-800',
    cardBg: 'bg-blue-100/70 dark:bg-gray-800',
    insetBg: 'bg-blue-50/80 dark:bg-gray-700/50',
    text: 'text-gray-900 dark:text-white',
  },
  sunset: {
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-amber-500 to-orange-500',
    accent: 'from-yellow-500 to-amber-500',
    background: 'bg-orange-50 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-800',
    cardBg: 'bg-orange-100/70 dark:bg-gray-800',
    insetBg: 'bg-orange-50/80 dark:bg-gray-700/50',
    text: 'text-gray-900 dark:text-white',
  },
  cyberpunk: {
    primary: 'from-fuchsia-600 to-pink-600',
    secondary: 'from-violet-500 to-purple-500',
    accent: 'from-cyan-400 to-blue-500',
    background: 'bg-gray-900 dark:bg-black',
    card: 'bg-gray-800 dark:bg-gray-900',
    cardBg: 'bg-gray-800',
    insetBg: 'bg-gray-700/60',
    text: 'text-white',
  },
  galaxy: {
    primary: 'from-indigo-600 to-purple-600',
    secondary: 'from-violet-500 to-indigo-500',
    accent: 'from-pink-500 to-purple-500',
    background: 'bg-indigo-950 dark:bg-black',
    card: 'bg-indigo-900/50 dark:bg-gray-900',
    cardBg: 'bg-indigo-900/70',
    insetBg: 'bg-indigo-800/40',
    text: 'text-white',
  },
};

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Загружаем тему из localStorage
    const savedTheme = localStorage.getItem('appTheme') as AppTheme;
    if (savedTheme && themeColors[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Загружаем активную тему из API
    const fetchActiveTheme = async () => {
      try {
        const res = await fetch('/api/shop');
        if (res.ok) {
          const data = await res.json();
          if (data.equipment?.activeTheme) {
            // Преобразуем ID темы в название
            const themeMap: Record<string, AppTheme> = {
              'theme_forest': 'forest',
              'theme_ocean': 'ocean',
              'theme_sunset': 'sunset',
              'theme_cyberpunk': 'cyberpunk',
              'theme_galaxy': 'galaxy',
            };
            const activeTheme = themeMap[data.equipment.activeTheme];
            if (activeTheme) {
              setThemeState(activeTheme);
              localStorage.setItem('appTheme', activeTheme);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки темы:', error);
      }
    };
    
    if (mounted) {
      fetchActiveTheme();
    }
  }, [mounted]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('appTheme', newTheme);
  };

  const colors = themeColors[theme];

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Возвращаем дефолтные значения если контекст не найден
    return {
      theme: 'default' as AppTheme,
      setTheme: () => {},
      colors: themeColors.default,
    };
  }
  return context;
}

export { themeColors };
