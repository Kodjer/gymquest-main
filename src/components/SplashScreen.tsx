// src/components/SplashScreen.tsx
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHiding(true);
      // Ждём завершения анимации fade-out и только потом убираем
      setTimeout(onDone, 500);
    }, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 transition-opacity duration-500"
      style={{ opacity: hiding ? 0 : 1, pointerEvents: hiding ? "none" : "auto" }}
    >
      {/* Декоративные кружки */}
      <div className="absolute top-[-80px] right-[-60px] w-80 h-80 bg-white/5 rounded-full" />
      <div className="absolute bottom-[-100px] left-[-60px] w-96 h-96 bg-white/5 rounded-full" />
      <div className="absolute top-1/3 left-[-120px] w-64 h-64 bg-white/3 rounded-full" />

      {/* Контент */}
      <div className="relative flex flex-col items-center gap-5 animate-[splashIn_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        {/* Логотип */}
        <div className="w-24 h-24 bg-white/15 border-2 border-white/30 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <span className="text-5xl">🏋️</span>
        </div>

        {/* Название */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">GymQuest</h1>
          <p className="text-purple-200 text-sm mt-1.5 font-medium">Превратите фитнес в игру</p>
        </div>

        {/* Спиннер */}
        <div className="mt-4 w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>

      {/* Версия внизу */}
      <p className="absolute bottom-10 text-white/25 text-xs font-medium">v1.0</p>
    </div>
  );
}
