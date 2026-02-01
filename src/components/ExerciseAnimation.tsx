// src/components/ExerciseAnimation.tsx
// Анимированные демонстрации упражнений без YouTube

import { useEffect, useState } from "react";

type ExerciseType =
  | "pushup"
  | "squat"
  | "plank"
  | "lunge"
  | "jumping-jack"
  | "burpee"
  | "crunch"
  | "mountain-climber"
  | "dumbbell-press"
  | "dumbbell-row"
  | "dumbbell-curl"
  | "dumbbell-shoulder"
  | "deadlift"
  | "bench-press"
  | "pull-up"
  | "dip"
  | "leg-raise"
  | "bicycle"
  | "run"
  | "walk"
  | "stretch"
  | "yoga"
  | "default";

type ExerciseAnimationProps = {
  exerciseType: ExerciseType;
  title?: string;
};

// Маппинг названий упражнений на типы анимаций
export function getExerciseType(title: string): ExerciseType {
  const lowerTitle = title.toLowerCase();
  
  // Отжимания
  if (lowerTitle.includes("отжимания") || lowerTitle.includes("отжимание")) {
    if (lowerTitle.includes("брус")) return "dip";
    return "pushup";
  }
  
  // Приседания
  if (lowerTitle.includes("присед") || lowerTitle.includes("squat")) {
    return "squat";
  }
  
  // Планка
  if (lowerTitle.includes("планка") || lowerTitle.includes("plank")) {
    return "plank";
  }
  
  // Выпады
  if (lowerTitle.includes("выпад") || lowerTitle.includes("lunge")) {
    return "lunge";
  }
  
  // Прыжки
  if (lowerTitle.includes("прыжк") || lowerTitle.includes("jumping")) {
    return "jumping-jack";
  }
  
  // Берпи
  if (lowerTitle.includes("берпи") || lowerTitle.includes("burpee")) {
    return "burpee";
  }
  
  // Скручивания/пресс
  if (lowerTitle.includes("скручивани") || lowerTitle.includes("пресс") || lowerTitle.includes("crunch")) {
    return "crunch";
  }
  
  // Альпинист
  if (lowerTitle.includes("альпинист") || lowerTitle.includes("mountain")) {
    return "mountain-climber";
  }
  
  // Жим гантелей
  if (lowerTitle.includes("жим") && lowerTitle.includes("гантел")) {
    if (lowerTitle.includes("стоя") || lowerTitle.includes("плеч")) {
      return "dumbbell-shoulder";
    }
    return "dumbbell-press";
  }
  
  // Жим штанги
  if (lowerTitle.includes("жим") && lowerTitle.includes("штанг")) {
    return "bench-press";
  }
  
  // Тяга гантели
  if (lowerTitle.includes("тяга") && lowerTitle.includes("гантел")) {
    return "dumbbell-row";
  }
  
  // Становая тяга
  if (lowerTitle.includes("станов") || lowerTitle.includes("deadlift")) {
    return "deadlift";
  }
  
  // Сгибания на бицепс
  if (lowerTitle.includes("сгибани") && (lowerTitle.includes("бицепс") || lowerTitle.includes("рук"))) {
    return "dumbbell-curl";
  }
  
  // Подтягивания
  if (lowerTitle.includes("подтягивани") || lowerTitle.includes("pull")) {
    return "pull-up";
  }
  
  // Брусья
  if (lowerTitle.includes("брус") || lowerTitle.includes("dip")) {
    return "dip";
  }
  
  // Подъем ног
  if (lowerTitle.includes("подъем") && lowerTitle.includes("ног")) {
    return "leg-raise";
  }
  
  // Велосипед
  if (lowerTitle.includes("велосипед") || lowerTitle.includes("велотренажер")) {
    return "bicycle";
  }
  
  // Бег
  if (lowerTitle.includes("бег") || lowerTitle.includes("спринт") || lowerTitle.includes("run")) {
    return "run";
  }
  
  // Ходьба/прогулка
  if (lowerTitle.includes("ходьба") || lowerTitle.includes("прогулка") || lowerTitle.includes("walk")) {
    return "walk";
  }
  
  // Растяжка
  if (lowerTitle.includes("растяжка") || lowerTitle.includes("stretch")) {
    return "stretch";
  }
  
  // Йога
  if (lowerTitle.includes("йога") || lowerTitle.includes("yoga")) {
    return "yoga";
  }
  
  return "default";
}

