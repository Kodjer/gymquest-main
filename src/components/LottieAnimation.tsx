// src/components/LottieAnimation.tsx
// Компонент для отображения Lottie-анимаций упражнений из LottieFiles
// Библиотека: @lottiefiles/dotlottie-react | loop = true | autoplay = true
// Поддерживает оба формата: .lottie (dotLottie) и .json (Lottie JSON)
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Shorthand for dotLottie CDN base
const CDN = "https://assets-v2.lottiefiles.com/a";

// ─── 23 уникальных анимации, каждое упражнение своя ──────────────────────────
// Источники:
//   Dinh Bui Xuan (buixuandinh) — https://lottiefiles.com/buixuandinh
//   Blinix Solutions              — https://lottiefiles.com/blinixsolutions
//   Seyfi Cem Baskin              — https://lottiefiles.com/seyfi
//   UX animation                  — https://lottiefiles.com/uxanimation
//   Abdul Latif (animoox)         — https://lottiefiles.com/animoox
// ─────────────────────────────────────────────────────────────────────────────

// Все 23 анимации — уникальные, без дублей
const A = {
  // 1. Military Push Ups — buixuandinh | military-push-ups-sFmjfnsBQ9
  pushup:        `${CDN}/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.lottie`,
  // 2. Squat Reach — buixuandinh | squat-reach-Dp1w6IjOlQ
  squat:         `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,
  // 3. T-Plank — buixuandinh | t-plank-exercise-g5qVU6RPYY
  plank:         `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,
  // 4. Burpee and Jump — buixuandinh | burpee-and-jump-exercise-gCOcxxnr1X
  burpee:        `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
  // 5. Jumping Jack — buixuandinh | jumping-jack-Q3NN7cRkd4
  jumpjack:      `${CDN}/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie`,
  // 6. Lunge — buixuandinh | lunge-Ls3pMlE0a0
  lunge:         `${CDN}/8c3bfbda-116a-11ee-ae27-27c841c68b90/3wj4p7PlV4.lottie`,
  // 7. Cobras yoga — buixuandinh | cobras-w0bL4N81bN
  cobra:         `${CDN}/21be1e42-1173-11ee-83c0-4322d3669e57/hSoYnF3LmV.lottie`,
  // 8. Girl meditating — UX animation | girl-meditating-zLiNbiIV3x
  meditate:      `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  // 9. Running on Treadmill — Seyfi | running-on-treadmill-1nArjWYiZd
  run:           `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  // 10. Rope skipping — Abdul Latif | rope-skipping-TAsniEhBmZ
  rope:          `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  // 11. Pull ups — Blinix | pull-ups-93dmz6fbeo
  pullup:        `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  // 12. Exercising pull ups — Abdul Latif | exercising-pull-ups-bVFqUonWxD
  latpull:       `${CDN}/195d539a-67ee-11ee-92cb-8f7535fbfcee/ryVZoc6Fjl.lottie`,
  // 13. Barbell curl — Blinix | barbell-curl-FdoluIDcW1
  bicep:         `${CDN}/0d669746-8548-11ee-8617-cb4146fff4d0/ek7JbEuLXm.lottie`,
  // 14. Triceps Push down — Blinix | triceps-push-down-JRTryIVfIA
  tricep:        `${CDN}/65928b78-855c-11ee-9196-efdceffa963b/TV0n1P9yJk.lottie`,
  // 15. Deadlifts — Blinix | deadlifts-exercise-DSBGziW6Us
  deadlift:      `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,
  // 16. Wide arm push-up — buixuandinh | wide-arm-push-up-KD96z4DT4Y
  benchpress:    `${CDN}/333f4f4e-1171-11ee-aa03-23dee1fbdb3c/ReXNkakRwh.lottie`,
  // 17. Staggered push-ups — buixuandinh | staggered-push-ups-zgWfOIvx3C
  dips:          `${CDN}/d0bb8b5c-1171-11ee-bc50-032379eea90d/qXxM0Yd790.lottie`,
  // 18. Frog Press — buixuandinh | frog-press-LqkyGCKGpu
  shoulder:      `${CDN}/2d66a188-116e-11ee-94ed-c7f98f54e189/xj6SSR2eJX.lottie`,
  // 19. Press up position toe tap — buixuandinh | press-up-postion-toe-tap-KunqnEdK18
  climber:       `${CDN}/7e30d732-1182-11ee-a920-b3627aa227e0/7tujEvB2wt.lottie`,
  // 20. Split Jump Exercise — buixuandinh | split-jump-exercise-AHHpx1bumx
  highknee:      `${CDN}/dc732190-1189-11ee-a70e-ab45a48260ad/ZROBPAI55W.lottie`,
  // 21. Step Up On Chair — buixuandinh | step-up-on-chair-zcvfCJwhkF
  legext:        `${CDN}/8c2fd882-116a-11ee-ae26-37d18dd2eef5/HuhwaJMuEx.lottie`,
  // 22. Inchworm — buixuandinh | inchworm-oMKbWGAaDD
  cablerow:      `${CDN}/8c27d682-116a-11ee-ae23-838ae461b028/yXjVtxnIso.lottie`,
  // 23. Reverse Crunches — buixuandinh | reverse-crunches-79P2FMTS7Z
  crunch:        `${CDN}/8c2ca306-116a-11ee-ae25-1fdd7969ba2e/jiKqqB91JX.lottie`,
};

