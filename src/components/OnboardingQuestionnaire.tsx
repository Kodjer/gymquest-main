// src/components/OnboardingQuestionnaire.tsx
import { useState, useEffect } from "react";
import { OnboardingData } from "../lib/usePlayer";

type OnboardingQuestionnaireProps = {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  mode?: "full" | "edit-program";
};

const TOTAL_STEPS = 5;

const STEPS_META = [
  { title: "Какова твоя\nглавная цель?", subtitle: "Выбери одно — это определит твою программу" },
  { title: "Немного\nо тебе", subtitle: "Данные нужны для персональной нагрузки" },
  { title: "Твой уровень\nподготовки?", subtitle: "Отвечай честно — это только помогает" },
  { title: "Сколько времени\nна тренировку?", subtitle: "В среднем за одну сессию" },
  { title: "Где будешь\nтренироваться?", subtitle: "Выбери основное место" },
];

const GOALS = [
  { value: "Похудение", label: "Сбросить вес", desc: "Сжигать жир и стать стройнее" },
  { value: "Набор мышечной массы", label: "Набрать мышцы", desc: "Стать сильнее и объёмнее" },
  { value: "Улучшение выносливости", label: "Выносливость", desc: "Бегать дальше, дышать легче" },
  { value: "Поддержание здоровья", label: "Здоровый образ жизни", desc: "Поддерживать форму и энергию" },
];

const EXPERIENCE_LEVELS = [
  { value: "начинающий", label: "Новичок", desc: "Почти не тренировался раньше" },
  { value: "средний", label: "Любитель", desc: "Есть базовый опыт, тренируюсь иногда" },
  { value: "продвинутый", label: "Опытный", desc: "Тренируюсь регулярно 1+ лет" },
];

const TIMINGS = [
  { value: "15-30 минут", label: "15–30 минут", desc: "Коротко, но по делу" },
  { value: "30-60 минут", label: "30–60 минут", desc: "Стандартная тренировка" },
  { value: "1-2 часа", label: "1–2 часа", desc: "Полноценная сессия" },
  { value: "Более 2 часов", label: "2+ часа", desc: "Профессиональный уровень" },
];

const LOCATIONS = [
  { value: "Домашние тренировки", label: "Дома", desc: "Без оборудования, в любое время" },
  { value: "Силовые тренировки", label: "В зале", desc: "Тренажёры и свободные веса" },
  { value: "Кардио", label: "На улице / в парке", desc: "Бег, велосипед, свежий воздух" },
];

type OptionCardProps = {
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
};

function OptionCard({ label, desc, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${
        selected
          ? "border-white bg-white/20 shadow-lg shadow-white/10"
          : "border-white/20 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-base leading-tight ${selected ? "text-white" : "text-white/90"}`}>
          {label}
        </p>
        <p className={`text-sm mt-0.5 ${selected ? "text-white/80" : "text-white/50"}`}>{desc}</p>
      </div>
      <div
        className={`flex-none w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          selected ? "border-white bg-white" : "border-white/30"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
      </div>
    </button>
  );
}

type NumberInputProps = {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  placeholder: string;
};

function NumberInput({ label, unit, value, onChange, min, max, placeholder }: NumberInputProps) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
      <p className="text-white/60 text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-white text-3xl font-bold outline-none placeholder-white/25 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-white/50 text-lg font-medium flex-none">{unit}</span>
      </div>
    </div>
  );
}

export function OnboardingQuestionnaire({ onComplete, onSkip, mode = "full" }: OnboardingQuestionnaireProps) {
  const [step, setStep] = useState(1);

  // Step 1 — goal
  const [goal, setGoal] = useState("");
  // Step 2 — body stats
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  // Step 3 — experience
  const [experience, setExperience] = useState("");
  // Step 4 — time
  const [time, setTime] = useState("");
  // Step 5 — location
  const [location, setLocation] = useState("");

  const isStepValid = () => {
    switch (step) {
      case 1:
        return goal !== "";
      case 2: {
        const a = Number(age);
        const w = Number(weight);
        const h = Number(height);
        return age !== "" && weight !== "" && height !== "" &&
          a >= 10 && a <= 100 && w >= 20 && w <= 400 && h >= 50 && h <= 280;
      }
      case 3:
        return experience !== "";
      case 4:
        return time !== "";
      case 5:
        return location !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      const data: OnboardingData = {
        howDidYouHear: "Приложение",
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        fitnessExperience: experience,
        availableTime: time,
        workoutPreference: [location],
        fitnessGoals: [goal],
        injuries: "Нет",
        dietPreference: "Обычное питание",
        completedAt: Date.now(),
      };
      onComplete(data);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const meta = STEPS_META[step - 1];

  // Блокируем скролл страницы пока открыт опросник
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 overflow-hidden">
      {/* Top bar */}
      <div className="flex-none px-5 pt-12 pb-2">
        {/* Step progress dots */}
        <div className="flex gap-2 mb-5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-white" : "bg-white/25"
              }`}
            />
          ))}
        </div>

        {/* Back button */}
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors mb-4 text-sm"
          >
            <span className="text-lg leading-none">←</span> Назад
          </button>
        )}

        <p className="text-white/55 text-sm leading-snug">{meta.subtitle}</p>
        <h1 className="text-white text-[28px] font-extrabold mt-1 leading-tight whitespace-pre-line">
          {meta.title}
        </h1>
      </div>

      {/* Scrollable options */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Step 1 — Goal */}
        {step === 1 && GOALS.map((g) => (
          <OptionCard
            key={g.value}
            label={g.label}
            desc={g.desc}
            selected={goal === g.value}
            onClick={() => setGoal(g.value)}
          />
        ))}

        {/* Step 2 — Body stats */}
        {step === 2 && (
          <div className="space-y-3">
            <NumberInput label="Возраст" unit="лет" value={age} onChange={setAge} min={10} max={100} placeholder="25" />
            <NumberInput label="Вес" unit="кг" value={weight} onChange={setWeight} min={20} max={400} placeholder="70" />
            <NumberInput label="Рост" unit="см" value={height} onChange={setHeight} min={50} max={280} placeholder="175" />
          </div>
        )}

        {/* Step 3 — Experience */}
        {step === 3 && EXPERIENCE_LEVELS.map((e) => (
          <OptionCard
            key={e.value}
            label={e.label}
            desc={e.desc}
            selected={experience === e.value}
            onClick={() => setExperience(e.value)}
          />
        ))}

        {/* Step 4 — Time */}
        {step === 4 && TIMINGS.map((t) => (
          <OptionCard
            key={t.value}
            label={t.label}
            desc={t.desc}
            selected={time === t.value}
            onClick={() => setTime(t.value)}
          />
        ))}

        {/* Step 5 — Location */}
        {step === 5 && LOCATIONS.map((l) => (
          <OptionCard
            key={l.value}
            label={l.label}
            desc={l.desc}
            selected={location === l.value}
            onClick={() => setLocation(l.value)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex-none px-5 pb-10 pt-3">
        {onSkip && step === 1 && (
          <button
            onClick={onSkip}
            className="w-full text-center text-white/40 text-sm mb-3 py-1 hover:text-white/60 transition-colors"
          >
            Пропустить опрос
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-200 ${
            isStepValid()
              ? "bg-white text-purple-800 hover:bg-white/90 active:scale-[0.98] shadow-xl shadow-black/30"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          }`}
        >
          {step < TOTAL_STEPS ? "Продолжить →" : "Начать тренировки"}
        </button>
      </div>
    </div>
  );
}
