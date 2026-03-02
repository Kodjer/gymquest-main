// src/components/Settings.tsx
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
  const { soundEnabled } = getAudioSettings();
  const { colors, theme } = useAppTheme();

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";
  const divider = "border-t border-black/8 dark:border-white/8";
  const labelCls = "text-xs font-semibold uppercase tracking-wide opacity-40";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className={`${colors.cardBg} ${colors.text} rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl`}>

        {/* Заголовок */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <h2 className="text-xl font-bold">Настройки</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5 space-y-1">

          {/* Внешний вид */}
          <p className={`${labelCls} mb-1 mt-2`}>Внешний вид</p>
          <div className={`${colors.insetBg} rounded-xl px-4`}>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Тёмная тема</p>
                <p className="text-xs opacity-40">{isDark ? "Включена" : "Выключена"}</p>
              </div>
              <button
                onClick={onThemeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? "bg-blue-500" : "bg-black/15 dark:bg-white/15"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Звук */}
          <p className={`${labelCls} mb-1 mt-4`}>Звуковые эффекты</p>
          <div className={`${colors.insetBg} rounded-xl px-4`}>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Звуки квестов</p>
                <p className="text-xs opacity-40">Эффекты при завершении задач</p>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? "bg-blue-500" : "bg-black/15 dark:bg-white/15"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className={`${divider} py-3 space-y-0.5`}>
              {["Легкие квесты — звон колокольчика", "Средние квесты — звук успеха", "Сложные квесты — фанфары победы"].map((t) => (
                <p key={t} className="text-xs opacity-40">{t}</p>
              ))}
            </div>
          </div>

          {/* Класс */}
          <p className={`${labelCls} mb-1 mt-4`}>Класс персонажа</p>
          <div className={`${colors.insetBg} rounded-xl overflow-hidden`}>
            {currentClass && classInfo[currentClass] ? (
              <div className="relative flex items-center gap-3 px-4 py-3">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${classInfo[currentClass].bar}`} />
                <span className="text-2xl pl-2">{classInfo[currentClass].icon}</span>
                <div>
                  <p className="font-semibold text-sm">{classInfo[currentClass].name}</p>
                  <p className="text-xs opacity-40">Текущий класс</p>
                </div>
              </div>
            ) : (
              <p className="px-4 py-3 text-sm opacity-40">Класс не выбран</p>
            )}
          </div>
          <button
            onClick={() => { onChangeClass(); onClose(); }}
            className={`w-full mt-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${
              isAlwaysDark
                ? "bg-white/15 hover:bg-white/20 text-white"
                : "bg-black/8 dark:bg-white/10 hover:opacity-80"
            }`}
          >
            {currentClass ? "Сменить класс (500 монет)" : "Выбрать класс"}
          </button>

          {/* О приложении */}
          <p className={`${labelCls} mb-1 mt-4`}>О приложении</p>
          <div className={`${colors.insetBg} rounded-xl px-4 py-3 space-y-0.5`}>
            <p className="text-xs opacity-40">GymQuest v1.0</p>
            <p className="text-xs opacity-40">Геймификация задач с уровнями и достижениями</p>
            <p className="text-xs opacity-40">PWA с поддержкой оффлайн режима</p>
          </div>

        </div>
      </div>
    </div>
  );
}
