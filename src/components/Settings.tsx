// src/components/Settings.tsx
import { getAudioSettings, setSoundEnabled } from "../lib/gameEffects";

type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onChangeClass: () => void;
  currentClass?: PlayerClass;
}

const classInfo: Record<PlayerClass, { icon: string; name: string }> = {
  warrior: { icon: "💪", name: "Воин" },
  scout: { icon: "🏃", name: "Скаут" },
  monk: { icon: "🧘", name: "Монах" },
  berserker: { icon: "🔥", name: "Берсерк" },
};

export function Settings({ isOpen, onClose, isDark, onThemeToggle, onChangeClass, currentClass }: SettingsProps) {
  const { soundEnabled } = getAudioSettings();

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Настройки</h2>
          <button onClick={onClose} className="text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">✕</button>
        </div>

        {/* Тема оформления */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Внешний вид
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Тема оформления
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isDark ? "Тёмная тема" : "Светлая тема"}
              </p>
            </div>
            <button
              onClick={onThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Звуковые эффекты */}
        <div className="space-y-4 border-t dark:border-gray-700 pt-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Звуковые эффекты
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Звуки при выполнении квестов
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Воспроизводить звуковые эффекты при завершении задач
              </p>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                soundEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Типы звуков:
          </h4>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li>Легкие квесты - звон колокольчика</li>
            <li>Средние квесты - звук успеха</li>
            <li>Сложные квесты - фанфары победы</li>
            <li>Достижения - особые звуковые эффекты</li>
          </ul>
        </div>

        {/* Класс персонажа */}
        <div className="border-t dark:border-gray-700 pt-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Класс персонажа
          </h3>
          {currentClass && classInfo[currentClass] ? (
            <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <span className="text-3xl">{classInfo[currentClass].icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {classInfo[currentClass].name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Текущий класс
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Класс не выбран
            </p>
          )}
          <button
            onClick={() => {
              onChangeClass();
              onClose();
            }}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors"
          >
            {currentClass ? "Сменить класс (500 монет)" : "Выбрать класс"}
          </button>
        </div>

        <div className="border-t dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            О приложении
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p>GymQuest v1.0</p>
            <p>Геймификация задач с уровнями и достижениями</p>
            <p>PWA с поддержкой оффлайн режима</p>
          </div>
        </div>
      </div>
    </div>
  );
}