const EXERCISE_ANIMATION_URLS: Record<string, string> = {
  // ── Отжимания ──────────────────────────────────────────────────────────────
  "push-up":      A.pushup,
  "pushup":       A.pushup,
  "отжимани":     A.pushup,

  // ── Приседания ─────────────────────────────────────────────────────────────
  "squat":        A.squat,
  "приседани":    A.squat,

  // ── Планка ─────────────────────────────────────────────────────────────────
  "plank":        A.plank,
  "планк":        A.plank,

  // ── Бёрпи ──────────────────────────────────────────────────────────────────
  "burpee":       A.burpee,
  "бёрпи":        A.burpee,
  "берпи":        A.burpee,

  // ── Джампинг Джек ──────────────────────────────────────────────────────────
  "jumping jack": A.jumpjack,
  "jumping-jack": A.jumpjack,
  "jumpingjack":  A.jumpjack,
  "джампинг":     A.jumpjack,

  // ── Выпады ─────────────────────────────────────────────────────────────────
  "lunge":        A.lunge,
  "выпад":        A.lunge,

  // ── Растяжка / Йога (кобра) ────────────────────────────────────────────────
  "stretch":      A.cobra,
  "растяжк":      A.cobra,
  "cobra":        A.cobra,
  "кобра":        A.cobra,
  "yoga":         A.cobra,
  "йога":         A.cobra,  "пилатес":      A.cobra,
  "шпагат":       A.cobra,
  "гибкост":      A.cobra,
  // ── Медитация ──────────────────────────────────────────────────────────────
  "meditat":      A.meditate,
  "медитац":      A.meditate,
  "breath":       A.meditate,
  "дыхан":        A.meditate,

  // ── Бег / Кардио / Беговая дорожка ────────────────────────────────────────
  "run":          A.run,
  "cardio":       A.run,
  "treadmill":    A.run,
  "hiit":         A.burpee,
  "sprint":       A.run,
  "бег":          A.run,
  "кардио":       A.run,
  "дорожк":       A.run,
  "пробежк":      A.run,
  "пробег":       A.run,
  "спринт":       A.run,
  "ходьб":        A.run,
  "ходить":       A.run,

  // ── Скакалка ───────────────────────────────────────────────────────────────
  "jump rope":    A.rope,
  "jump-rope":    A.rope,
  "jumprope":     A.rope,
  "rope":         A.rope,
  "скакалк":      A.rope,
  "прыжки":       A.rope,

  // ── Подтягивания ───────────────────────────────────────────────────────────
  "pull-up":      A.pullup,
  "pullup":       A.pullup,
  "chin-up":      A.pullup,
  "подтягива":    A.pullup,

  // ── Тяга верхняя / Lat pulldown ────────────────────────────────────────────
  "lat pull":     A.latpull,
  "lat-pull":     A.latpull,
  "тяга верхн":   A.latpull,
  "верхняя тяг":  A.latpull,

  // ── Бицепс ─────────────────────────────────────────────────────────────────
  "bicep":        A.bicep,
  "curl":         A.bicep,
  "бицепс":       A.bicep,  "сгибани":      A.bicep,
  "молотков":     A.bicep,
  "гантел":       A.bicep,
  // ── Трицепс ────────────────────────────────────────────────────────────────
  "tricep":       A.tricep,
  "трицепс":      A.tricep,  "разгибани рук": A.tricep,
  "french":       A.tricep,
  // ── Становая тяга ──────────────────────────────────────────────────────────
  "deadlift":     A.deadlift,
  "становая":     A.deadlift,  "румынск":      A.deadlift,
  // ── Жим от груди / Bench press ─────────────────────────────────────────────
  "bench":        A.benchpress,
  "жим лёж":      A.benchpress,
  "жим лежа":     A.benchpress,
  "chest press":  A.benchpress,  "разводк":      A.benchpress,
  "флай":         A.benchpress,
  // ── Брусья / Dips ──────────────────────────────────────────────────────────
  "dip":          A.dips,
  "брусь":        A.dips,

  // ── Жим плечами / Shoulder press ──────────────────────────────────────────
  "shoulder":     A.shoulder,
  "плеч":         A.shoulder,
  "press":        A.shoulder,
  "жим":          A.shoulder,

  // ── Скалолаз / Mountain climber ────────────────────────────────────────────
  "mountain":     A.climber,
  "climber":      A.climber,
  "скалолаз":     A.climber,

  // ── Высокие колени / High knees ────────────────────────────────────────────
  "high knee":    A.highknee,
  "high-knee":    A.highknee,
  "колен":        A.highknee,

  // ── Разгибания ног / Leg extension ─────────────────────────────────────────
  "leg ext":      A.legext,
  "разгибани":    A.legext,
  "step up":      A.legext,
  "ступеньк":     A.legext,

  // ── Тяга нижняя / Cable row ────────────────────────────────────────────────
  "cable row":    A.cablerow,
  "тяга нижн":    A.cablerow,
  "нижняя тяг":   A.cablerow,  "тяга к поясу": A.cablerow,
  "горизонт":     A.cablerow,  "inchworm":     A.cablerow,

  // ── Пресс / Кранчи ─────────────────────────────────────────────────────────
  "crunch":       A.crunch,
  "abs":          A.crunch,
  "пресс":        A.crunch,
  "кранч":        A.crunch,
  "reverse":      A.crunch,
  // ── Общая тяга (любая неопознанная) ─────────────────────────────────────
  "тяга":         A.deadlift,
  // ── Дефолт ─────────────────────────────────────────────────────────────────
  "default":      A.burpee,
};

