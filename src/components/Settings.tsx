// src/components/Settings.tsx
import { useState, useEffect } from "react";
import { getAudioSettings, setSoundEnabled } from "../lib/gameEffects";
import { useAppTheme } from "@/lib/ThemeContext";

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onChangeClass: () => void;
  currentClass?: PlayerClass;
}

const classInfo: Record<PlayerClass, { icon: string; name: string; bar: string }> = {
  warrior:   { icon: "💪", name: "Воин",    bar: "bg-orange-500" },
  scout:     { icon: "🏃", name: "Скаут",   bar: "bg-blue-500" },
  monk:      { icon: "🧘", name: "Монах",   bar: "bg-violet-500" },
  berserker: { icon: "🔥", name: "Берсерк", bar: "bg-red-500" },
};

export function Settings({ isOpen, onClose, isDark, onThemeToggle, onChangeClass, currentClass }: SettingsProps) {
  const [soundOn, setSoundOn] = useState(true);
  const { theme } = useAppTheme();

  useEffect(() => {
    setSoundOn(getAudioSettings().soundEnabled);
  }, [isOpen]);

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Полностью непрозрачные фоны — без /60 /70 /80
  const modalBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-900 text-pink-100";
      case "galaxy":    return "bg-indigo-950 text-purple-100";
      case "forest":    return "bg-white dark:bg-green-950 text-green-900 dark:text-green-100";
      case "ocean":     return "bg-white dark:bg-cyan-950 text-cyan-900 dark:text-cyan-100";
      case "sunset":    return "bg-white dark:bg-orange-950 text-orange-900 dark:text-orange-100";
      default:          return "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100";
    }
  };

  const rowBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-800";
      case "galaxy":    return "bg-indigo-900";
      default:          return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const divider = "h-px mx-4 bg-black/8 dark:bg-white/8";

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
        on ? "bg-blue-500" : "bg-black/20 dark:bg-white/20"
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
      <div className={`${modalBg()} rounded-2xl w-full max-w-sm shadow-2xl`}>

        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold">Настройки</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-5 space-y-2">

          {/* Переключатели */}
          <div className={`${rowBg()} rounded-2xl overflow-hidden`}>
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium">Тёмная тема</span>
              <Toggle on={isDark} onToggle={onThemeToggle} />
            </div>
            <div className={divider} />
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-sm font-medium">Звуки</span>
              <Toggle on={soundOn} onToggle={handleSoundToggle} />
            </div>
          </div>

          {/* Класс */}
          <div className={`${rowBg()} rounded-2xl overflow-hidden`}>
            {currentClass && classInfo[currentClass] ? (
              <div className="relative flex items-center justify-between px-4 py-3.5">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${classInfo[currentClass].bar}`} />
                <div className="flex items-center gap-2.5 pl-2">
                  <span className="text-lg">{classInfo[currentClass].icon}</span>
                  <span className="text-sm font-medium">{classInfo[currentClass].name}</span>
                </div>
                <button
                  onClick={() => { onChangeClass(); onClose(); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-black/8 dark:bg-white/10 hover:opacity-70 transition-opacity"
                >
                  Сменить
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm opacity-40">Класс не выбран</span>
                <button
                  onClick={() => { onChangeClass(); onClose(); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-black/8 dark:bg-white/10 hover:opacity-70 transition-opacity"
                >
                  Выбрать
                </button>
              </div>
            )}
          </div>

          {/* О приложении */}
          <div className={`${rowBg()} rounded-2xl px-4 py-3.5`}>
            <p className="text-sm font-medium">GymQuest</p>
            <p className="text-xs opacity-40 mt-0.5">Геймификация фитнеса · v1.0</p>
          </div>

        </div>
      </div>
    </div>
  );
}