export function ExerciseAnimation({ exerciseType, title }: ExerciseAnimationProps) {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 2);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const renderAnimation = () => {
    switch (exerciseType) {
      case "pushup":
        return (
          <div className="relative w-32 h-24 mx-auto">
            {/* Тело */}
            <div
              className={`absolute transition-all duration-500 ease-in-out ${
                frame === 0 ? "top-6" : "top-10"
              }`}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            >
              {/* Голова */}
              <div className="w-6 h-6 bg-yellow-400 rounded-full mx-auto mb-1 border-2 border-yellow-500" />
              {/* Туловище */}
              <div
                className={`w-20 h-3 bg-blue-500 rounded transition-all duration-500 ${
                  frame === 0 ? "rotate-0" : "rotate-6"
                }`}
              />
              {/* Руки */}
              <div className="flex justify-between w-24 -mt-2 -ml-2">
                <div
                  className={`w-2 h-6 bg-yellow-400 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-12" : "-rotate-12"
                  }`}
                />
                <div
                  className={`w-2 h-6 bg-yellow-400 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "-rotate-12" : "rotate-12"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "squat":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                frame === 0 ? "top-2" : "top-10"
              }`}
            >
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
              {/* Ноги */}
              <div className="flex justify-center gap-2">
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-0" : "rotate-45"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-0" : "-rotate-45"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "plank":
        return (
          <div className="relative w-40 h-20 mx-auto">
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              {/* Голова */}
              <div className="absolute -left-14 -top-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
              {/* Туловище - горизонтальное */}
              <div
                className={`w-28 h-4 bg-blue-500 rounded transition-all duration-1000 ${
                  frame === 0 ? "rotate-0" : "rotate-1"
                }`}
              />
              {/* Руки - опора */}
              <div className="absolute -left-12 top-2 w-2 h-8 bg-yellow-400 rounded" />
              {/* Ноги - опора */}
              <div className="absolute right-0 top-2 w-2 h-8 bg-blue-600 rounded" />
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
            {/* Пульсация для показа напряжения */}
            <div
              className={`absolute top-6 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full transition-all duration-1000 ${
                frame === 0
                  ? "bg-orange-400/20 scale-100"
                  : "bg-orange-400/40 scale-105"
              }`}
            />
          </div>
        );

      case "lunge":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div
              className={`absolute left-1/2 transition-all duration-500 ${
                frame === 0 ? "-translate-x-1/2 top-2" : "-translate-x-1/3 top-6"
              }`}
            >
              {/* Голова */}
              <div className="w-7 h-7 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
              {/* Ноги */}
              <div className="flex justify-center">
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-0" : "rotate-45"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-0" : "-rotate-30"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "jumping-jack":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-2">
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Руки */}
              <div className="flex justify-center -mt-1">
                <div
                  className={`w-2 h-10 bg-yellow-400 rounded transition-all duration-300 origin-bottom ${
                    frame === 0 ? "rotate-45" : "-rotate-60"
                  }`}
                />
                <div className="w-4 h-10 bg-blue-500 rounded" />
                <div
                  className={`w-2 h-10 bg-yellow-400 rounded transition-all duration-300 origin-bottom ${
                    frame === 0 ? "-rotate-45" : "rotate-60"
                  }`}
                />
              </div>
              {/* Ноги */}
              <div className="flex justify-center">
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "rotate-15" : "-rotate-30"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "-rotate-15" : "rotate-30"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "dumbbell-press":
      case "bench-press":
        return (
          <div className="relative w-40 h-24 mx-auto">
            {/* Скамья */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-3 bg-gray-500 rounded" />
            <div className="absolute bottom-0 left-1/4 w-2 h-4 bg-gray-600 rounded" />
            <div className="absolute bottom-0 right-1/4 w-2 h-4 bg-gray-600 rounded" />
            
            {/* Человек лежа */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              {/* Голова */}
              <div className="absolute -left-14 top-0 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
              {/* Тело */}
              <div className="w-20 h-3 bg-blue-500 rounded" />
              {/* Руки с гантелями */}
              <div
                className={`absolute -left-2 -top-8 flex flex-col items-center transition-all duration-500 ${
                  frame === 0 ? "translate-y-0" : "translate-y-4"
                }`}
              >
                <div className="w-8 h-2 bg-gray-700 rounded" />
                <div className="w-1 h-6 bg-yellow-400 rounded" />
              </div>
              <div
                className={`absolute right-0 -top-8 flex flex-col items-center transition-all duration-500 ${
                  frame === 0 ? "translate-y-0" : "translate-y-4"
                }`}
              >
                <div className="w-8 h-2 bg-gray-700 rounded" />
                <div className="w-1 h-6 bg-yellow-400 rounded" />
              </div>
            </div>
          </div>
        );

      case "dumbbell-row":
        return (
          <div className="relative w-36 h-28 mx-auto">
            {/* Скамья */}
            <div className="absolute bottom-4 left-4 w-20 h-2 bg-gray-500 rounded" />
            
            {/* Человек в наклоне */}
            <div className="absolute bottom-6 left-8">
              {/* Голова */}
              <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
              {/* Туловище наклонено */}
              <div className="w-16 h-3 bg-blue-500 rounded rotate-30 origin-left" />
              {/* Опорная рука */}
              <div className="absolute left-2 top-6 w-2 h-8 bg-yellow-400 rounded" />
              {/* Рабочая рука с гантелью */}
              <div
                className={`absolute right-0 top-4 transition-all duration-500 ${
                  frame === 0 ? "translate-y-4" : "translate-y-0"
                }`}
              >
                <div className="w-2 h-8 bg-yellow-400 rounded" />
                <div className="w-6 h-2 bg-gray-700 rounded -ml-2" />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "dumbbell-curl":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-2">
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-12 bg-blue-500 rounded mx-auto" />
              {/* Руки с гантелями */}
              <div className="absolute top-8 -left-6 flex items-end">
                <div className="w-5 h-2 bg-gray-700 rounded" />
                <div
                  className={`w-2 h-8 bg-yellow-400 rounded transition-all duration-500 origin-bottom ${
                    frame === 0 ? "rotate-0" : "-rotate-120"
                  }`}
                />
              </div>
              <div className="absolute top-8 -right-6 flex items-end">
                <div
                  className={`w-2 h-8 bg-yellow-400 rounded transition-all duration-500 origin-bottom ${
                    frame === 0 ? "rotate-0" : "rotate-120"
                  }`}
                />
                <div className="w-5 h-2 bg-gray-700 rounded" />
              </div>
              {/* Ноги */}
              <div className="flex justify-center gap-1">
                <div className="w-3 h-10 bg-blue-600 rounded" />
                <div className="w-3 h-10 bg-blue-600 rounded" />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "dumbbell-shoulder":
        return (
          <div className="relative w-32 h-36 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-2">
              {/* Гантели сверху */}
              <div
                className={`flex justify-center gap-8 transition-all duration-500 ${
                  frame === 0 ? "-translate-y-0" : "-translate-y-6"
                }`}
              >
                <div className="w-6 h-2 bg-gray-700 rounded" />
                <div className="w-6 h-2 bg-gray-700 rounded" />
              </div>
              {/* Руки */}
              <div
                className={`flex justify-center gap-4 transition-all duration-500 ${
                  frame === 0 ? "h-4" : "h-10"
                }`}
              >
                <div className="w-2 bg-yellow-400 rounded h-full" />
                <div className="w-2 bg-yellow-400 rounded h-full" />
              </div>
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
              {/* Ноги */}
              <div className="flex justify-center gap-1">
                <div className="w-3 h-10 bg-blue-600 rounded" />
                <div className="w-3 h-10 bg-blue-600 rounded" />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "pull-up":
        return (
          <div className="relative w-32 h-36 mx-auto">
            {/* Турник */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-2 bg-gray-600 rounded" />
            <div className="absolute top-2 left-2 w-2 h-4 bg-gray-700 rounded" />
            <div className="absolute top-2 right-2 w-2 h-4 bg-gray-700 rounded" />
            
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                frame === 0 ? "top-4" : "top-10"
              }`}
            >
              {/* Руки на турнике */}
              <div className="flex justify-center gap-6 mb-1">
                <div className="w-2 h-4 bg-yellow-400 rounded" />
                <div className="w-2 h-4 bg-yellow-400 rounded" />
              </div>
              {/* Голова */}
              <div className="w-7 h-7 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
              {/* Ноги */}
              <div className="flex justify-center gap-1">
                <div className="w-3 h-8 bg-blue-600 rounded" />
                <div className="w-3 h-8 bg-blue-600 rounded" />
              </div>
            </div>
          </div>
        );

      case "deadlift":
        return (
          <div className="relative w-36 h-32 mx-auto">
            {/* Штанга */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                frame === 0 ? "bottom-2" : "bottom-12"
              }`}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-800 rounded-full" />
                <div className="w-20 h-2 bg-gray-600 rounded" />
                <div className="w-4 h-4 bg-gray-800 rounded-full" />
              </div>
            </div>
            
            {/* Человек */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                frame === 0 ? "top-8" : "top-2"
              }`}
            >
              {/* Голова */}
              <div className="w-7 h-7 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div
                className={`w-4 h-10 bg-blue-500 rounded mx-auto transition-all duration-500 origin-bottom ${
                  frame === 0 ? "rotate-45" : "rotate-0"
                }`}
              />
              {/* Ноги */}
              <div
                className={`flex justify-center gap-2 transition-all duration-500 ${
                  frame === 0 ? "-mt-4" : "mt-0"
                }`}
              >
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-30" : "rotate-0"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "-rotate-30" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "run":
        return (
          <div className="relative w-32 h-32 mx-auto overflow-hidden">
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-4 transition-all duration-300 ${
                frame === 0 ? "translate-y-0" : "-translate-y-2"
              }`}
            >
              {/* Голова */}
              <div className="w-7 h-7 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище наклон вперед */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto rotate-12" />
              {/* Руки в движении */}
              <div className="absolute top-8 -left-4">
                <div
                  className={`w-2 h-8 bg-yellow-400 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "rotate-45" : "-rotate-45"
                  }`}
                />
              </div>
              <div className="absolute top-8 right-0">
                <div
                  className={`w-2 h-8 bg-yellow-400 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "-rotate-45" : "rotate-45"
                  }`}
                />
              </div>
              {/* Ноги в движении */}
              <div className="flex justify-center">
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "rotate-45" : "-rotate-30"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-300 origin-top ${
                    frame === 0 ? "-rotate-30" : "rotate-45"
                  }`}
                />
              </div>
            </div>
            {/* Линии скорости */}
            <div
              className={`absolute top-12 transition-all duration-300 ${
                frame === 0 ? "left-2 opacity-100" : "left-0 opacity-0"
              }`}
            >
              <div className="w-6 h-0.5 bg-gray-400 rounded mb-2" />
              <div className="w-4 h-0.5 bg-gray-400 rounded mb-2" />
              <div className="w-5 h-0.5 bg-gray-400 rounded" />
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "walk":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-4">
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
              {/* Руки */}
              <div className="absolute top-10 -left-2">
                <div
                  className={`w-2 h-7 bg-yellow-400 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-20" : "-rotate-20"
                  }`}
                />
              </div>
              <div className="absolute top-10 right-0">
                <div
                  className={`w-2 h-7 bg-yellow-400 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "-rotate-20" : "rotate-20"
                  }`}
                />
              </div>
              {/* Ноги */}
              <div className="flex justify-center">
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "rotate-15" : "-rotate-15"
                  }`}
                />
                <div
                  className={`w-3 h-10 bg-blue-600 rounded transition-all duration-500 origin-top ${
                    frame === 0 ? "-rotate-15" : "rotate-15"
                  }`}
                />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "bicycle":
        return (
          <div className="relative w-40 h-32 mx-auto">
            {/* Велосипед - колеса */}
            <div className="absolute bottom-4 left-4 w-10 h-10 border-4 border-gray-600 rounded-full" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-4 border-gray-600 rounded-full" />
            {/* Рама */}
            <div className="absolute bottom-8 left-8 w-16 h-1 bg-gray-500 rotate-12" />
            <div className="absolute bottom-12 left-12 w-8 h-1 bg-gray-500 -rotate-45" />
            
            {/* Человек на велосипеде */}
            <div className="absolute bottom-14 left-14">
              {/* Голова */}
              <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
              {/* Тело */}
              <div className="w-3 h-6 bg-blue-500 rounded rotate-20 -ml-1" />
              {/* Ноги крутят педали */}
              <div
                className={`absolute top-8 left-0 w-2 h-6 bg-blue-600 rounded transition-all duration-300 origin-top ${
                  frame === 0 ? "rotate-45" : "-rotate-45"
                }`}
              />
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "stretch":
      case "yoga":
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-4">
              {/* Голова */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Руки вверх */}
              <div
                className={`flex justify-center transition-all duration-700 ${
                  frame === 0 ? "gap-8" : "gap-2"
                }`}
              >
                <div
                  className={`w-2 h-10 bg-yellow-400 rounded transition-all duration-700 ${
                    frame === 0 ? "-rotate-30" : "rotate-0"
                  }`}
                />
                <div
                  className={`w-2 h-10 bg-yellow-400 rounded transition-all duration-700 ${
                    frame === 0 ? "rotate-30" : "rotate-0"
                  }`}
                />
              </div>
              {/* Туловище */}
              <div className="w-4 h-10 bg-blue-500 rounded mx-auto -mt-8" />
              {/* Ноги */}
              <div className="flex justify-center gap-1">
                <div className="w-3 h-10 bg-blue-600 rounded" />
                <div className="w-3 h-10 bg-blue-600 rounded" />
              </div>
            </div>
            {/* Аура спокойствия */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${
                frame === 0
                  ? "w-24 h-24 bg-purple-400/10"
                  : "w-28 h-28 bg-purple-400/20"
              }`}
            />
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "crunch":
      case "leg-raise":
        return (
          <div className="relative w-36 h-24 mx-auto">
            {/* Коврик */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 bg-purple-400 rounded" />
            
            {/* Человек лежа делает скручивания */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              {/* Ноги */}
              <div
                className={`absolute right-0 top-0 flex gap-1 transition-all duration-500 origin-left ${
                  frame === 0 ? "rotate-0" : "rotate-45"
                }`}
              >
                <div className="w-12 h-3 bg-blue-600 rounded" />
              </div>
              {/* Туловище */}
              <div
                className={`w-12 h-3 bg-blue-500 rounded transition-all duration-500 origin-right ${
                  frame === 0 ? "rotate-0" : "-rotate-30"
                }`}
              />
              {/* Голова */}
              <div
                className={`absolute -left-6 transition-all duration-500 ${
                  frame === 0 ? "top-0" : "-top-4"
                }`}
              >
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
              </div>
            </div>
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      case "dip":
        return (
          <div className="relative w-36 h-32 mx-auto">
            {/* Брусья */}
            <div className="absolute top-8 left-2 w-2 h-20 bg-gray-600 rounded" />
            <div className="absolute top-8 right-2 w-2 h-20 bg-gray-600 rounded" />
            <div className="absolute top-8 left-2 w-8 h-2 bg-gray-500 rounded" />
            <div className="absolute top-8 right-2 w-8 h-2 bg-gray-500 rounded -ml-6" />
            
            {/* Человек на брусьях */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                frame === 0 ? "top-4" : "top-10"
              }`}
            >
              {/* Голова */}
              <div className="w-6 h-6 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
              {/* Руки на брусьях */}
              <div className="flex justify-between w-20 -ml-4">
                <div
                  className={`w-2 h-6 bg-yellow-400 rounded transition-all duration-500 ${
                    frame === 0 ? "h-4" : "h-8"
                  }`}
                />
                <div className="w-3 h-8 bg-blue-500 rounded" />
                <div
                  className={`w-2 h-6 bg-yellow-400 rounded transition-all duration-500 ${
                    frame === 0 ? "h-4" : "h-8"
                  }`}
                />
              </div>
              {/* Ноги */}
              <div className="flex justify-center gap-1">
                <div className="w-2 h-8 bg-blue-600 rounded" />
                <div className="w-2 h-8 bg-blue-600 rounded" />
              </div>
            </div>
          </div>
        );

      case "burpee":
      case "mountain-climber":
        return (
          <div className="relative w-36 h-28 mx-auto">
            {frame === 0 ? (
              // Позиция стоя
              <div className="absolute left-1/2 -translate-x-1/2 top-2">
                <div className="w-7 h-7 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500" />
                <div className="w-4 h-10 bg-blue-500 rounded mx-auto" />
                <div className="flex justify-center gap-1">
                  <div className="w-3 h-8 bg-blue-600 rounded" />
                  <div className="w-3 h-8 bg-blue-600 rounded" />
                </div>
              </div>
            ) : (
              // Позиция планки/прыжка
              <div className="absolute left-1/2 -translate-x-1/2 top-10">
                <div className="absolute -left-12 -top-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-500" />
                <div className="w-24 h-3 bg-blue-500 rounded" />
                <div className="absolute -left-10 top-2 w-2 h-6 bg-yellow-400 rounded" />
                <div className="absolute right-0 top-2 w-2 h-6 bg-blue-600 rounded" />
              </div>
            )}
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );

      default:
        return (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-4">
              {/* Дефолтная фигурка */}
              <div className="w-10 h-10 bg-yellow-400 rounded-full mx-auto border-2 border-yellow-500 flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
              <div className="w-4 h-12 bg-blue-500 rounded mx-auto" />
              <div className="flex justify-center gap-2">
                <div className="w-3 h-10 bg-blue-600 rounded" />
                <div className="w-3 h-10 bg-blue-600 rounded" />
              </div>
            </div>
            {/* Пульсация */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                frame === 0
                  ? "w-20 h-20 bg-green-400/20"
                  : "w-24 h-24 bg-green-400/30"
              }`}
            />
            {/* Пол */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-600 rounded" />
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
      <div className="text-center mb-2 text-sm text-gray-400">Как делать:</div>
      <div className="min-h-[120px] flex items-center justify-center">
        {renderAnimation()}
      </div>
      {title && (
        <div className="text-center mt-2 text-xs text-gray-500">{title}</div>
      )}
    </div>
  );
}

export default ExerciseAnimation;
