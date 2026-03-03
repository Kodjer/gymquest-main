// src/components/ClassSelection.tsx
import { useState } from "react";
import { useAppTheme } from "../lib/ThemeContext";

export type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface ClassInfo {
  id: PlayerClass;
  name: string;
  icon: string;
  color: string;
  bar: string;
  ring: string;
  borderCls: string;
  bgGradient: string;
  focus: string;
  description: string;
  passive: {
    name: string;
    description: string;
    bonus: string;
  };
  active: {
    name: string;
    description: string;
    cooldown: string;
  };
  evolution: {
    name: string;
    icon: string;
    level: number;
  };
  questTypes: string[];
}

const classes: ClassInfo[] = [
  {
    id: "warrior",
    name: "Воин",
    icon: "💪",
    color: "text-red-500",
    bar: "bg-orange-500",
    ring: "ring-orange-400",
    borderCls: "border-orange-400",
    bgGradient: "from-red-500 to-orange-600",
    focus: "Силовые тренировки",
    description: "Мастер силы и выносливости. Воины специализируются на силовых упражнениях и получают бонусы за тяжёлые тренировки.",
    passive: {
      name: "Железная воля",
      description: "Увеличенный XP за силовые квесты",
      bonus: "+25% XP за силовые упражнения",
    },
    active: {
      name: "Боевой клич",
      description: "Следующий выполненный квест даёт двойной XP",
      cooldown: "1 раз в день",
    },
    evolution: {
      name: "Титан",
      icon: "⚔️",
      level: 10,
    },
    questTypes: ["Жим", "Приседания", "Становая тяга", "Отжимания"],
  },
  {
    id: "scout",
    name: "Скаут",
    icon: "🏃",
    color: "text-blue-500",
    bar: "bg-blue-500",
    ring: "ring-blue-400",
    borderCls: "border-blue-400",
    bgGradient: "from-blue-500 to-cyan-600",
    focus: "Кардио тренировки",
    description: "Быстрый и выносливый. Скауты превосходны в кардио упражнениях и получают бонусы за поддержание стрика.",
    passive: {
      name: "Второе дыхание",
      description: "Увеличенный XP за кардио и бонус к стрику",
      bonus: "+25% XP за кардио, +10% бонус стрика",
    },
    active: {
      name: "Спринт",
      description: "Мгновенно завершить один лёгкий квест",
      cooldown: "1 раз в 3 дня",
    },
    evolution: {
      name: "Следопыт",
      icon: "🦅",
      level: 10,
    },
    questTypes: ["Бег", "Прыжки", "Берпи", "Скакалка"],
  },
  {
    id: "monk",
    name: "Монах",
    icon: "🧘",
    color: "text-purple-500",
    bar: "bg-violet-500",
    ring: "ring-violet-400",
    borderCls: "border-violet-400",
    bgGradient: "from-purple-500 to-pink-600",
    focus: "Гибкость и баланс",
    description: "Мастер гармонии тела и духа. Монахи специализируются на растяжке, йоге и получают больше монет.",
    passive: {
      name: "Внутренний мир",
      description: "Увеличенный XP за гибкость и бонусные монеты",
      bonus: "+25% XP за растяжку, +15% монет",
    },
    active: {
      name: "Медитация",
      description: "Получить 50 бонусных монет",
      cooldown: "1 раз в день",
    },
    evolution: {
      name: "Мудрец",
      icon: "🌟",
      level: 10,
    },
    questTypes: ["Йога", "Растяжка", "Планка", "Дыхание"],
  },
  {
    id: "berserker",
    name: "Берсерк",
    icon: "🔥",
    color: "text-orange-500",
    bar: "bg-red-500",
    ring: "ring-red-400",
    borderCls: "border-red-400",
    bgGradient: "from-orange-500 to-red-700",
    focus: "Хардкорные тренировки",
    description: "Безумный воин, живущий ради вызова. Берсерки получают огромные бонусы за сложные квесты, но меньше за лёгкие.",
    passive: {
      name: "Жажда боя",
      description: "Огромный бонус за сложные квесты",
      bonus: "+40% XP за сложные, -15% за лёгкие",
    },
    active: {
      name: "Ярость",
      description: "Следующий квест любой сложности даёт XP как за сложный",
      cooldown: "1 раз в 2 дня",
    },
    evolution: {
      name: "Демон",
      icon: "👹",
      level: 10,
    },
    questTypes: ["HIIT", "Табата", "Суперсеты", "Комплексы"],
  },
];