/** Возвращает URL анимации по названию упражнения */
function getLottieUrl(title: string): string {
  const lower = title.toLowerCase();
  for (const [keyword, url] of Object.entries(EXERCISE_ANIMATION_URLS)) {
    if (keyword !== "default" && lower.includes(keyword)) return url;
  }
  return EXERCISE_ANIMATION_URLS["default"];
}

// ─── Пропсы ──────────────────────────────────────────────────────────────────
interface LottieAnimationProps {
  /** Название упражнения — используется для автовыбора URL */
  title: string;
  /** Переопределить URL вручную (например, для конкретного квеста) */
  url?: string;
  /** Размер контейнера, по умолчанию "md" */
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: 140,
  md: 200,
  lg: 260,
};

// ─── Компонент ───────────────────────────────────────────────────────────────
import { useAppTheme } from "../lib/ThemeContext";

export function LottieAnimation({ title, url, size = "md" }: LottieAnimationProps) {
  const src = url ?? getLottieUrl(title);
  const maxH = SIZE_MAP[size];
  const { colors } = useAppTheme();

  return (
    <div
      className={`rounded-xl overflow-hidden ${colors.cardBg} flex items-center justify-center`}
      style={{ height: maxH, width: "100%" }}
      aria-label={`Анимация упражнения: ${title}`}
    >
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: maxH, height: maxH }}
      />
    </div>
  );
}
