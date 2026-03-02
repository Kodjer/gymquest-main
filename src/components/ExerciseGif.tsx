// src/components/ExerciseGif.tsx
// Гифки упражнений - локальные файлы

import { useState } from "react";

type ExerciseGifProps = {
  title: string;
};

// Единый стиль GIF для всех упражнений (только реально работающие файлы)
const exerciseGifs: Record<string, string> = {
  // Силовые базовые
  "отжимания": "/gifs/pushup.gif",
  "приседания": "/gifs/squat.gif",
  "планка": "/gifs/plank.gif",
  "выпады": "/gifs/lunge.gif",
  "скалолаз": "/gifs/mountain_climber.gif",
  
  // Силовые с весом
  "жим": "/gifs/bench_press.gif",
  "становая": "/gifs/deadlift.gif",
  "плечи": "/gifs/shoulder_press.gif",
  "бицепс": "/gifs/bicep_curl.gif",
  "трицепс": "/gifs/tricep.gif",
  "подтягивания": "/gifs/pullup.gif",
  "брусья": "/gifs/dips.gif",
  "тяга_верхняя": "/gifs/lat_pulldown.gif",
  "тяга_нижняя": "/gifs/cable_row.gif",
  "разгибания_ног": "/gifs/leg_extension.gif",
};

// Поиск гифки по названию
function findGif(title: string): string | null {
  const t = title.toLowerCase();
  
  // Базовые силовые упражнения
  if (t.includes("присед")) return exerciseGifs["приседания"];
  if (t.includes("отжиман")) return exerciseGifs["отжимания"];
  if (t.includes("планк")) return exerciseGifs["планка"];
  if (t.includes("выпад")) return exerciseGifs["выпады"];
  if (t.includes("скалолаз") || t.includes("альпинист")) return exerciseGifs["скалолаз"];
  
  // Силовые с весом
  if (t.includes("жим") && (t.includes("лёжа") || t.includes("лежа"))) return exerciseGifs["жим"];
  if (t.includes("жим") && (t.includes("стоя") || t.includes("сидя") || t.includes("над головой") || t.includes("армейский") || t.includes("плеч"))) return exerciseGifs["плечи"];
  if (t.includes("становая") || t.includes("румынская")) return exerciseGifs["становая"];
  if (t.includes("сгибан") && t.includes("рук")) return exerciseGifs["бицепс"];
  if (t.includes("молотков")) return exerciseGifs["бицепс"];
  if (t.includes("бицепс")) return exerciseGifs["бицепс"];
  if (t.includes("разгибан") && t.includes("рук")) return exerciseGifs["трицепс"];
  if (t.includes("отведен") && t.includes("назад")) return exerciseGifs["трицепс"];
  if (t.includes("трицепс")) return exerciseGifs["трицепс"];
  if (t.includes("подъём") && t.includes("сторон")) return exerciseGifs["плечи"];
  if (t.includes("подъем") && t.includes("сторон")) return exerciseGifs["плечи"];
  if (t.includes("разведен") && (t.includes("лёжа") || t.includes("лежа"))) return exerciseGifs["жим"];
  if (t.includes("шраг")) return exerciseGifs["становая"];
  if (t.includes("подтягиван")) return exerciseGifs["подтягивания"];
  if (t.includes("брусья") || t.includes("брусь") || t.includes("dips")) return exerciseGifs["брусья"];
  if (t.includes("гиперэкстенз") || t.includes("экстенз")) return exerciseGifs["становая"];
  
  // Тренажёры
  if (t.includes("тяга") && (t.includes("верхн") || t.includes("блок"))) return exerciseGifs["тяга_верхняя"];
  if (t.includes("тяга") && t.includes("наклон")) return exerciseGifs["тяга_нижняя"];
  if (t.includes("сведен") && t.includes("рук")) return exerciseGifs["жим"];
  if (t.includes("разгибан") && t.includes("ног")) return exerciseGifs["разгибания_ног"];
  if (t.includes("тяга")) return exerciseGifs["тяга_нижняя"];
  if (t.includes("жим")) return exerciseGifs["жим"];
  
  // Для остальных упражнений (кардио, йога, растяжка) - нет GIF
  return null;
}

export function ExerciseGif({ title }: ExerciseGifProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const gifUrl = findGif(title);
  
  if (!gifUrl || error) {
    return null;
  }
  
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
      <div className="relative bg-gray-900 flex items-center justify-center" style={{ minHeight: loading ? "150px" : "auto" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}
        <img
          src={gifUrl}
          alt={title}
          className={`w-full max-w-sm h-auto object-contain mx-auto ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </div>
    </div>
  );
}
