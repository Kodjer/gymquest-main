// src/components/ClassSelection.tsx
import { useState } from "react";
import { useAppTheme } from "../lib/ThemeContext";

export type PlayerClass = "warrior" | "scout" | "monk" | "berserker";

interface ClassInfo {
  id: PlayerClass;
  name: string;
  tagline: string;
  color: string;
  bar: string;
  ring: string;
  borderCls: string;
  bgGradient: string;
  cardGradient: string;
  focus: string;
  description: string;
  forWho: string;
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
    level: number;
  };
  questTypes: string[];
  stats: { label: string; value: number }[];
}

const classes: ClassInfo[] = [
  {
    id: "warrior",
    name: "Силовик",
    tagline: "Жим, тяга, присед",
    color: "text-orange-500",
    bar: "bg-orange-500",
    ring: "ring-orange-400",
    borderCls: "border-orange-400",
    bgGradient: "from-red-500 to-orange-600",
    cardGradient: "from-orange-500/20 to-red-500/10",
    focus: "Силовые тренировки",
    forWho: "Для тех, кто хочет качать мышцы и становиться сильнее каждую неделю",
    description: "Силовик специализируется на базовых упражнениях — жим, приседания, становая тяга. Получает больше XP за тяжёлые тренировки.",
    passive: {
      name: "Железная воля",
      description: "Увеличенный XP за силовые квесты",
      bonus: "+25% XP за силовые упражнения",
    },
    active: {
      name: "Предельное усилие",
      description: "Следующий выполненный квест даёт двойной XP",
      cooldown: "1 раз в день",
    },
    evolution: { name: "Атлет", level: 10 },
    questTypes: ["Жим лёжа", "Приседания", "Становая тяга", "Отжимания"],
    stats: [
      { label: "Сила", value: 5 },
      { label: "Выносл.", value: 3 },
      { label: "Гибкость", value: 1 },
      { label: "Интенс.", value: 3 },
    ],
  },
  {
    id: "scout",
    name: "Кардио",
    tagline: "Привычка и стрик",
    color: "text-blue-500",
    bar: "bg-blue-500",
    ring: "ring-blue-400",
    borderCls: "border-blue-400",
    bgGradient: "from-blue-500 to-cyan-600",
    cardGradient: "from-blue-500/20 to-cyan-500/10",
    focus: "Кардио тренировки",
    forWho: "Для тех, кто любит бегать, двигаться и не пропускать тренировки",
    description: "Кардио — тип для тех, кто хочет войти в привычку. Чем дольше стрик без пропусков, тем больше бонусов. Идеально для ежедневных тренировок.",
    passive: {
      name: "Второе дыхание",
      description: "Увеличенный XP за кардио и бонус к стрику",
      bonus: "+25% XP за кардио, +10% бонус стрика",
    },
    active: {
      name: "Ускорение",
      description: "Мгновенно завершить один лёгкий квест",
      cooldown: "1 раз в 3 дня",
    },
    evolution: { name: "Марафонец", level: 10 },
    questTypes: ["Бег 20 мин", "Прыжки", "Берпи", "Скакалка"],
    stats: [
      { label: "Сила", value: 2 },
      { label: "Выносл.", value: 5 },
      { label: "Гибкость", value: 2 },
      { label: "Интенс.", value: 4 },
    ],
  },
  {
    id: "monk",
    name: "Практик",
    tagline: "Гибкость и восстановление",
    color: "text-purple-500",
    bar: "bg-violet-500",
    ring: "ring-violet-400",
    borderCls: "border-violet-400",
    bgGradient: "from-purple-500 to-pink-600",
    cardGradient: "from-purple-500/20 to-pink-500/10",
    focus: "Гибкость и баланс",
    forWho: "Для тех, кто хочет йогу, растяжку и меньший стресс после работы",
    description: "Практик строит тело через гибкость — йога, растяжка, дыхательные практики. Получает больше монет с каждого квеста.",
    passive: {
      name: "Восстановление",
      description: "Увеличенный XP за гибкость и бонусные монеты",
      bonus: "+25% XP за растяжку, +15% монет",
    },
    active: {
      name: "Концентрация",
      description: "Получить 50 бонусных монет",
      cooldown: "1 раз в день",
    },
    evolution: { name: "Мастер", level: 10 },
    questTypes: ["Йога 15 мин", "Растяжка", "Планка", "Дыхание"],
    stats: [
      { label: "Сила", value: 1 },
      { label: "Выносл.", value: 2 },
      { label: "Гибкость", value: 5 },
      { label: "Интенс.", value: 2 },
    ],
  },
  {
    id: "berserker",
    name: "Интенсив",
    tagline: "Максимальная нагрузка",
    color: "text-red-500",
    bar: "bg-red-500",
    ring: "ring-red-400",
    borderCls: "border-red-400",
    bgGradient: "from-orange-500 to-red-700",
    cardGradient: "from-red-500/20 to-orange-500/10",
    focus: "Высокоинтенсивные тренировки",
    forWho: "Для тех, кто уже тренируется и хочет взрывной интенсивности",
    description: "Интенсив — для опытных. HIIT, табата, суперсеты. Большой XP за тяжёлые квесты, но штраф за лёгкие. Только для тех, кто готов выкладываться полностью.",
    passive: {
      name: "Перегрузка",
      description: "Огромный бонус за сложные квесты",
      bonus: "+40% XP за сложные, −15% за лёгкие",
    },
    active: {
      name: "Форсаж",
      description: "Следующий квест любой сложности даёт XP как за сложный",
      cooldown: "1 раз в 2 дня",
    },
    evolution: { name: "Элита", level: 10 },
    questTypes: ["HIIT 20 мин", "Табата", "Суперсеты", "Комплексы"],
    stats: [
      { label: "Сила", value: 4 },
      { label: "Выносл.", value: 4 },
      { label: "Гибкость", value: 1 },
      { label: "Интенс.", value: 5 },
    ],
  },
];

