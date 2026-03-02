// src/components/ExerciseAnimation.tsx
// Анимированные SVG демонстрации упражнений — CSS keyframes, минималистичный стиль

import { useEffect, useId } from "react";

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
  | "meditation"
  | "jump-rope"
  | "high-knees"
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
  if (lowerTitle.includes("растяжка") || lowerTitle.includes("stretch") || lowerTitle.includes("боковой наклон") || lowerTitle.includes("наклон")) {
    return "stretch";
  }
  
  // Йога
  if (lowerTitle.includes("йога") || lowerTitle.includes("yoga") || lowerTitle.includes("поза")) {
    return "yoga";
  }

  // Медитация / дыхание / осознанность
  if (lowerTitle.includes("медитац") || lowerTitle.includes("дыхан") || lowerTitle.includes("осознан") || lowerTitle.includes("relax")) {
    return "meditation";
  }

  // Скакалка
  if (lowerTitle.includes("скакалк") || lowerTitle.includes("jump rope") || lowerTitle.includes("прыжки на скакалк")) {
    return "jump-rope";
  }

  // Высокое колено
  if (lowerTitle.includes("высокое колен") || lowerTitle.includes("high knee")) {
    return "high-knees";
  }
  
  return "default";
}

export function ExerciseAnimation({ exerciseType, title }: ExerciseAnimationProps) {
  const uid = useId().replace(/:/g, "");

  // Все CSS keyframes для всех упражнений
  const keyframes = `
    /* ─── ОБЩИЕ ─── */
    @keyframes bounce-${uid} {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-4px); }
    }
    @keyframes pulse-glow-${uid} {
      0%,100% { opacity: 0.15; r: 28; }
      50%     { opacity: 0.35; r: 34; }
    }

    /* ─── БЕГ ─── */
    @keyframes run-body-${uid} {
      0%,100% { transform: translate(50px,22px) rotate(-8deg); }
      50%     { transform: translate(50px,18px) rotate(-8deg); }
    }
    @keyframes run-lleg-${uid} {
      0%,100% { transform: rotate(-35deg); }
      50%     { transform: rotate(40deg); }
    }
    @keyframes run-rleg-${uid} {
      0%,100% { transform: rotate(35deg); }
      50%     { transform: rotate(-40deg); }
    }
    @keyframes run-larm-${uid} {
      0%,100% { transform: rotate(40deg); }
      50%     { transform: rotate(-30deg); }
    }
    @keyframes run-rarm-${uid} {
      0%,100% { transform: rotate(-40deg); }
      50%     { transform: rotate(30deg); }
    }
    @keyframes run-ground-${uid} {
      0%,49%  { transform: translateX(0);   opacity: 1; }
      50%,100%{ transform: translateX(-8px); opacity: 0.5; }
    }

    /* ─── ПРЫЖКИ НОГИ ВРОЗЬ ─── */
    @keyframes jj-larm-${uid} {
      0%,100% { transform: rotate(15deg); }
      50%     { transform: rotate(-80deg); }
    }
    @keyframes jj-rarm-${uid} {
      0%,100% { transform: rotate(-15deg); }
      50%     { transform: rotate(80deg); }
    }
    @keyframes jj-lleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-28deg); }
    }
    @keyframes jj-rleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(28deg); }
    }
    @keyframes jj-body-${uid} {
      0%,100% { transform: translate(50px,18px); }
      50%     { transform: translate(50px,14px); }
    }

    /* ─── БЕРПИ ─── */
    @keyframes burpee-body-${uid} {
      0%,15%  { transform: translate(50px,16px) rotate(0deg); }
      35%,50% { transform: translate(50px,60px) rotate(90deg); }
      65%,80% { transform: translate(50px,60px) rotate(90deg); }
      100%    { transform: translate(50px,16px) rotate(0deg); }
    }
    @keyframes burpee-larm-${uid} {
      0%,15%  { transform: rotate(20deg); }
      35%,65% { transform: rotate(-80deg); }
      80%,100%{ transform: rotate(20deg); }
    }
    @keyframes burpee-rarm-${uid} {
      0%,15%  { transform: rotate(-20deg); }
      35%,65% { transform: rotate(80deg); }
      80%,100%{ transform: rotate(-20deg); }
    }
    @keyframes burpee-lleg-${uid} {
      0%,15%  { transform: rotate(0deg); }
      35%,65% { transform: rotate(-20deg); }
      80%,100%{ transform: rotate(0deg); }
    }
    @keyframes burpee-rleg-${uid} {
      0%,15%  { transform: rotate(0deg); }
      35%,65% { transform: rotate(20deg); }
      80%,100%{ transform: rotate(0deg); }
    }

    /* ─── СКАКАЛКА ─── */
    @keyframes rope-body-${uid} {
      0%,100% { transform: translate(50px,22px); }
      40%,60% { transform: translate(50px,12px); }
    }
    @keyframes rope-larm-${uid} {
      0%,100% { transform: rotate(60deg); }
      50%     { transform: rotate(120deg); }
    }
    @keyframes rope-rarm-${uid} {
      0%,100% { transform: rotate(-60deg); }
      50%     { transform: rotate(-120deg); }
    }
    @keyframes rope-path-${uid} {
      0%   { d: path("M 20 80 Q 50 110 80 80"); }
      25%  { d: path("M 18 70 Q 50 95  82 70"); }
      50%  { d: path("M 20 60 Q 50 30  80 60"); }
      75%  { d: path("M 18 70 Q 50 95  82 70"); }
      100% { d: path("M 20 80 Q 50 110 80 80"); }
    }

    /* ─── ВЫСОКОЕ КОЛЕНО ─── */
    @keyframes hk-body-${uid} {
      0%,100% { transform: translate(50px,18px); }
      50%     { transform: translate(50px,16px); }
    }
    @keyframes hk-lleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-70deg); }
    }
    @keyframes hk-rleg-${uid} {
      0%,49%  { transform: rotate(0deg); }
      50%,100%{ transform: rotate(0deg); }
    }
    @keyframes hk-lleg2-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-70deg); }
    }
    @keyframes hk-rleg2-${uid} {
      0%,49%  { transform: rotate(0deg); }
      50%,100%{ transform: rotate(0deg); }
    }
    @keyframes hk-larm-${uid} {
      0%,100% { transform: rotate(30deg); }
      50%     { transform: rotate(-40deg); }
    }
    @keyframes hk-rarm-${uid} {
      0%,100% { transform: rotate(-30deg); }
      50%     { transform: rotate(40deg); }
    }

    /* ─── ПРИСЕДАНИЯ ─── */
    @keyframes sq-body-${uid} {
      0%,100% { transform: translate(50px,14px); }
      50%     { transform: translate(50px,32px); }
    }
    @keyframes sq-torso-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(12deg); }
    }
    @keyframes sq-lleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(50deg); }
    }
    @keyframes sq-rleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-50deg); }
    }
    @keyframes sq-larm-${uid} {
      0%,100% { transform: rotate(20deg); }
      50%     { transform: rotate(70deg); }
    }
    @keyframes sq-rarm-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(-70deg); }
    }

    /* ─── ОТЖИМАНИЯ ─── */
    @keyframes pu-body-${uid} {
      0%,100% { transform: translate(50px,58px) rotate(-2deg); }
      50%     { transform: translate(50px,66px) rotate(-2deg); }
    }
    @keyframes pu-larm-${uid} {
      0%,100% { transform: rotate(-55deg); }
      50%     { transform: rotate(-35deg); }
    }
    @keyframes pu-rarm-${uid} {
      0%,100% { transform: rotate(55deg); }
      50%     { transform: rotate(35deg); }
    }

    /* ─── ПЛАНКА ─── */
    @keyframes plank-pulse-${uid} {
      0%,100% { opacity: 0.2; }
      50%     { opacity: 0.5; }
    }

    /* ─── ВЫПАД ─── */
    @keyframes lu-body-${uid} {
      0%,100% { transform: translate(45px,20px); }
      50%     { transform: translate(45px,32px); }
    }
    @keyframes lu-lleg-${uid} {
      0%,100% { transform: rotate(10deg); }
      50%     { transform: rotate(30deg); }
    }
    @keyframes lu-rleg-${uid} {
      0%,100% { transform: rotate(-10deg); }
      50%     { transform: rotate(-55deg); }
    }

    /* ─── АЛЬПИНИСТ ─── */
    @keyframes mc-lleg-${uid} {
      0%,100% { transform: rotate(-10deg); }
      50%     { transform: rotate(-55deg); }
    }
    @keyframes mc-rleg-${uid} {
      0%,100% { transform: rotate(-55deg); }
      50%     { transform: rotate(-10deg); }
    }

    /* ─── СКРУЧИВАНИЯ ─── */
    @keyframes cr-torso-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-45deg); }
    }
    @keyframes cr-legs-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(15deg); }
    }

    /* ─── ПОДЪЁМ НОГ ─── */
    @keyframes lr-legs-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-80deg); }
    }

    /* ─── ВЕЛОСИПЕД (лёжа) ─── */
    @keyframes bc-lleg-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(-100deg); }
    }
    @keyframes bc-rleg-${uid} {
      0%,100% { transform: rotate(-100deg); }
      50%     { transform: rotate(-20deg); }
    }
    @keyframes bc-ltorso-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(20deg); }
    }

    /* ─── ТЯГА/СТАНОВАЯ ─── */
    @keyframes dl-body-${uid} {
      0%,100% { transform: translate(50px,15px); }
      50%     { transform: translate(50px,32px); }
    }
    @keyframes dl-torso-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(45deg); }
    }
    @keyframes dl-lleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(20deg); }
    }
    @keyframes dl-rleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(-20deg); }
    }

    /* ─── ПОДТЯГИВАНИЯ ─── */
    @keyframes pu2-body-${uid} {
      0%,100% { transform: translate(50px,35px); }
      50%     { transform: translate(50px,22px); }
    }

    /* ─── ЖИМЫ ЛЁЖА / ГАНТЕЛЯМИ ─── */
    @keyframes bp-larm-${uid} {
      0%,100% { transform: rotate(-80deg); }
      50%     { transform: rotate(-50deg); }
    }
    @keyframes bp-rarm-${uid} {
      0%,100% { transform: rotate(80deg); }
      50%     { transform: rotate(50deg); }
    }

    /* ─── ЖИМЫ ПЛЕЧАМИ ─── */
    @keyframes sp-larm-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(-120deg); }
    }
    @keyframes sp-rarm-${uid} {
      0%,100% { transform: rotate(20deg); }
      50%     { transform: rotate(120deg); }
    }

    /* ─── СГИБАНИЯ НА БИЦЕПС ─── */
    @keyframes curl-larm-${uid} {
      0%,100% { transform: rotate(15deg); }
      50%     { transform: rotate(-100deg); }
    }
    @keyframes curl-rarm-${uid} {
      0%,100% { transform: rotate(-15deg); }
      50%     { transform: rotate(100deg); }
    }

    /* ─── БРУСЬЯ ─── */
    @keyframes dip-body-${uid} {
      0%,100% { transform: translate(50px,38px); }
      50%     { transform: translate(50px,52px); }
    }

    /* ─── МЕДИТАЦИЯ ─── */
    @keyframes med-aura-${uid} {
      0%,100% { r: 30; opacity: 0.12; }
      50%     { r: 40; opacity: 0.28; }
    }
    @keyframes med-breathe-${uid} {
      0%,100% { transform: scaleX(1) scaleY(1); }
      50%     { transform: scaleX(1.06) scaleY(1.04); }
    }
    @keyframes med-larm-${uid} {
      0%,100% { transform: rotate(50deg); }
      50%     { transform: rotate(45deg); }
    }
    @keyframes med-rarm-${uid} {
      0%,100% { transform: rotate(-50deg); }
      50%     { transform: rotate(-45deg); }
    }
    @keyframes med-particles-${uid} {
      0%   { opacity: 0; transform: translateY(0); }
      30%  { opacity: 0.7; }
      100% { opacity: 0; transform: translateY(-20px); }
    }

    /* ─── РАСТЯЖКА ─── */
    @keyframes str-torso-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(45deg); }
    }
    @keyframes str-larm-${uid} {
      0%,100% { transform: rotate(-10deg); }
      50%     { transform: rotate(130deg); }
    }
    @keyframes str-rarm-${uid} {
      0%,100% { transform: rotate(10deg); }
      50%     { transform: rotate(10deg); }
    }

    /* ─── ЙОГА (поза дерева) ─── */
    @keyframes yoga-lleg-${uid} {
      0%,100% { transform: rotate(0deg); }
      50%     { transform: rotate(0deg); }
    }
    @keyframes yoga-rleg-${uid} {
      0%,100% { transform: rotate(55deg); }
      40%,60% { transform: rotate(58deg); }
    }
    @keyframes yoga-larm-${uid} {
      0%,100% { transform: rotate(-95deg); }
      50%     { transform: rotate(-100deg); }
    }
    @keyframes yoga-rarm-${uid} {
      0%,100% { transform: rotate(95deg); }
      50%     { transform: rotate(100deg); }
    }
    @keyframes yoga-aura-${uid} {
      0%,100% { r: 24; opacity: 0.1; }
      50%     { r: 32; opacity: 0.22; }
    }

    /* ─── ХОДЬБА ─── */
    @keyframes wk-lleg-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(20deg); }
    }
    @keyframes wk-rleg-${uid} {
      0%,100% { transform: rotate(20deg); }
      50%     { transform: rotate(-20deg); }
    }
    @keyframes wk-larm-${uid} {
      0%,100% { transform: rotate(20deg); }
      50%     { transform: rotate(-20deg); }
    }
    @keyframes wk-rarm-${uid} {
      0%,100% { transform: rotate(-20deg); }
      50%     { transform: rotate(20deg); }
    }

    /* ─── ТЯГА В НАКЛОНЕ ─── */
    @keyframes row-rarm-${uid} {
      0%,100% { transform: rotate(80deg); }
      50%     { transform: rotate(20deg); }
    }

    /* ─── ПОЛ / ФИГУРА ─── */
    @keyframes default-pulse-${uid} {
      0%,100% { transform: scale(1);   opacity: 0.2; }
      50%     { transform: scale(1.12); opacity: 0.4; }
    }
  `;

  // Общие константы стика
  const S = {
    HEAD_R: 8,
    SW: 3.5,       // strokeWidth
    COLOR: "#e2e8f0",   // светло-серый
    ACCENT: "#a78bfa",  // фиолетовый акцент
    DIM: "#64748b",     // тёмный
    DUR: "0.7s",
    ease: "cubic-bezier(.45,0,.55,1)",
  };

  // Рисуем линию конечности начиная от (0,0)
  const limb = (x2: number, y2: number, color = S.COLOR) =>
    <line x1="0" y1="0" x2={x2} y2={y2} stroke={color} strokeWidth={S.SW} strokeLinecap="round" />;

  const head = (cx: number, cy: number) =>
    <circle cx={cx} cy={cy} r={S.HEAD_R} stroke={S.COLOR} strokeWidth={S.SW} fill="#1e1b4b" />;

  const floor = () =>
    <line x1="8" y1="108" x2="92" y2="108" stroke={S.DIM} strokeWidth="2" strokeLinecap="round" />;

  const renderFigure = () => {
    const dur = S.DUR;
    const ease = S.ease;
    const inf = "infinite";

    switch (exerciseType) {

      /* ══════════ БЕГ ══════════ */
      case "run":
      case "walk": {
        const isRun = exerciseType === "run";
        const lAnim = isRun ? `run-lleg-${uid}` : `wk-lleg-${uid}`;
        const rAnim = isRun ? `run-rleg-${uid}` : `wk-rleg-${uid}`;
        const lArmAnim = isRun ? `run-larm-${uid}` : `wk-larm-${uid}`;
        const rArmAnim = isRun ? `run-rarm-${uid}` : `wk-rarm-${uid}`;
        const bodyAnim = isRun ? `run-body-${uid}` : `bounce-${uid}`;
        const bodyDur = isRun ? dur : "1s";
        return (
          <>
            {/* Линии скорости для бега */}
            {isRun && <>
              <line x1="6" y1="45" x2="22" y2="45" stroke={S.DIM} strokeWidth="2" strokeLinecap="round"
                style={{ animation: `run-ground-${uid} ${dur} ${ease} ${inf}` }} />
              <line x1="6" y1="52" x2="16" y2="52" stroke={S.DIM} strokeWidth="1.5" strokeLinecap="round"
                style={{ animation: `run-ground-${uid} ${dur} ${ease} ${inf}`, animationDelay: "0.2s" }} />
            </>}
            {/* Тело */}
            <g style={{ animation: `${bodyAnim} ${bodyDur} ${ease} ${inf}` }}>
              {head(0, -10)}
              {/* Туловище */}
              <line x1="0" y1={-2} x2={isRun ? 4 : 0} y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Левая рука */}
              <g transform="translate(0,4)" style={{ animation: `${lArmAnim} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-14, 16)}
              </g>
              {/* Правая рука */}
              <g transform="translate(0,4)" style={{ animation: `${rArmAnim} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(14, 16)}
              </g>
              {/* Левая нога */}
              <g transform="translate(-4,22)" style={{ animation: `${lAnim} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-6, 28)}
              </g>
              {/* Правая нога */}
              <g transform="translate(4,22)" style={{ animation: `${rAnim} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(6, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ПРЫЖКИ НОГИ ВРОЗЬ ══════════ */
      case "jumping-jack": {
        return (
          <>
            <g style={{ animation: `jj-body-${uid} 0.5s ${ease} ${inf}` }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(0,4)" style={{ animation: `jj-larm-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-16, 18)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `jj-rarm-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(16, 18)}
              </g>
              <g transform="translate(-4,22)" style={{ animation: `jj-lleg-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-4, 28)}
              </g>
              <g transform="translate(4,22)" style={{ animation: `jj-rleg-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(4, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ БЕРПИ ══════════ */
      case "burpee": {
        return (
          <>
            <g style={{ animation: `burpee-body-${uid} 2s ${ease} ${inf}`, transformOrigin: "50px 50px" }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(0,4)" style={{ animation: `burpee-larm-${uid} 2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-15, 18)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `burpee-rarm-${uid} 2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(15, 18)}
              </g>
              <g transform="translate(-4,22)" style={{ animation: `burpee-lleg-${uid} 2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-5, 28)}
              </g>
              <g transform="translate(4,22)" style={{ animation: `burpee-rleg-${uid} 2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(5, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ СКАКАЛКА ══════════ */
      case "jump-rope": {
        return (
          <>
            {/* Верёвка */}
            <path d="M 20 80 Q 50 110 80 80" stroke={S.ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round"
              style={{ animation: `rope-path-${uid} 0.4s linear ${inf}` }} />
            <g style={{ animation: `rope-body-${uid} 0.4s ${ease} ${inf}` }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="20" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(0,4)" style={{ animation: `rope-larm-${uid} 0.4s linear ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-18, 14)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `rope-rarm-${uid} 0.4s linear ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(18, 14)}
              </g>
              {/* Ноги вместе при прыжке */}
              <line x1="-4" y1="20" x2="-4" y2="46" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="4" y1="20" x2="4" y2="46" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ВЫСОКОЕ КОЛЕНО ══════════ */
      case "high-knees": {
        return (
          <>
            <g style={{ animation: `hk-body-${uid} ${dur} ${ease} ${inf}` }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(0,4)" style={{ animation: `hk-larm-${uid} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-14, 18)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `hk-rarm-${uid} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(14, 18)}
              </g>
              {/* Левая нога: поднимается */}
              <g transform="translate(-4,22)" style={{ animation: `hk-lleg-${uid} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                <line x1="0" y1="0" x2="-4" y2="16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
                <g transform="translate(-4,16)" style={{ animation: `hk-lleg2-${uid} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                  {limb(-2, 14)}
                </g>
              </g>
              {/* Правая нога стоит */}
              <g transform="translate(4,22)" style={{ animation: `hk-rleg-${uid} ${dur} ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                <line x1="0" y1="0" x2="4" y2="16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
                <g transform="translate(4,16)">
                  {limb(0, 14)}
                </g>
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ПРИСЕДАНИЯ ══════════ */
      case "squat": {
        return (
          <>
            <g style={{ animation: `sq-body-${uid} 1s ${ease} ${inf}` }}>
              {head(0, -10)}
              <g style={{ animation: `sq-torso-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              </g>
              <g transform="translate(0,4)" style={{ animation: `sq-larm-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-14, 18)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `sq-rarm-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(14, 18)}
              </g>
              <g transform="translate(-5,22)" style={{ animation: `sq-lleg-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-6, 28)}
              </g>
              <g transform="translate(5,22)" style={{ animation: `sq-rleg-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(6, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ОТЖИМАНИЯ ══════════ */
      case "pushup": {
        return (
          <>
            <g style={{ animation: `pu-body-${uid} 0.9s ${ease} ${inf}` }}>
              {head(-36, 0)}
              <line x1="-35" y1="6" x2="30" y2="0" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(-20,2)" style={{ animation: `pu-larm-${uid} 0.9s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-10, 24)}
              </g>
              <g transform="translate(10,1)" style={{ animation: `pu-rarm-${uid} 0.9s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(10, 24)}
              </g>
              <line x1="28" y1="2" x2="28" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="36" y1="2" x2="36" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ПЛАНКА ══════════ */
      case "plank": {
        return (
          <>
            {/* Аура напряжения */}
            <ellipse cx="0" cy="8" rx="38" ry="14" fill={S.ACCENT}
              style={{ animation: `plank-pulse-${uid} 1.2s ease-in-out ${inf}` }} />
            {head(-36, -2)}
            <line x1="-36" y1="6" x2="32" y2="2" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Руки (опора на предплечья) */}
            <line x1="-20" y1="4" x2="-20" y2="24" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="-12" y1="4" x2="-12" y2="24" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Ноги прямые */}
            <line x1="28" y1="4" x2="28" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="36" y1="4" x2="36" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }

      /* ══════════ ВЫПАД ══════════ */
      case "lunge": {
        return (
          <>
            <g style={{ animation: `lu-body-${uid} 1s ${ease} ${inf}` }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="20" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Руки на поясе */}
              <line x1="0" y1="6" x2="-12" y2="14" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="0" y1="6" x2="12" y2="14" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Левая нога — сзади */}
              <g transform="translate(-5,20)" style={{ animation: `lu-lleg-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-8, 28)}
              </g>
              {/* Правая нога — впереди */}
              <g transform="translate(5,20)" style={{ animation: `lu-rleg-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(20, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ СКАЛОЛАЗ ══════════ */
      case "mountain-climber": {
        return (
          <>
            {head(-34, 56)}
            <line x1="-34" y1="64" x2="28" y2="58" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="-20" y1="62" x2="-20" y2="86" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="10" y1="60" x2="10" y2="86" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Ноги бегут */}
            <g transform="translate(28,60)" style={{ animation: `mc-lleg-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(-6, 26)}
            </g>
            <g transform="translate(36,60)" style={{ animation: `mc-rleg-${uid} 0.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(6, 26)}
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ СКРУЧИВАНИЯ ══════════ */
      case "crunch": {
        return (
          <>
            {/* Коврик */}
            <rect x="8" y="100" width="84" height="5" rx="2" fill="#312e81" opacity="0.7" />
            {/* Голова */}
            <g style={{ animation: `cr-torso-${uid} 1s ${ease} ${inf}`, transformOrigin: "50px 76px" }}>
              {head(50, 64)}
              {/* Торс */}
              <line x1="50" y1="72" x2="50" y2="94" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Руки за голову */}
              <line x1="50" y1="78" x2="36" y2="70" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="50" y1="78" x2="64" y2="70" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {/* Ноги лежат с небольшим сгибом */}
            <g style={{ animation: `cr-legs-${uid} 1s ${ease} ${inf}`, transformOrigin: "50px 94px" }}>
              <line x1="50" y1="94" x2="32" y2="106" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="50" y1="94" x2="68" y2="106" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ПОДЪЁМ НОГ ══════════ */
      case "leg-raise": {
        return (
          <>
            <rect x="8" y="100" width="84" height="5" rx="2" fill="#312e81" opacity="0.7" />
            {/* Голова */}
            {head(18, 86)}
            {/* Торс горизонтальный */}
            <line x1="26" y1="88" x2="66" y2="88" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Руки вдоль тела */}
            <line x1="36" y1="88" x2="28" y2="100" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="56" y1="88" x2="64" y2="100" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Ноги поднимаются */}
            <g style={{ animation: `lr-legs-${uid} 1.2s ${ease} ${inf}`, transformOrigin: "66px 88px" }}>
              <line x1="66" y1="88" x2="80" y2="100" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="66" y1="88" x2="88" y2="100" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ВЕЛОСИПЕД ══════════ */
      case "bicycle": {
        return (
          <>
            <rect x="8" y="100" width="84" height="5" rx="2" fill="#312e81" opacity="0.7" />
            {/* Голова */}
            {head(28, 72)}
            {/* Торс */}
            <g style={{ animation: `bc-ltorso-${uid} 0.7s ${ease} ${inf}`, transformOrigin: "40px 84px" }}>
              <line x1="28" y1="80" x2="58" y2="84" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Левый локоть к правому колену */}
              <line x1="28" y1="80" x2="42" y2="70" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {/* Левая нога */}
            <g transform="translate(58,84)" style={{ animation: `bc-lleg-${uid} 0.7s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="-8" y2="16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-8" y1="16" x2="2" y2="28" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {/* Правая нога */}
            <g transform="translate(62,84)" style={{ animation: `bc-rleg-${uid} 0.7s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="8" y2="16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="8" y1="16" x2="2" y2="28" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ МЕДИТАЦИЯ ══════════ */
      case "meditation": {
        return (
          <>
            {/* Аура */}
            <circle cx="0" cy="10" r="30" fill={S.ACCENT} opacity="0"
              style={{ animation: `med-aura-${uid} 2s ease-in-out ${inf}` }} />
            {/* Частицы */}
            <circle cx="-12" cy="-10" r="2" fill={S.ACCENT}
              style={{ animation: `med-particles-${uid} 2s ease-in-out ${inf}`, animationDelay: "0s" }} />
            <circle cx="0" cy="-18" r="1.5" fill={S.ACCENT}
              style={{ animation: `med-particles-${uid} 2s ease-in-out ${inf}`, animationDelay: "0.6s" }} />
            <circle cx="12" cy="-10" r="2" fill={S.ACCENT}
              style={{ animation: `med-particles-${uid} 2s ease-in-out ${inf}`, animationDelay: "1.2s" }} />
            {/* Тело дышит */}
            <g style={{ animation: `med-breathe-${uid} 2s ease-in-out ${inf}`, transformOrigin: "0px 12px" }}>
              {head(0, -10)}
              {/* Торс */}
              <line x1="0" y1={-2} x2="0" y2="20" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Руки на колени */}
              <g transform="translate(0,6)" style={{ animation: `med-larm-${uid} 2s ease-in-out ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-18, 16)}
              </g>
              <g transform="translate(0,6)" style={{ animation: `med-rarm-${uid} 2s ease-in-out ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(18, 16)}
              </g>
              {/* Скрещённые ноги */}
              <line x1="-5" y1="20" x2="-18" y2="38" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="5" y1="20" x2="18" y2="38" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-18" y1="38" x2="18" y2="38" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
          </>
        );
      }

      /* ══════════ РАСТЯЖКА ══════════ */
      case "stretch": {
        return (
          <>
            {head(0, -10)}
            <g style={{ animation: `str-torso-${uid} 1.5s ${ease} ${inf}`, transformOrigin: "0px 22px" }}>
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <g transform="translate(0,4)" style={{ animation: `str-larm-${uid} 1.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-16, 18, S.ACCENT)}
              </g>
              <g transform="translate(0,4)" style={{ animation: `str-rarm-${uid} 1.5s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(16, 18)}
              </g>
            </g>
            {/* Ноги прямые, неподвижные */}
            <line x1="-5" y1="22" x2="-5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="5" y1="22" x2="5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }

      /* ══════════ ЙОГА (поза дерева) ══════════ */
      case "yoga": {
        return (
          <>
            <circle cx="0" cy="10" r="24" fill={S.ACCENT} opacity="0"
              style={{ animation: `yoga-aura-${uid} 2.5s ease-in-out ${inf}` }} />
            {head(0, -10)}
            <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Руки над головой */}
            <g transform="translate(0,4)" style={{ animation: `yoga-larm-${uid} 2.5s ease-in-out ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(-10, -18, S.ACCENT)}
            </g>
            <g transform="translate(0,4)" style={{ animation: `yoga-rarm-${uid} 2.5s ease-in-out ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(10, -18, S.ACCENT)}
            </g>
            {/* Левая нога прямая */}
            <line x1="-4" y1="22" x2="-4" y2="52" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Правая нога поднята */}
            <g transform="translate(4,22)" style={{ animation: `yoga-rleg-${uid} 2.5s ease-in-out ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(14, 20, S.ACCENT)}
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ СТАНОВАЯ ТЯГА ══════════ */
      case "deadlift": {
        return (
          <>
            {/* Гриф */}
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"
              style={{ transformOrigin: "0px 0px" }} />
            <circle cx="-28" cy="0" r="7" stroke="#64748b" strokeWidth="2.5" fill="#1e1b4b" />
            <circle cx="28" cy="0" r="7" stroke="#64748b" strokeWidth="2.5" fill="#1e1b4b" />
            <g style={{ animation: `dl-body-${uid} 1.2s ${ease} ${inf}` }}>
              {head(0, -10)}
              <g style={{ animation: `dl-torso-${uid} 1.2s ${ease} ${inf}`, transformOrigin: "0px -2px" }}>
                <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
                <line x1="0" y1="4" x2="-14" y2="14" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
                <line x1="0" y1="4" x2="14" y2="14" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              </g>
              <g transform="translate(-5,22)" style={{ animation: `dl-lleg-${uid} 1.2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(-4, 28)}
              </g>
              <g transform="translate(5,22)" style={{ animation: `dl-rleg-${uid} 1.2s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
                {limb(4, 28)}
              </g>
            </g>
            {floor()}
          </>
        );
      }

      /* ══════════ ПОДТЯГИВАНИЯ ══════════ */
      case "pull-up": {
        return (
          <>
            {/* Турник */}
            <line x1="-36" y1="-42" x2="36" y2="-42" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="-34" y1="-42" x2="-34" y2="-30" stroke="#64748b" strokeWidth="3" />
            <line x1="34" y1="-42" x2="34" y2="-30" stroke="#64748b" strokeWidth="3" />
            <g style={{ animation: `pu2-body-${uid} 1s ${ease} ${inf}` }}>
              {/* Руки держатся */}
              <line x1="-14" y1="-40" x2="-10" y2="-12" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="14" y1="-40" x2="10" y2="-12" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-5" y1="22" x2="-5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="5" y1="22" x2="5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
          </>
        );
      }

      /* ══════════ ЖИМ ЛЁЖА / ГАНТЕЛИ ЛЁЖА ══════════ */
      case "bench-press":
      case "dumbbell-press": {
        return (
          <>
            {/* Скамья */}
            <rect x="-40" y="14" width="80" height="6" rx="3" fill="#334155" />
            <line x1="-32" y1="20" x2="-32" y2="36" stroke="#475569" strokeWidth="3" />
            <line x1="32" y1="20" x2="32" y2="36" stroke="#475569" strokeWidth="3" />
            {/* Гантели */}
            <g style={{ animation: `bp-larm-${uid} 1s ${ease} ${inf}`, transformOrigin: "-20px 10px" }}>
              <line x1="-20" y1="10" x2="-20" y2="-16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-28" y1="-18" x2="-12" y2="-18" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            </g>
            <g style={{ animation: `bp-rarm-${uid} 1s ${ease} ${inf}`, transformOrigin: "20px 10px" }}>
              <line x1="20" y1="10" x2="20" y2="-16" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="12" y1="-18" x2="28" y2="-18" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            </g>
            {/* Тело лёжа */}
            {head(-34, 8)}
            <line x1="-26" y1="12" x2="34" y2="12" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="30" y1="12" x2="26" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="36" y1="12" x2="32" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
          </>
        );
      }

      /* ══════════ ЖИМЫ ПЛЕЧАМИ ══════════ */
      case "dumbbell-shoulder": {
        return (
          <>
            {head(0, -10)}
            <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <g transform="translate(0,4)" style={{ animation: `sp-larm-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="-14" y2="18" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-22" y1="-2" x2="-8" y2="-2" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(0,4)" style={{ animation: `sp-rarm-${uid} 1s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="14" y2="18" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="8" y1="-2" x2="22" y2="-2" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </g>
            <line x1="-5" y1="22" x2="-5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="5" y1="22" x2="5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }

      /* ══════════ СГИБАНИЯ НА БИЦЕПС ══════════ */
      case "dumbbell-curl": {
        return (
          <>
            {head(0, -10)}
            <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <g transform="translate(-5,6)" style={{ animation: `curl-larm-${uid} 0.8s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="-10" y2="20" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-16" y1="18" x2="-4" y2="22" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(5,6)" style={{ animation: `curl-rarm-${uid} 0.8s ${ease} ${inf}`, animationDelay: "0.2s", transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="10" y2="20" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="4" y1="18" x2="16" y2="22" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </g>
            <line x1="-5" y1="22" x2="-7" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="5" y1="22" x2="7" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }

      /* ══════════ ТЯГА ГАНТЕЛИ В НАКЛОНЕ ══════════ */
      case "dumbbell-row": {
        return (
          <>
            {/* Скамья */}
            <rect x="-40" y="10" width="30" height="5" rx="2" fill="#334155" />
            <line x1="-38" y1="15" x2="-38" y2="36" stroke="#475569" strokeWidth="3" />
            {/* Тело в наклоне */}
            {head(-30, -14)}
            <line x1="-24" y1="-6" x2="20" y2="6" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Опорная рука */}
            <line x1="-20" y1="-2" x2="-28" y2="12" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {/* Рабочая рука с гантелью */}
            <g transform="translate(18,4)" style={{ animation: `row-rarm-${uid} 0.9s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              <line x1="0" y1="0" x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="-8" y1="22" x2="8" y2="22" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Ноги */}
            <line x1="18" y1="8" x2="14" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="24" y1="8" x2="32" y2="36" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }

      /* ══════════ БРУСЬЯ ══════════ */
      case "dip": {
        return (
          <>
            {/* Брусья */}
            <line x1="-32" y1="-28" x2="-14" y2="-28" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="14" y1="-28" x2="32" y2="-28" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <line x1="-32" y1="-28" x2="-32" y2="36" stroke="#64748b" strokeWidth="3" />
            <line x1="32" y1="-28" x2="32" y2="36" stroke="#64748b" strokeWidth="3" />
            <g style={{ animation: `dip-body-${uid} 0.9s ${ease} ${inf}` }}>
              {head(0, -10)}
              <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Руки на брусьях */}
              <line x1="-14" y1="-28" x2="-8" y2="4" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="14" y1="-28" x2="8" y2="4" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              {/* Ноги скрещены или прямые */}
              <line x1="-4" y1="22" x2="-4" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
              <line x1="4" y1="22" x2="4" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            </g>
          </>
        );
      }

      /* ══════════ DEFAULT ══════════ */
      default: {
        return (
          <>
            <circle cx="0" cy="0" r="32" fill={S.ACCENT} opacity="0"
              style={{ animation: `default-pulse-${uid} 1s ease-in-out ${inf}` }} />
            {head(0, -10)}
            <line x1="0" y1={-2} x2="0" y2="22" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <g transform="translate(0,4)" style={{ animation: `jj-larm-${uid} 0.8s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(-14, 16)}
            </g>
            <g transform="translate(0,4)" style={{ animation: `jj-rarm-${uid} 0.8s ${ease} ${inf}`, transformOrigin: "0px 0px" }}>
              {limb(14, 16)}
            </g>
            <line x1="-5" y1="22" x2="-5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            <line x1="5" y1="22" x2="5" y2="50" stroke={S.COLOR} strokeWidth={S.SW} strokeLinecap="round" />
            {floor()}
          </>
        );
      }
    }
  };

  // Центровка анимации зависит от типа
  const isFloorExercise = ["crunch","leg-raise","bicycle","bench-press","dumbbell-press"].includes(exerciseType);
  const isHanging = ["pull-up"].includes(exerciseType);
  const translateY = isFloorExercise ? 10 : isHanging ? 70 : 52;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-4 shadow-lg select-none">
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div className="text-center mb-2 text-xs font-semibold text-purple-300 tracking-widest uppercase">Техника выполнения</div>
      <div className="relative flex items-center justify-center" style={{ height: 140 }}>
        <svg
          viewBox="0 0 100 120"
          width="140"
          height="140"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <g transform={`translate(50,${translateY})`}>
            {renderFigure()}
          </g>
        </svg>
      </div>
      {title && (
        <div className="text-center mt-1 text-xs text-slate-400 truncate">{title}</div>
      )}
    </div>
  );
}

export default ExerciseAnimation;

