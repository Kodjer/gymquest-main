// src/components/OnboardingQuestionnaire.tsx
import { useState } from "react";
import { OnboardingData } from "../lib/usePlayer";
import { ThemedInput } from "./ThemedInput";

type OnboardingQuestionnaireProps = {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  mode?: 'full' | 'edit-program'; // Новый пропс
};

export function OnboardingQuestionnaire({ onComplete, onSkip, mode = 'full' }: OnboardingQuestionnaireProps) {
  const [step, setStep] = useState(mode === 'edit-program' ? 2 : 1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    howDidYouHear: mode === 'edit-program' ? "Редактирование программы" : "",
    age: 0,
    weight: 0,
    height: 0,
    fitnessExperience: "",
    availableTime: "",
    workoutPreference: [],
    fitnessGoals: [],
    injuries: "",
    dietPreference: "",
  });

  const totalSteps = mode === 'edit-program' ? 4 : 5;

  const updateField = (field: keyof OnboardingData, value: any) => {
    setFormData((prev: Partial<OnboardingData>) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: "workoutPreference" | "fitnessGoals", value: string) => {
    setFormData((prev: Partial<OnboardingData>) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > (mode === 'edit-program' ? 2 : 1)) setStep(step - 1);
  };

  const handleSubmit = () => {
    const completeData: OnboardingData = {
      howDidYouHear: formData.howDidYouHear || "Не указано",
      age: formData.age || 0,
      weight: formData.weight || 0,
      height: formData.height || 0,
      fitnessExperience: formData.fitnessExperience || "начинающий",
      availableTime: formData.availableTime || "30 мин",
      workoutPreference: formData.workoutPreference || [],
      fitnessGoals: formData.fitnessGoals || [],
      injuries: formData.injuries || "Нет",
      dietPreference: formData.dietPreference || "Обычное питание",
      completedAt: Date.now(),
    };
    onComplete(completeData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return mode === 'edit-program' ? true : (formData.howDidYouHear && formData.howDidYouHear.trim() !== "");
      case 2:
        return (formData.age || 0) > 0 && (formData.weight || 0) > 0 && (formData.height || 0) > 0;
      case 3:
        return formData.fitnessExperience && formData.availableTime;
      case 4:
        return (formData.workoutPreference?.length || 0) > 0 && (formData.fitnessGoals?.length || 0) > 0;
      case 5:
        return true; // Последний шаг необязательный
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Заголовок */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {mode === 'edit-program' ? 'Изменить программу тренировок 🏋️' : 'Добро пожаловать в GymQuest! 🏋️'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === 'edit-program' 
                ? 'Обновите свои параметры и предпочтения для персонализации квестов'
                : 'Давайте узнаем о вас больше, чтобы персонализировать ваш опыт'
              }
            </p>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i + 1 <= step
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Шаг {step} из {totalSteps}
            </p>
          </div>

          {/* Шаг 1: Как узнали о приложении - пропускаем в режиме редактирования */}
          {step === 1 && mode === 'full' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Как вы узнали о GymQuest?</h3>
              <div className="space-y-3">
                {[
                  "Поиск в интернете",
                  "Социальные сети",
                  "Рекомендация друга",
                  "Реклама",
                  "Блог/статья",
                  "Другое",
                ].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="howDidYouHear"
                      value={option}
                      checked={formData.howDidYouHear === option}
                      onChange={(e) => updateField("howDidYouHear", e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {formData.howDidYouHear === "Другое" && (
                <ThemedInput
                  placeholder="Укажите подробнее..."
                  value={formData.howDidYouHear === "Другое" ? "" : formData.howDidYouHear || ""}
                  onChange={(e) => updateField("howDidYouHear", e.target.value)}
                />
              )}
            </div>
          )}

          {/* Шаг 2: Физические параметры */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ваши физические параметры</h3>
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 font-medium">Возраст (лет)</label>
                  <ThemedInput
                    type="number"
                    placeholder="Например: 25"
                    value={formData.age || ""}
                    onChange={(e) => updateField("age", Number(e.target.value))}
                    min="10"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Вес (кг)</label>
                  <ThemedInput
                    type="number"
                    placeholder="Например: 70"
                    value={formData.weight || ""}
                    onChange={(e) => updateField("weight", Number(e.target.value))}
                    min="30"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Рост (см)</label>
                  <ThemedInput
                    type="number"
                    placeholder="Например: 175"
                    value={formData.height || ""}
                    onChange={(e) => updateField("height", Number(e.target.value))}
                    min="100"
                    max="250"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Шаг 3: Опыт и время */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Опыт тренировок</h3>
              
              <div>
                <label className="block mb-2 font-medium">Уровень опыта</label>
                <div className="space-y-2">
                  {[
                    { value: "начинающий", label: "Начинающий (менее 6 месяцев)" },
                    { value: "средний", label: "Средний (6 месяцев - 2 года)" },
                    { value: "продвинутый", label: "Продвинутый (более 2 лет)" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fitnessExperience"
                        value={option.value}
                        checked={formData.fitnessExperience === option.value}
                        onChange={(e) => updateField("fitnessExperience", e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Доступное время для тренировок в день</label>
                <div className="space-y-2">
                  {[
                    "15-30 минут",
                    "30-60 минут",
                    "1-2 часа",
                    "Более 2 часов",
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availableTime"
                        value={option}
                        checked={formData.availableTime === option}
                        onChange={(e) => updateField("availableTime", e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Шаг 4: Предпочтения и цели */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Ваши предпочтения и цели</h3>
              
              <div>
                <label className="block mb-2 font-medium">
                  Предпочитаемые виды тренировок (можно выбрать несколько)
                </label>
                <div className="space-y-2">
                  {[
                    "Силовые тренировки",
                    "Кардио",
                    "Йога/Растяжка",
                    "Кроссфит",
                    "Плавание",
                    "Бег",
                    "Групповые занятия",
                    "Домашние тренировки",
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.workoutPreference?.includes(option)}
                        onChange={() => toggleArrayValue("workoutPreference", option)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Ваши фитнес-цели (можно выбрать несколько)
                </label>
                <div className="space-y-2">
                  {[
                    "Похудение",
                    "Набор мышечной массы",
                    "Улучшение выносливости",
                    "Поддержание здоровья",
                    "Улучшение гибкости",
                    "Подготовка к соревнованиям",
                    "Реабилитация",
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.fitnessGoals?.includes(option)}
                        onChange={() => toggleArrayValue("fitnessGoals", option)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Шаг 5: Дополнительная информация */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Дополнительная информация</h3>
              
              <div>
                <label className="block mb-2 font-medium">
                  Травмы или ограничения (необязательно)
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
                  placeholder="Опишите любые травмы, боли или ограничения, которые мы должны учитывать..."
                  value={formData.injuries || ""}
                  onChange={(e) => updateField("injuries", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Предпочтения в питании
                </label>
                <div className="space-y-2">
                  {[
                    "Обычное питание",
                    "Вегетарианство",
                    "Веганство",
                    "Безглютеновая диета",
                    "Кето-диета",
                    "Другое",
                  ].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="dietPreference"
                        value={option}
                        checked={formData.dietPreference === option}
                        onChange={(e) => updateField("dietPreference", e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Кнопки навигации */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t dark:border-gray-700">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                >
                  ← Назад
                </button>
              )}
              {onSkip && step === 1 && (
                <button
                  onClick={onSkip}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Пропустить опрос
                </button>
              )}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isStepValid()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {step === totalSteps ? "Завершить" : "Далее →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
