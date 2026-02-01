// src/components/ExerciseDemo.tsx
// Встроенные SVG-анимации упражнений

import { useEffect, useState } from "react";

type ExerciseDemoProps = {
  title: string;
};

// Определяем тип упражнения по названию
function getExerciseType(title: string): string {
  const t = title.toLowerCase();
  
  if (t.includes("отжимания") || t.includes("отжимание")) {
    if (t.includes("брус")) return "dip";
    if (t.includes("узк")) return "pushup-narrow";
    if (t.includes("широк")) return "pushup-wide";
    return "pushup";
  }
  if (t.includes("присед")) return "squat";
  if (t.includes("планка")) {
    if (t.includes("боков")) return "side-plank";
    return "plank";
  }
  if (t.includes("выпад")) return "lunge";
  if (t.includes("берпи")) return "burpee";
  if (t.includes("прыжк") || t.includes("jumping")) return "jumping-jack";
  if (t.includes("скручивани") || t.includes("пресс")) return "crunch";
  if (t.includes("альпинист")) return "mountain-climber";
  if (t.includes("подтягив")) return "pullup";
  if (t.includes("жим") && t.includes("лежа")) return "bench-press";
  if (t.includes("жим") && (t.includes("стоя") || t.includes("плеч"))) return "shoulder-press";
  if (t.includes("тяга") && t.includes("наклон")) return "row";
  if (t.includes("станов")) return "deadlift";
  if (t.includes("сгибани") && t.includes("рук")) return "bicep-curl";
  if (t.includes("подъем") && t.includes("ног")) return "leg-raise";
  if (t.includes("велосипед") && !t.includes("тренажер")) return "bicycle-crunch";
  if (t.includes("бег") || t.includes("дорожк")) return "run";
  if (t.includes("ходьб") || t.includes("прогулк")) return "walk";
  if (t.includes("растяж") || t.includes("йога")) return "stretch";
  if (t.includes("гиперэкстензия") || t.includes("гипер")) return "hyperextension";
  if (t.includes("шраг")) return "shrug";
  if (t.includes("велотренажер") || t.includes("вело")) return "bike";
  if (t.includes("эллипс")) return "elliptical";
  if (t.includes("гребн") || t.includes("гребля")) return "rowing";
  if (t.includes("степпер") || t.includes("лестниц")) return "stepper";
  
  return "default";
}

// Данные упражнений
const exerciseInfo: Record<string, { tip: string; muscles: string }> = {
  "pushup": { tip: "Тело прямое, опускайтесь грудью к полу", muscles: "Грудь, трицепс" },
  "pushup-narrow": { tip: "Руки близко - акцент на трицепс", muscles: "Трицепс, грудь" },
  "pushup-wide": { tip: "Руки широко - акцент на грудь", muscles: "Грудь, плечи" },
  "squat": { tip: "Колени не за носки, спина прямая", muscles: "Ноги, ягодицы" },
  "plank": { tip: "Тело как струна, не провисать", muscles: "Кор, пресс" },
  "side-plank": { tip: "Бедра не провисают, тело прямое", muscles: "Косые мышцы" },
  "lunge": { tip: "Колено 90 градусов, корпус прямо", muscles: "Ноги, ягодицы" },
  "burpee": { tip: "Упор лежа - прыжок - руки вверх", muscles: "Всё тело" },
  "jumping-jack": { tip: "Ноги врозь + руки вверх, вместе + вниз", muscles: "Кардио" },
  "crunch": { tip: "Поясница на полу, не тяните шею", muscles: "Пресс" },
  "mountain-climber": { tip: "Быстро меняйте ноги, таз не поднимать", muscles: "Кор, кардио" },
  "pullup": { tip: "Подбородок выше перекладины", muscles: "Спина, бицепс" },
  "bench-press": { tip: "Лопатки сведены, локти 45 градусов", muscles: "Грудь, трицепс" },
  "shoulder-press": { tip: "Не прогибайте поясницу", muscles: "Плечи" },
  "row": { tip: "Спина параллельна полу, тяните к поясу", muscles: "Спина" },
  "deadlift": { tip: "Спина прямая, штанга вдоль ног", muscles: "Спина, ноги" },
  "bicep-curl": { tip: "Локти прижаты к бокам", muscles: "Бицепс" },
  "leg-raise": { tip: "Поясница прижата к полу", muscles: "Нижний пресс" },
  "bicycle-crunch": { tip: "Локоть к противоположному колену", muscles: "Пресс, косые" },
  "run": { tip: "Приземляйтесь на среднюю часть стопы", muscles: "Кардио, ноги" },
  "walk": { tip: "Спина прямая, шаги средней длины", muscles: "Кардио" },
  "stretch": { tip: "Плавно, без рывков, дышите", muscles: "Гибкость" },
  "dip": { tip: "Наклон вперед - грудь, прямо - трицепс", muscles: "Грудь, трицепс" },
  "hyperextension": { tip: "Не переразгибайтесь", muscles: "Поясница" },
  "shrug": { tip: "Поднимайте плечи к ушам", muscles: "Трапеция" },
  "bike": { tip: "Крутите педали плавно, спина прямая", muscles: "Кардио, ноги" },
  "elliptical": { tip: "Держите ровный темп", muscles: "Кардио" },
  "rowing": { tip: "Ноги - спина - руки, обратно", muscles: "Всё тело" },
  "stepper": { tip: "Шагайте полной стопой", muscles: "Ноги, кардио" },
  "default": { tip: "Выполняйте контролируемо", muscles: "См. описание" },
};

