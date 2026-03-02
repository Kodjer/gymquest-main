// src/components/LottieAnimation.tsx
// Компонент для отображения Lottie-анимаций упражнений из LottieFiles
// Библиотека: @lottiefiles/dotlottie-react | loop = true | autoplay = true
// Поддерживает оба формата: .lottie (dotLottie) и .json (Lottie JSON)
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// ─── Таблица упражнений → URL анимации ───────────────────────────────────────
// Все анимации бесплатны по лицензии Lottie Simple License (LottieFiles.com)
//
// Источники:
//   Dinh Bui Xuan (buixuandinh) — https://lottiefiles.com/buixuandinh
//   Blinix Solutions              — https://lottiefiles.com/blinixsolutions
//   Seyfi Cem Baskin              — https://lottiefiles.com/seyfi
//   UX animation                  — https://lottiefiles.com/uxanimation
//   Abdul Latif (animoox)         — https://lottiefiles.com/animoox
//
// URL формат assets-v2.lottiefiles.com/a/{uuid}/{file}.lottie
// ─────────────────────────────────────────────────────────────────────────────

// Shorthand for dotLottie CDN base
const CDN = "https://assets-v2.lottiefiles.com/a";

const EXERCISE_ANIMATION_URLS: Record<string, string> = {
  // ── Отжимания ──────────────────────────────────────────────────────────────
  // «Military Push Ups» by Dinh Bui Xuan
  // https://lottiefiles.com/free-animation/military-push-ups-sFmjfnsBQ9
  "push-up":    "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "pushup":     "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "отжимани":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // ── Приседания ─────────────────────────────────────────────────────────────
  // «Squat Reach» by Dinh Bui Xuan
  // https://lottiefiles.com/free-animation/squat-reach-Dp1w6IjOlQ
  "squat":      `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,
  "приседани":  `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,

  // ── Планка ─────────────────────────────────────────────────────────────────
  // «T Plank Exercise» by Dinh Bui Xuan
  // https://lottiefiles.com/free-animation/t-plank-exercise-g5qVU6RPYY
  "plank":      `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,
  "планк":      `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,

  // ── Бёрпи ──────────────────────────────────────────────────────────────────
  // «Burpee and Jump Exercise» by Dinh Bui Xuan
  // https://lottiefiles.com/free-animation/burpee-and-jump-exercise-gCOcxxnr1X
  "burpee":     `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
  "бёрпи":      `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
  "берпи":      `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,

  // ── Джампинг Джек ──────────────────────────────────────────────────────────
  // «Jumping Jack» by Dinh Bui Xuan
  // https://lottiefiles.com/free-animation/jumping-jack-Q3NN7cRkd4
  "jumping jack":   `${CDN}/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie`,
  "jumping-jack":   `${CDN}/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie`,
  "jumpingjack":    `${CDN}/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie`,
  "джампинг":       `${CDN}/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie`,

  // ── Бег / Кардио ───────────────────────────────────────────────────────────
  // «Running on Treadmill» by Seyfi Cem Baskin
  // https://lottiefiles.com/free-animation/running-on-treadmill-1nArjWYiZd
  "run":        `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  "cardio":     `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  "treadmill":  `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  "бег":        `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  "кардио":     `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,
  "дорожк":     `${CDN}/729bc382-1169-11ee-be24-dbfe3f7649cb/k6kPxU3qW2.lottie`,

  // ── Медитация / Йога ───────────────────────────────────────────────────────
  // «Girl meditating» by UX animation
  // https://lottiefiles.com/free-animation/girl-meditating-zLiNbiIV3x
  "meditat":    `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "yoga":       `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "медитац":    `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "йога":       `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "stretch":    `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "растяжк":    `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "breath":     `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,
  "дыхан":      `${CDN}/54ae97f6-1168-11ee-99ff-cb60ef08a5d2/ZMLvRmYUHx.lottie`,

  // ── Прыжки со скакалкой ────────────────────────────────────────────────────
  // «Rope skipping» by Abdul Latif (animoox)
  // https://lottiefiles.com/free-animation/rope-skipping-TAsniEhBmZ
  "jump rope":  `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  "jump-rope":  `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  "jumprope":   `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  "rope":       `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  "скакалк":    `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,
  "прыжки":     `${CDN}/e21ab200-b203-11ee-9a54-fb36c31614a7/SApuEvqorF.lottie`,

  // ── Высокие колени ─────────────────────────────────────────────────────────
  // Используем бёрпи (похожее кардио-движение)
  "high knee":  `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
  "high-knee":  `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
  "колен":      `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,

  // ── Подтягивания ───────────────────────────────────────────────────────────
  // «Pull ups» by Blinix Solutions
  // https://lottiefiles.com/free-animation/pull-ups-93dmz6fbeo
  "pull-up":    `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "pullup":     `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "chin-up":    `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "подтягива":  `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,

  // ── Тяга верхняя (Lat pulldown) ────────────────────────────────────────────
  // Используем подтягивания (схожее движение)
  "lat pull":   `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "lat-pull":   `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "тяга верхн": `${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,
  "верхняя тяг":`${CDN}/55290dd2-855e-11ee-9223-bf305e6a6858/KJB1rrjdPy.lottie`,

  // ── Брусья (Dips) ──────────────────────────────────────────────────────────
  // Используем анимацию трицепса (схожая нагрузка)
  "dip":        `${CDN}/65928b78-855c-11ee-9196-efdceffa963b/TV0n1P9yJk.lottie`,
  "брусь":      `${CDN}/65928b78-855c-11ee-9196-efdceffa963b/TV0n1P9yJk.lottie`,

  // ── Бицепс (Bicep curl) ────────────────────────────────────────────────────
  // «Barbell curl» by Blinix Solutions
  // https://lottiefiles.com/free-animation/barbell-curl-FdoluIDcW1
  "bicep":      `${CDN}/0d669746-8548-11ee-8617-cb4146fff4d0/ek7JbEuLXm.lottie`,
  "curl":       `${CDN}/0d669746-8548-11ee-8617-cb4146fff4d0/ek7JbEuLXm.lottie`,
  "бицепс":     `${CDN}/0d669746-8548-11ee-8617-cb4146fff4d0/ek7JbEuLXm.lottie`,

  // ── Трицепс ────────────────────────────────────────────────────────────────
  // «Triceps Push down» by Blinix Solutions
  // https://lottiefiles.com/free-animation/triceps-push-down-JRTryIVfIA
  "tricep":     `${CDN}/65928b78-855c-11ee-9196-efdceffa963b/TV0n1P9yJk.lottie`,
  "трицепс":    `${CDN}/65928b78-855c-11ee-9196-efdceffa963b/TV0n1P9yJk.lottie`,

  // ── Становая тяга (Deadlift) ───────────────────────────────────────────────
  // «Deadlifts exercise» by Blinix Solutions
  // https://lottiefiles.com/free-animation/deadlifts-exercise-DSBGziW6Us
  "deadlift":   `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,
  "становая":   `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,

  // ── Тяга нижняя / Тяга в блоке (Cable row) ────────────────────────────────
  // Используем становую тягу (схожее движение спины)
  "cable row":  `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,
  "тяга нижн":  `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,
  "нижняя тяг": `${CDN}/0385574e-85e8-11ee-9852-d7df6eaead2c/aQNp4R2fmk.lottie`,

  // ── Разгибания ног (Leg extension) ─────────────────────────────────────────
  // Используем приседания (нога/квадрицепс)
  "leg ext":    `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,
  "разгибани":  `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,

  // ── Скалолаз (Mountain climber) ────────────────────────────────────────────
  // Используем планку (упражнение в упоре лёжа)
  "mountain":   `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,
  "climber":    `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,
  "скалолаз":   `${CDN}/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie`,

  // ── Выпады (Lunges) ────────────────────────────────────────────────────────
  // Используем приседания (нижняя часть тела)
  "lunge":      `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,
  "выпад":      `${CDN}/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie`,

  // ── Жим от груди (Bench press) ─────────────────────────────────────────────
  // Используем отжимания (жим)
  "bench":      "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "жим":        "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "press":      "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // ── Жим плечами (Shoulder press) ──────────────────────────────────────────
  "shoulder":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "плеч":       "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // ── Дефолт — для всех остальных упражнений ────────────────────────────────
  // «Burpee and Jump Exercise» by Dinh Bui Xuan
  "default":    `${CDN}/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie`,
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
export function LottieAnimation({ title, url, size = "md" }: LottieAnimationProps) {
  const src = url ?? getLottieUrl(title);
  const maxH = SIZE_MAP[size];

  return (
    <div
      className="rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center"
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