interface ClassSelectionProps {
  onSelectClass: (classId: PlayerClass, classInfo: ClassInfo) => void;
  onClose?: () => void;
}

export function ClassSelection({ onSelectClass, onClose }: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const { theme } = useAppTheme();

  const modalBg = () => {
    switch (theme) {
      case "cyberpunk": return "bg-gray-900 text-pink-100";
      case "galaxy":    return "bg-indigo-950 text-purple-100";
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

  const handleConfirm = () => {
    if (selectedClass) {
      const info = classes.find((c) => c.id === selectedClass)!;
      onSelectClass(selectedClass, info);
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col overflow-y-auto ${modalBg()}`}>
      {/* Шапка */}
      <div className={`flex items-center justify-between px-5 py-4 sticky top-0 z-10 ${modalBg()}`}>
        <h2 className="text-lg font-semibold">Выбор класса</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-4 pb-6 space-y-2 max-w-lg mx-auto w-full">

        {/* Вводный блок */}
        <div className={`${rowBg()} rounded-2xl px-4 py-4 space-y-3 mb-4`}>
          <p className="text-sm font-semibold">Кто ты в этом путешествии?</p>
          <p className="text-xs opacity-50 leading-relaxed">
            Класс определяет, какие упражнения будут генерироваться для тебя каждую неделю. Воин получает силовые тренировки, Скаут — кардио, Монах — растяжку и восстановление, Берсерк — максимальную интенсивность.
          </p>
          <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
            <span className="text-xs opacity-40">Класс можно сменить позже в настройках · 500 монет</span>
          </div>
        </div>
        {/* Список классов */}
        {classes.map((cls) => {
          const active = selectedClass === cls.id;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(active ? null : cls.id)}
              className={`relative w-full text-left rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                active
                  ? `${rowBg()} ${cls.borderCls}`
                  : `${rowBg()} border-transparent`
              }`}
            >
              {/* Левая полоса */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cls.bar}`} />

              <div className="pl-5 pr-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cls.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{cls.name}</p>
                      <p className="text-xs opacity-40">{cls.focus}</p>
                    </div>
                  </div>
                  {active && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Детали раскрываются при выборе */}
                {active && (
                  <div className="mt-3 space-y-2 border-t border-black/8 dark:border-white/8 pt-3">
                    <p className="text-xs opacity-60 leading-relaxed">{cls.description}</p>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase opacity-40 mb-0.5">Пассивка</p>
                        <p className="text-xs font-medium">{cls.passive.name}</p>
                        <p className="text-[11px] opacity-50 mt-0.5">{cls.passive.bonus}</p>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase opacity-40 mb-0.5">Активка</p>
                        <p className="text-xs font-medium">{cls.active.name}</p>
                        <p className="text-[11px] opacity-50 mt-0.5">{cls.active.cooldown}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase opacity-40">Эволюция</p>
                      <div className="flex items-center gap-1.5 ml-1">
                        <span className="text-sm">{cls.icon}</span>
                        <span className="text-xs opacity-30">→</span>
                        <span className="text-sm">{cls.evolution.icon}</span>
                        <span className="text-xs font-semibold">{cls.evolution.name}</span>
                        <span className="text-[10px] opacity-40">· уровень {cls.evolution.level}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Кнопка подтверждения */}
        <button
          onClick={handleConfirm}
          disabled={!selectedClass}
          className={`w-full mt-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
            selectedClass
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              : "bg-black/8 dark:bg-white/8 opacity-40 cursor-not-allowed"
          }`}
        >
          {selectedClass ? `Выбрать ${classes.find(c => c.id === selectedClass)?.name}` : "Выбери класс"}
        </button>

        {selectedClass && (
          <p className="text-center text-xs opacity-40">Сменить класс позже можно за 500 монет</p>
        )}
      </div>
    </div>
  );
}

export { classes };
export type { ClassInfo };