// SVG анимации для каждого типа упражнения
function ExerciseSVG({ type }: { type: string }) {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 2);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const svgStyle = "w-full h-48 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-lg";
  
  // Цвета
  const skin = "#FFD5B5";
  const shirt = "#3B82F6";
  const shorts = "#1E40AF";
  const hair = "#4A3728";
  
  switch (type) {
    case "pushup":
    case "pushup-narrow":
    case "pushup-wide":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          {/* Пол */}
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          {/* Тело */}
          {frame === 0 ? (
            // Верхняя позиция
            <g>
              <circle cx="160" cy="40" r="12" fill={skin} /> {/* Голова */}
              <ellipse cx="100" cy="50" rx="50" ry="8" fill={shirt} /> {/* Торс */}
              <line x1="40" y1="50" x2="40" y2="80" stroke={skin} strokeWidth="6" /> {/* Левая рука */}
              <line x1="160" y1="50" x2="160" y2="80" stroke={skin} strokeWidth="6" /> {/* Правая рука */}
              <ellipse cx="35" cy="55" rx="15" ry="6" fill={shorts} /> {/* Ноги */}
            </g>
          ) : (
            // Нижняя позиция
            <g>
              <circle cx="160" cy="60" r="12" fill={skin} /> {/* Голова */}
              <ellipse cx="100" cy="68" rx="50" ry="8" fill={shirt} transform="rotate(-5 100 68)" /> {/* Торс */}
              <line x1="40" y1="65" x2="40" y2="80" stroke={skin} strokeWidth="6" /> {/* Левая рука согнута */}
              <line x1="160" y1="65" x2="160" y2="80" stroke={skin} strokeWidth="6" /> {/* Правая рука согнута */}
              <ellipse cx="35" cy="72" rx="15" ry="6" fill={shorts} /> {/* Ноги */}
            </g>
          )}
          {/* Стрелка направления */}
          <path d="M175 50 L175 70 M170 55 L175 50 L180 55" stroke="#22C55E" strokeWidth="2" fill="none" />
          <path d="M175 70 L175 50 M170 65 L175 70 L180 65" stroke="#22C55E" strokeWidth="2" fill="none" transform="translate(0, 0)" />
        </svg>
      );
      
    case "squat":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            // Стоя
            <g>
              <circle cx="100" cy="20" r="12" fill={skin} />
              <rect x="90" y="32" width="20" height="30" rx="5" fill={shirt} />
              <rect x="88" y="62" width="10" height="28" fill={shorts} />
              <rect x="102" y="62" width="10" height="28" fill={shorts} />
              <line x1="85" y1="40" x2="70" y2="55" stroke={skin} strokeWidth="5" />
              <line x1="115" y1="40" x2="130" y2="55" stroke={skin} strokeWidth="5" />
            </g>
          ) : (
            // Присед
            <g>
              <circle cx="100" cy="40" r="12" fill={skin} />
              <rect x="90" y="52" width="20" height="25" rx="5" fill={shirt} />
              <path d="M88 77 Q80 85 75 90" stroke={shorts} strokeWidth="10" fill="none" />
              <path d="M112 77 Q120 85 125 90" stroke={shorts} strokeWidth="10" fill="none" />
              <line x1="85" y1="58" x2="65" y2="68" stroke={skin} strokeWidth="5" />
              <line x1="115" y1="58" x2="135" y2="68" stroke={skin} strokeWidth="5" />
            </g>
          )}
          <path d="M150 30 L150 60" stroke="#22C55E" strokeWidth="2" strokeDasharray="4" />
          <polygon points="145,55 150,65 155,55" fill="#22C55E" />
        </svg>
      );
      
    case "plank":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          {/* Планка - статичная, но с пульсацией */}
          <g opacity={frame === 0 ? 1 : 0.9}>
            <circle cx="160" cy="55" r="10" fill={skin} />
            <ellipse cx="100" cy="60" rx="55" ry="7" fill={shirt} />
            <line x1="155" y1="65" x2="155" y2="82" stroke={skin} strokeWidth="5" />
            <line x1="45" y1="60" x2="35" y2="60" stroke={shorts} strokeWidth="8" />
            <circle cx="30" cy="60" r="4" fill={skin} /> {/* Стопа */}
          </g>
          {/* Линия прямого тела */}
          <line x1="30" y1="50" x2="165" y2="50" stroke="#22C55E" strokeWidth="1" strokeDasharray="4" />
          <text x="100" y="35" textAnchor="middle" fill="#22C55E" fontSize="10">Держите линию</text>
        </svg>
      );
      
    case "lunge":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            // Стоя
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="25" rx="4" fill={shirt} />
              <rect x="90" y="55" width="8" height="35" fill={shorts} />
              <rect x="102" y="55" width="8" height="35" fill={shorts} />
            </g>
          ) : (
            // Выпад
            <g>
              <circle cx="100" cy="30" r="10" fill={skin} />
              <rect x="92" y="40" width="16" height="25" rx="4" fill={shirt} />
              {/* Передняя нога согнута */}
              <path d="M98 65 L80 80 L70 90" stroke={shorts} strokeWidth="8" fill="none" strokeLinecap="round" />
              {/* Задняя нога вытянута */}
              <path d="M106 65 L130 75 L150 90" stroke={shorts} strokeWidth="8" fill="none" strokeLinecap="round" />
            </g>
          )}
        </svg>
      );
      
    case "jumping-jack":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            // Ноги вместе, руки внизу
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="25" rx="4" fill={shirt} />
              <line x1="92" y1="35" x2="80" y2="55" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="35" x2="120" y2="55" stroke={skin} strokeWidth="5" />
              <rect x="95" y="55" width="10" height="35" fill={shorts} />
            </g>
          ) : (
            // Ноги врозь, руки вверх
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="25" rx="4" fill={shirt} />
              <line x1="92" y1="35" x2="70" y2="15" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="35" x2="130" y2="15" stroke={skin} strokeWidth="5" />
              <line x1="95" y1="55" x2="70" y2="90" stroke={shorts} strokeWidth="8" />
              <line x1="105" y1="55" x2="130" y2="90" stroke={shorts} strokeWidth="8" />
            </g>
          )}
        </svg>
      );
      
    case "burpee":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            // Упор лежа
            <g>
              <circle cx="160" cy="55" r="8" fill={skin} />
              <ellipse cx="110" cy="60" rx="45" ry="6" fill={shirt} />
              <line x1="155" y1="65" x2="155" y2="85" stroke={skin} strokeWidth="4" />
              <line x1="60" y1="60" x2="45" y2="60" stroke={shorts} strokeWidth="6" />
            </g>
          ) : (
            // Прыжок вверх
            <g>
              <circle cx="100" cy="15" r="8" fill={skin} />
              <rect x="94" y="23" width="12" height="20" rx="3" fill={shirt} />
              <line x1="94" y1="28" x2="80" y2="10" stroke={skin} strokeWidth="4" />
              <line x1="106" y1="28" x2="120" y2="10" stroke={skin} strokeWidth="4" />
              <line x1="96" y1="43" x2="85" y2="70" stroke={shorts} strokeWidth="6" />
              <line x1="104" y1="43" x2="115" y2="70" stroke={shorts} strokeWidth="6" />
            </g>
          )}
          <text x="100" y="98" textAnchor="middle" fill="#64748B" fontSize="8">1-2-3-4</text>
        </svg>
      );
      
    case "crunch":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          {frame === 0 ? (
            // Лежа
            <g>
              <ellipse cx="100" cy="75" rx="60" ry="8" fill={shirt} />
              <circle cx="160" cy="70" r="10" fill={skin} />
              <path d="M45 75 L35 60 L30 75" stroke={shorts} strokeWidth="8" fill="none" />
            </g>
          ) : (
            // Скручивание
            <g>
              <ellipse cx="110" cy="72" rx="50" ry="8" fill={shirt} transform="rotate(-20 110 72)" />
              <circle cx="140" cy="50" r="10" fill={skin} />
              <path d="M55 70 L45 55 L40 70" stroke={shorts} strokeWidth="8" fill="none" />
            </g>
          )}
        </svg>
      );
      
    case "pullup":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          {/* Турник */}
          <rect x="30" y="10" width="140" height="5" fill="#374151" rx="2" />
          <rect x="35" y="10" width="5" height="20" fill="#374151" />
          <rect x="160" y="10" width="5" height="20" fill="#374151" />
          
          {frame === 0 ? (
            // Внизу (вис)
            <g>
              <line x1="85" y1="15" x2="85" y2="35" stroke={skin} strokeWidth="5" />
              <line x1="115" y1="15" x2="115" y2="35" stroke={skin} strokeWidth="5" />
              <circle cx="100" cy="45" r="10" fill={skin} />
              <rect x="92" y="55" width="16" height="25" rx="4" fill={shirt} />
              <rect x="93" y="80" width="6" height="15" fill={shorts} />
              <rect x="101" y="80" width="6" height="15" fill={shorts} />
            </g>
          ) : (
            // Вверху
            <g>
              <path d="M85 15 Q75 25 85 35" stroke={skin} strokeWidth="5" fill="none" />
              <path d="M115 15 Q125 25 115 35" stroke={skin} strokeWidth="5" fill="none" />
              <circle cx="100" cy="25" r="10" fill={skin} />
              <rect x="92" y="35" width="16" height="25" rx="4" fill={shirt} />
              <rect x="93" y="60" width="6" height="15" fill={shorts} />
              <rect x="101" y="60" width="6" height="15" fill={shorts} />
            </g>
          )}
        </svg>
      );
      
    case "bench-press":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          {/* Скамья */}
          <rect x="40" y="70" width="120" height="8" fill="#374151" rx="2" />
          <rect x="50" y="78" width="8" height="15" fill="#374151" />
          <rect x="142" y="78" width="8" height="15" fill="#374151" />
          {/* Штанга */}
          <rect x="20" y={frame === 0 ? "35" : "55"} width="160" height="4" fill="#1F2937" rx="2" />
          <circle cx="25" cy={frame === 0 ? "37" : "57"} r="8" fill="#374151" />
          <circle cx="175" cy={frame === 0 ? "37" : "57"} r="8" fill="#374151" />
          {/* Человек */}
          <ellipse cx="100" cy="65" rx="40" ry="6" fill={shirt} />
          <circle cx="145" cy="62" r="8" fill={skin} />
          {/* Руки */}
          <line x1="70" y1="60" x2="70" y2={frame === 0 ? "37" : "57"} stroke={skin} strokeWidth="5" />
          <line x1="130" y1="60" x2="130" y2={frame === 0 ? "37" : "57"} stroke={skin} strokeWidth="5" />
          {/* Ноги */}
          <path d="M55 68 L45 85" stroke={shorts} strokeWidth="6" />
          <path d="M65 68 L75 85" stroke={shorts} strokeWidth="6" />
        </svg>
      );
      
    case "shoulder-press":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          <circle cx="100" cy="25" r="10" fill={skin} />
          <rect x="92" y="35" width="16" height="28" rx="4" fill={shirt} />
          <rect x="93" y="63" width="6" height="27" fill={shorts} />
          <rect x="101" y="63" width="6" height="27" fill={shorts} />
          {/* Гантели и руки */}
          {frame === 0 ? (
            // Внизу у плеч
            <g>
              <line x1="92" y1="40" x2="75" y2="40" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="40" x2="125" y2="40" stroke={skin} strokeWidth="5" />
              <rect x="68" y="35" width="10" height="10" fill="#1F2937" rx="2" />
              <rect x="122" y="35" width="10" height="10" fill="#1F2937" rx="2" />
            </g>
          ) : (
            // Вверху
            <g>
              <line x1="92" y1="40" x2="80" y2="15" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="40" x2="120" y2="15" stroke={skin} strokeWidth="5" />
              <rect x="73" y="8" width="10" height="10" fill="#1F2937" rx="2" />
              <rect x="117" y="8" width="10" height="10" fill="#1F2937" rx="2" />
            </g>
          )}
        </svg>
      );
      
    case "row":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {/* Наклон */}
          <circle cx="140" cy="35" r="10" fill={skin} />
          <ellipse cx="100" cy="45" rx="35" ry="8" fill={shirt} transform="rotate(-15 100 45)" />
          {/* Ноги */}
          <line x1="70" y1="50" x2="60" y2="90" stroke={shorts} strokeWidth="8" />
          <line x1="80" y1="55" x2="90" y2="90" stroke={shorts} strokeWidth="8" />
          {/* Гантель и рука */}
          {frame === 0 ? (
            <g>
              <line x1="120" y1="50" x2="120" y2="75" stroke={skin} strokeWidth="5" />
              <rect x="115" y="75" width="10" height="10" fill="#1F2937" rx="2" />
            </g>
          ) : (
            <g>
              <line x1="120" y1="50" x2="130" y2="55" stroke={skin} strokeWidth="5" />
              <rect x="125" y="50" width="10" height="10" fill="#1F2937" rx="2" />
            </g>
          )}
        </svg>
      );
      
    case "deadlift":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {/* Штанга */}
          <rect x="30" y="82" width="140" height="4" fill="#1F2937" rx="2" />
          <circle cx="35" cy="84" r="10" fill="#374151" />
          <circle cx="165" cy="84" r="10" fill="#374151" />
          
          {frame === 0 ? (
            // Внизу
            <g>
              <circle cx="100" cy="40" r="10" fill={skin} />
              <rect x="92" y="50" width="16" height="20" rx="4" fill={shirt} />
              <path d="M93 70 Q85 80 80 88" stroke={shorts} strokeWidth="8" fill="none" />
              <path d="M107 70 Q115 80 120 88" stroke={shorts} strokeWidth="8" fill="none" />
              <line x1="92" y1="55" x2="80" y2="80" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="55" x2="120" y2="80" stroke={skin} strokeWidth="5" />
            </g>
          ) : (
            // Вверху
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="28" rx="4" fill={shirt} />
              <rect x="93" y="58" width="6" height="32" fill={shorts} />
              <rect x="101" y="58" width="6" height="32" fill={shorts} />
              <line x1="92" y1="40" x2="80" y2="55" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="40" x2="120" y2="55" stroke={skin} strokeWidth="5" />
            </g>
          )}
        </svg>
      );
      
    case "bicep-curl":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          <circle cx="100" cy="20" r="10" fill={skin} />
          <rect x="92" y="30" width="16" height="28" rx="4" fill={shirt} />
          <rect x="93" y="58" width="6" height="32" fill={shorts} />
          <rect x="101" y="58" width="6" height="32" fill={shorts} />
          
          {frame === 0 ? (
            // Руки внизу
            <g>
              <line x1="92" y1="40" x2="80" y2="65" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="40" x2="120" y2="65" stroke={skin} strokeWidth="5" />
              <rect x="75" y="62" width="8" height="12" fill="#1F2937" rx="2" />
              <rect x="117" y="62" width="8" height="12" fill="#1F2937" rx="2" />
            </g>
          ) : (
            // Руки согнуты
            <g>
              <path d="M92 40 L85 50 L90 40" stroke={skin} strokeWidth="5" fill="none" />
              <path d="M108 40 L115 50 L110 40" stroke={skin} strokeWidth="5" fill="none" />
              <rect x="85" y="35" width="8" height="12" fill="#1F2937" rx="2" />
              <rect x="107" y="35" width="8" height="12" fill="#1F2937" rx="2" />
            </g>
          )}
        </svg>
      );
      
    case "leg-raise":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          {/* Лежит на спине */}
          <ellipse cx="100" cy="75" rx="50" ry="6" fill={shirt} />
          <circle cx="155" cy="72" r="8" fill={skin} />
          
          {frame === 0 ? (
            // Ноги внизу
            <line x1="45" y1="75" x2="25" y2="80" stroke={shorts} strokeWidth="10" />
          ) : (
            // Ноги вверху
            <line x1="45" y1="75" x2="45" y2="40" stroke={shorts} strokeWidth="10" />
          )}
        </svg>
      );
      
    case "bicycle-crunch":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          {frame === 0 ? (
            <g>
              <ellipse cx="110" cy="70" rx="40" ry="6" fill={shirt} transform="rotate(-15 110 70)" />
              <circle cx="145" cy="55" r="8" fill={skin} />
              <line x1="70" y1="68" x2="50" y2="50" stroke={shorts} strokeWidth="8" />
              <line x1="75" y1="72" x2="95" y2="80" stroke={shorts} strokeWidth="8" />
            </g>
          ) : (
            <g>
              <ellipse cx="110" cy="70" rx="40" ry="6" fill={shirt} transform="rotate(15 110 70)" />
              <circle cx="75" cy="55" r="8" fill={skin} />
              <line x1="130" y1="72" x2="150" y2="50" stroke={shorts} strokeWidth="8" />
              <line x1="125" y1="68" x2="105" y2="80" stroke={shorts} strokeWidth="8" />
            </g>
          )}
        </svg>
      );
      
    case "mountain-climber":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          <circle cx="155" cy="45" r="8" fill={skin} />
          <ellipse cx="110" cy="55" rx="40" ry="6" fill={shirt} />
          <line x1="155" y1="55" x2="155" y2="82" stroke={skin} strokeWidth="4" />
          
          {frame === 0 ? (
            <g>
              <path d="M70 55 L90 65 L85 82" stroke={shorts} strokeWidth="6" fill="none" />
              <line x1="70" y1="55" x2="50" y2="82" stroke={shorts} strokeWidth="6" />
            </g>
          ) : (
            <g>
              <line x1="70" y1="55" x2="50" y2="82" stroke={shorts} strokeWidth="6" />
              <path d="M70 55 L90 65 L85 82" stroke={shorts} strokeWidth="6" fill="none" />
            </g>
          )}
        </svg>
      );
      
    case "run":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            <g>
              <circle cx="100" cy="25" r="10" fill={skin} />
              <rect x="92" y="35" width="16" height="25" rx="4" fill={shirt} />
              <line x1="95" y1="60" x2="75" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="105" y1="60" x2="115" y2="75" stroke={shorts} strokeWidth="7" />
              <line x1="92" y1="42" x2="115" y2="35" stroke={skin} strokeWidth="4" />
              <line x1="108" y1="42" x2="85" y2="50" stroke={skin} strokeWidth="4" />
            </g>
          ) : (
            <g>
              <circle cx="105" cy="25" r="10" fill={skin} />
              <rect x="97" y="35" width="16" height="25" rx="4" fill={shirt} />
              <line x1="100" y1="60" x2="120" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="110" y1="60" x2="100" y2="75" stroke={shorts} strokeWidth="7" />
              <line x1="97" y1="42" x2="80" y2="35" stroke={skin} strokeWidth="4" />
              <line x1="113" y1="42" x2="130" y2="50" stroke={skin} strokeWidth="4" />
            </g>
          )}
        </svg>
      );
      
    case "walk":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="28" rx="4" fill={shirt} />
              <line x1="95" y1="58" x2="85" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="105" y1="58" x2="115" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="92" y1="38" x2="80" y2="50" stroke={skin} strokeWidth="4" />
              <line x1="108" y1="38" x2="120" y2="50" stroke={skin} strokeWidth="4" />
            </g>
          ) : (
            <g>
              <circle cx="102" cy="20" r="10" fill={skin} />
              <rect x="94" y="30" width="16" height="28" rx="4" fill={shirt} />
              <line x1="97" y1="58" x2="107" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="107" y1="58" x2="97" y2="88" stroke={shorts} strokeWidth="7" />
              <line x1="94" y1="38" x2="110" y2="45" stroke={skin} strokeWidth="4" />
              <line x1="110" y1="38" x2="94" y2="45" stroke={skin} strokeWidth="4" />
            </g>
          )}
        </svg>
      );
      
    case "dip":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          {/* Брусья */}
          <rect x="60" y="40" width="8" height="60" fill="#374151" />
          <rect x="132" y="40" width="8" height="60" fill="#374151" />
          
          {frame === 0 ? (
            // Вверху
            <g>
              <circle cx="100" cy="30" r="10" fill={skin} />
              <rect x="92" y="40" width="16" height="25" rx="4" fill={shirt} />
              <line x1="92" y1="45" x2="68" y2="45" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="45" x2="132" y2="45" stroke={skin} strokeWidth="5" />
              <rect x="93" y="65" width="6" height="20" fill={shorts} />
              <rect x="101" y="65" width="6" height="20" fill={shorts} />
            </g>
          ) : (
            // Внизу
            <g>
              <circle cx="100" cy="50" r="10" fill={skin} />
              <rect x="92" y="60" width="16" height="25" rx="4" fill={shirt} />
              <path d="M92 65 L75 55 L68 45" stroke={skin} strokeWidth="5" fill="none" />
              <path d="M108 65 L125 55 L132 45" stroke={skin} strokeWidth="5" fill="none" />
              <rect x="93" y="85" width="6" height="10" fill={shorts} />
              <rect x="101" y="85" width="6" height="10" fill={shorts} />
            </g>
          )}
        </svg>
      );
    
    case "side-plank":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="85" width="200" height="15" fill="#64748B" />
          <g opacity={frame === 0 ? 1 : 0.9}>
            <circle cx="100" cy="35" r="10" fill={skin} />
            <rect x="92" y="45" width="16" height="25" rx="4" fill={shirt} />
            <line x1="100" y1="70" x2="60" y2="82" stroke={shorts} strokeWidth="8" />
            <line x1="100" y1="70" x2="155" y2="82" stroke={shorts} strokeWidth="8" />
            <line x1="92" y1="50" x2="92" y2="82" stroke={skin} strokeWidth="5" />
            <line x1="108" y1="50" x2="108" y2="25" stroke={skin} strokeWidth="5" />
          </g>
        </svg>
      );
      
    case "hyperextension":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          {/* Тренажер */}
          <rect x="50" y="60" width="100" height="8" fill="#374151" />
          <rect x="45" y="60" width="8" height="35" fill="#374151" />
          
          {frame === 0 ? (
            // Внизу
            <g>
              <ellipse cx="100" cy="55" rx="40" ry="6" fill={shirt} transform="rotate(30 100 55)" />
              <circle cx="70" cy="70" r="8" fill={skin} />
              <line x1="135" y1="45" x2="145" y2="75" stroke={shorts} strokeWidth="8" />
            </g>
          ) : (
            // Вверху
            <g>
              <ellipse cx="100" cy="55" rx="40" ry="6" fill={shirt} />
              <circle cx="60" cy="52" r="8" fill={skin} />
              <line x1="140" y1="55" x2="145" y2="75" stroke={shorts} strokeWidth="8" />
            </g>
          )}
        </svg>
      );
      
    case "shrug":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          <rect x="92" y="35" width="16" height="28" rx="4" fill={shirt} />
          <rect x="93" y="63" width="6" height="27" fill={shorts} />
          <rect x="101" y="63" width="6" height="27" fill={shorts} />
          
          {frame === 0 ? (
            <g>
              <circle cx="100" cy="22" r="10" fill={skin} />
              <line x1="92" y1="40" x2="75" y2="60" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="40" x2="125" y2="60" stroke={skin} strokeWidth="5" />
              <rect x="70" y="58" width="8" height="15" fill="#1F2937" rx="2" />
              <rect x="122" y="58" width="8" height="15" fill="#1F2937" rx="2" />
            </g>
          ) : (
            <g>
              <circle cx="100" cy="18" r="10" fill={skin} />
              <line x1="92" y1="35" x2="75" y2="55" stroke={skin} strokeWidth="5" />
              <line x1="108" y1="35" x2="125" y2="55" stroke={skin} strokeWidth="5" />
              <rect x="70" y="53" width="8" height="15" fill="#1F2937" rx="2" />
              <rect x="122" y="53" width="8" height="15" fill="#1F2937" rx="2" />
            </g>
          )}
        </svg>
      );
      
    case "bike":
    case "elliptical":
    case "rowing":
    case "stepper":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {/* Тренажер */}
          <rect x="40" y="50" width="120" height="40" fill="#374151" rx="5" />
          <circle cx="60" cy="70" r="15" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
          <circle cx="140" cy="70" r="15" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
          {/* Человек */}
          <circle cx="100" cy="25" r="10" fill={skin} />
          <rect x="92" y="35" width="16" height="20" rx="4" fill={shirt} />
          {frame === 0 ? (
            <g>
              <path d="M95 55 L80 70" stroke={shorts} strokeWidth="6" />
              <path d="M105 55 L120 65" stroke={shorts} strokeWidth="6" />
            </g>
          ) : (
            <g>
              <path d="M95 55 L80 65" stroke={shorts} strokeWidth="6" />
              <path d="M105 55 L120 70" stroke={shorts} strokeWidth="6" />
            </g>
          )}
          <text x="100" y="98" textAnchor="middle" fill="#9CA3AF" fontSize="8">
            {type === "bike" ? "Велотренажер" : type === "elliptical" ? "Эллипс" : type === "rowing" ? "Гребля" : "Степпер"}
          </text>
        </svg>
      );
      
    case "stretch":
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          {frame === 0 ? (
            // Стоя
            <g>
              <circle cx="100" cy="20" r="10" fill={skin} />
              <rect x="92" y="30" width="16" height="28" rx="4" fill={shirt} />
              <rect x="93" y="58" width="6" height="32" fill={shorts} />
              <rect x="101" y="58" width="6" height="32" fill={shorts} />
              <line x1="92" y1="40" x2="75" y2="50" stroke={skin} strokeWidth="4" />
              <line x1="108" y1="40" x2="125" y2="50" stroke={skin} strokeWidth="4" />
            </g>
          ) : (
            // Наклон
            <g>
              <circle cx="100" cy="45" r="10" fill={skin} />
              <rect x="92" y="35" width="16" height="28" rx="4" fill={shirt} transform="rotate(-70 100 49)" />
              <rect x="93" y="58" width="6" height="32" fill={shorts} />
              <rect x="101" y="58" width="6" height="32" fill={shorts} />
              <line x1="70" y1="55" x2="85" y2="85" stroke={skin} strokeWidth="4" />
              <line x1="75" y1="50" x2="90" y2="80" stroke={skin} strokeWidth="4" />
            </g>
          )}
        </svg>
      );
      
    default:
      return (
        <svg viewBox="0 0 200 100" className={svgStyle}>
          <rect x="0" y="90" width="200" height="10" fill="#64748B" />
          <circle cx="100" cy="30" r="15" fill={skin} />
          <rect x="88" y="45" width="24" height="30" rx="5" fill={shirt} />
          <rect x="90" y="75" width="8" height="15" fill={shorts} />
          <rect x="102" y="75" width="8" height="15" fill={shorts} />
          <line x1="88" y1="52" x2="70" y2="65" stroke={skin} strokeWidth="5" />
          <line x1="112" y1="52" x2="130" y2="65" stroke={skin} strokeWidth="5" />
          <text x="100" y="15" textAnchor="middle" fill="#6B7280" fontSize="10">Упражнение</text>
        </svg>
      );
  }
}

export function ExerciseDemo({ title }: ExerciseDemoProps) {
  const type = getExerciseType(title);
  const info = exerciseInfo[type] || exerciseInfo["default"];
  
  return (
    <div className="rounded-lg overflow-hidden border border-blue-200 dark:border-gray-700">
      <ExerciseSVG type={type} />
      <div className="bg-blue-500 dark:bg-blue-600 p-3">
        <p className="text-sm text-white font-medium text-center">
          {info.tip}
        </p>
        <p className="text-xs text-blue-100 text-center mt-1">
          {info.muscles}
        </p>
      </div>
    </div>
  );
}