interface ClassSelectionProps {
  onSelectClass: (classId: PlayerClass, classInfo: ClassInfo) => void;
  onClose?: () => void;
}

// Мини-бар статов
function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[9px] font-semibold uppercase opacity-40 truncate">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-full rounded-full transition-all duration-300 ${i <= value ? "bg-current opacity-80" : "bg-current opacity-10"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ClassSelection({ onSelectClass, onClose }: ClassSelectionProps) {
  // Если onClose есть — значит это смена класса (не первый вход), сразу на выбор
  const [step, setStep] = useState<"intro" | "select">(onClose ? "select" : "intro");
  const [selectedClass, setSelectedClass] = useState<PlayerClass | null>(null);
  const [expandedClass, setExpandedClass] = useState<PlayerClass | null>(null);
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

  const handleCardClick = (id: PlayerClass) => {
    if (expandedClass === id) {
      // Второй клик на уже раскрытую карточку — выбираем
      setSelectedClass(id);
    } else {
      setExpandedClass(id);
      setSelectedClass(null);
    }
  };

  const handleConfirm = () => {
    if (selectedClass) {
      const info = classes.find((c) => c.id === selectedClass)!;
      onSelectClass(selectedClass, info);
    }
  };

  // ─── ЭКРАН ПРИВЕТСТВИЯ ─────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 overflow-y-auto">
        {/* Декоративные кружки фона */}
        <div className="absolute top-[-80px] right-[-60px] w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-96 h-96 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-12 text-white">
          {/* Логотип */}
          <div className="mb-8 flex flex-col items-center animate-[fadeInDown_0.6s_ease]">
            <div className="w-20 h-20 bg-white/15 border-2 border-white/30 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="18" width="6" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="2" y="20" width="4" height="8" rx="1.5" fill="white"/>
                <rect x="38" y="18" width="6" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="42" y="20" width="4" height="8" rx="1.5" fill="white"/>
                <rect x="10" y="21" width="28" height="6" rx="3" fill="white"/>
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">GymQuest</h1>
            <p className="text-purple-200 mt-1.5 text-sm font-medium">Превратите фитнес в игру</p>
          </div>

          {/* Объяснение концепции */}
          <div className="w-full max-w-sm space-y-3 animate-[fadeInUp_0.7s_ease]">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-sm">RPG-система тренировок</p>
                  <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">Каждый день — новые квесты. Выполняй упражнения, зарабатывай XP и монеты, повышай уровень.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-sm">7 дней — 1 неделя</p>
                  <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">Твой путь разбит на дни. Завершай дни — открывай следующие, дойди до конца недели.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-semibold text-sm">Выбери свой тип</p>
                  <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">Силовик, Кардио, Практик или Интенсив — каждый тип даёт бонусы под свой стиль тренировок.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка */}
          <div className="w-full max-w-sm mt-8 animate-[fadeInUp_0.8s_ease]">
            <button
              onClick={() => setStep("select")}
              className="w-full py-4 bg-white text-purple-700 font-bold rounded-2xl shadow-2xl hover:bg-purple-50 active:scale-95 transition-all text-base"
            >
              Начать игру →
            </button>
            {onClose && (
              <button onClick={onClose} className="w-full mt-3 py-2.5 text-white/50 text-sm hover:text-white/80 transition-colors">
                У меня уже есть аккаунт
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── ЭКРАН ВЫБОРА КЛАССА ───────────────────────────────────────────────────
  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col overflow-y-auto ${modalBg()}`}>
      {/* Шапка */}
      <div className={`flex items-center justify-between px-5 py-4 sticky top-0 z-10 ${modalBg()} border-b border-black/5 dark:border-white/5`}>
        <div>
          <h2 className="text-lg font-bold">Выбор класса</h2>
          <p className="text-xs opacity-40 mt-0.5">Нажми на класс чтобы узнать подробнее</p>
        </div>
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

      <div className="px-4 pt-4 pb-8 space-y-3 max-w-lg mx-auto w-full">

        {classes.map((cls) => {
          const isExpanded = expandedClass === cls.id;
          const isSelected = selectedClass === cls.id;

          return (
            <button
              key={cls.id}
              onClick={() => handleCardClick(cls.id)}
              className={`relative w-full text-left rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                isSelected
                  ? `${cls.borderCls} shadow-lg`
                  : isExpanded
                  ? `${cls.borderCls} opacity-100`
                  : "border-transparent"
              } ${rowBg()}`}
            >
              {/* Цветная полоса слева */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${cls.bar}`} />

              {/* Градиентный фон при раскрытии */}
              {isExpanded && (
                <div className={`absolute inset-0 bg-gradient-to-br ${cls.cardGradient} pointer-events-none`} />
              )}

              <div className="relative pl-5 pr-4 py-4">
                {/* Основная строка */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{cls.name}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${cls.bgGradient} text-white`}>
                          {cls.tagline}
                        </span>
                      </div>
                      <p className="text-xs opacity-50 mt-0.5">{cls.focus}</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 opacity-40 ${isExpanded ? "rotate-180" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Развёрнутый блок */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-black/8 dark:border-white/8 pt-4">

                    {/* Для кого */}
                    <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2.5">
                      <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Подходит для тебя если</p>
                      <p className="text-xs leading-relaxed font-medium">{cls.forWho}</p>
                    </div>

                    {/* Описание */}
                    <p className="text-xs opacity-60 leading-relaxed px-1">{cls.description}</p>

                    {/* Статы */}
                    <div className={`grid grid-cols-4 gap-2 ${cls.color}`}>
                      {cls.stats.map((s) => (
                        <StatBar key={s.label} label={s.label} value={s.value} />
                      ))}
                    </div>

                    {/* Пассивка + активка */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase opacity-40 mb-1">Пассивка</p>
                        <p className="text-xs font-semibold">{cls.passive.name}</p>
                        <p className={`text-[11px] mt-0.5 font-medium ${cls.color}`}>{cls.passive.bonus}</p>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase opacity-40 mb-1">Активное умение</p>
                        <p className="text-xs font-semibold">{cls.active.name}</p>
                        <p className="text-[11px] opacity-50 mt-0.5">{cls.active.cooldown}</p>
                      </div>
                    </div>

                    {/* Примеры квестов */}
                    <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2.5">
                      <p className="text-[9px] font-bold uppercase opacity-40 mb-2">Примеры квестов</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.questTypes.map((q) => (
                          <span key={q} className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-gradient-to-r ${cls.bgGradient} text-white`}>
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Эволюция */}
                    <div className="bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2.5 flex items-center gap-3">
                      <p className="text-[9px] font-bold uppercase opacity-40">Эволюция</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{cls.name}</span>
                        <span className="text-xs opacity-30">→</span>
                        <span className="text-xs font-bold">{cls.evolution.name}</span>
                        <span className="text-[10px] opacity-40">на {cls.evolution.level} ур.</span>
                      </div>
                    </div>

                    {/* Кнопка выбора */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClass(cls.id);
                      }}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isSelected
                          ? `bg-gradient-to-r ${cls.bgGradient} text-white shadow-md`
                          : "bg-black/8 dark:bg-white/10 hover:bg-black/12"
                      }`}
                    >
                      {isSelected ? `✓ Выбрано: ${cls.name}` : `Выбрать ${cls.name}`}
                    </button>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Нижняя кнопка подтверждения */}
        <div className="pt-2 sticky bottom-4">
          <button
            onClick={handleConfirm}
            disabled={!selectedClass}
            className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg ${
              selectedClass
                ? "bg-blue-500 hover:bg-blue-600 active:scale-95 text-white"
                : "bg-black/8 dark:bg-white/8 opacity-40 cursor-not-allowed"
            }`}
          >
            {selectedClass
              ? `Начать как ${classes.find((c) => c.id === selectedClass)?.name} →`
              : "Раскрой класс и выбери его"}
          </button>
          {selectedClass && (
            <p className="text-center text-xs opacity-40 mt-2">Сменить класс позже можно за 500 монет</p>
          )}
        </div>
      </div>
    </div>
  );
}

export { classes };
export type { ClassInfo };
