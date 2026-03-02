// src/components/ClassSelection.tsx
import { useState } from "react";

export type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface ClassInfo {
  id: PlayerClass;
  name: string;
  icon: string;
  color: string;
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
  const [hoveredClass, setHoveredClass] = useState<PlayerClass | null>(null);

  const displayClass = hoveredClass || selectedClass;
  const classInfo = displayClass
    ? classes.find((c) => c.id === displayClass)
    : null;

  const handleConfirm = () => {
    if (selectedClass) {
      const info = classes.find((c) => c.id === selectedClass)!;
      onSelectClass(selectedClass, info);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-6xl w-full my-8">
        {/* Кнопка закрытия */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold transition-colors"
          >
            ✕
          </button>
        )}

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Выбери свой класс
          </h1>
          <p className="text-gray-300 text-lg">
            Твой класс определит стиль тренировок и бонусы
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Карточки классов */}
          <div className="grid grid-cols-2 gap-4">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                onMouseEnter={() => setHoveredClass(cls.id)}
                onMouseLeave={() => setHoveredClass(null)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedClass === cls.id
                    ? `border-white bg-gradient-to-br ${cls.bgGradient} shadow-2xl scale-105`
                    : "border-gray-600 bg-gray-800/50 hover:border-gray-400"
                }`}
              >
                {/* Выбранная метка */}
                {selectedClass === cls.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    ✓
                  </div>
                )}

                <div className="text-5xl mb-3">{cls.icon}</div>
                <h3
                  className={`text-xl font-bold ${
                    selectedClass === cls.id ? "text-white" : cls.color
                  }`}
                >
                  {cls.name}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    selectedClass === cls.id ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {cls.focus}
                </p>

                {/* Мини бонус */}
                <div
                  className={`mt-3 text-xs px-2 py-1 rounded-full inline-block ${
                    selectedClass === cls.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {cls.passive.bonus.split(",")[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Панель информации */}
          <div
            className={`rounded-2xl p-6 border-2 transition-all duration-500 ${
              classInfo
                ? `bg-gradient-to-br ${classInfo.bgGradient} border-white/30`
                : "bg-gray-800/50 border-gray-600"
            }`}
          >
            {classInfo ? (
              <div className="text-white">
                {/* Заголовок класса */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{classInfo.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold">{classInfo.name}</h2>
                    <p className="text-white/70">{classInfo.focus}</p>
                  </div>
                </div>

                {/* Описание */}
                <p className="text-white/90 mb-6 leading-relaxed">
                  {classInfo.description}
                </p>

                {/* Пассивная способность */}
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">
                      Пассивка: {classInfo.passive.name}
                    </h3>
                  </div>
                  <p className="text-white/80 text-sm mb-2">
                    {classInfo.passive.description}
                  </p>
                  <div className="text-yellow-300 font-semibold">
                    {classInfo.passive.bonus}
                  </div>
                </div>

                {/* Активная способность */}
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">
                      Активка: {classInfo.active.name}
                    </h3>
                  </div>
                  <p className="text-white/80 text-sm mb-2">
                    {classInfo.active.description}
                  </p>
                  <div className="text-cyan-300 text-sm">
                    Перезарядка: {classInfo.active.cooldown}
                  </div>
                </div>

                {/* Эволюция */}
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">Эволюция на уровне {classInfo.evolution.level}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{classInfo.icon}</span>
                    <span className="text-white/50">→</span>
                    <span className="text-2xl">{classInfo.evolution.icon}</span>
                    <span className="font-bold text-yellow-300">
                      {classInfo.evolution.name}
                    </span>
                  </div>
                </div>

                {/* Типы квестов */}
                <div className="mb-6">
                  <h4 className="text-sm text-white/70 mb-2">
                    Рекомендуемые упражнения:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {classInfo.questTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p>Выбери класс слева, чтобы увидеть подробности</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопка подтверждения */}
        <div className="mt-8 text-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedClass}
            className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 ${
              selectedClass
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-2xl"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedClass ? "Начать" : "Выбери класс"}
          </button>

          {selectedClass && (
            <p className="text-gray-400 mt-4 text-sm">
              Класс можно будет сменить позже за 500 монет
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { classes };
export type { ClassInfo };
