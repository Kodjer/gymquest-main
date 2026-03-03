// src/components/LottieAnimation.tsx
// Компонент для отображения Lottie-анимаций упражнений из LottieFiles
// Библиотека: @lottiefiles/dotlottie-react | loop = true | autoplay = true
// Поддерживает оба формата: .lottie (dotLottie) и .json (Lottie JSON)
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Shorthand for dotLottie CDN base
const CDN = "https://assets-v2.lottiefiles.com/a";

// ─── 29 уникальных анимации, каждое упражнение своя ──────────────────────────
// Источники:
//   Dinh Bui Xuan (buixuandinh) — https://lottiefiles.com/buixuandinh
//   Blinix Solutions              — https://lottiefiles.com/blinixsolutions
//   Seyfi Cem Baskin              — https://lottiefiles.com/seyfi
//   UX animation                  — https://lottiefiles.com/uxanimation
//   Abdul Latif (animoox)         — https://lottiefiles.com/animoox
//   Musa Adanur                   — https://lottiefiles.com/musaadanur
//   Priyanshu Rijhwani            — https://lottiefiles.com/priyanshurijhwani
//   Agent Smith                   — https://lottiefiles.com/yk36yojcr9mycqgj
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
  // 16. Push Up — Blinix | push-up-ZWIJ5vETTW
  //     Тот же автор и стиль что deadlift/bicep/leg-press — тело горизонтально, руки работают
  benchpress:    `${CDN}/d83e15b6-855c-11ee-a169-f710d4c5c628/dTFhz4lz7U.lottie`,
  // 17. Staggered push-ups — buixuandinh | staggered-push-ups-zgWfOIvx3C
  dips:          `${CDN}/d0bb8b5c-1171-11ee-bc50-032379eea90d/qXxM0Yd790.lottie`,
  // 18. Double Arm Clean and Press Barbell — buixuandinh | double-arm-clean-and-press-barbell-wpiqpl8RKn
  shoulder:      `${CDN}/7e29fad4-1182-11ee-a91b-0f315e1d0acd/2MbAZkcu8V.lottie`,
  // 19. Press up position toe tap — buixuandinh | press-up-postion-toe-tap-KunqnEdK18
  climber:       `${CDN}/7e30d732-1182-11ee-a920-b3627aa227e0/7tujEvB2wt.lottie`,
  // 20. Split Jump Exercise — buixuandinh | split-jump-exercise-AHHpx1bumx
  highknee:      `${CDN}/dc732190-1189-11ee-a70e-ab45a48260ad/ZROBPAI55W.lottie`,
  // 21. Step Up On Chair — buixuandinh | step-up-on-chair-zcvfCJwhkF
  legext:        `${CDN}/8c2fd882-116a-11ee-ae26-37d18dd2eef5/HuhwaJMuEx.lottie`,
  // 22. Back Exercise (dumbbell bent-over row) — Sanket Birajdar | back-excercise-gjCCOO2dKZ
  cablerow:      `${CDN}/639a734a-117a-11ee-9abb-bfa1912dce07/Pponl1kAzz.lottie`,
  // 23. Reverse Crunches — buixuandinh | reverse-crunches-79P2FMTS7Z
  crunch:        `${CDN}/8c2ca306-116a-11ee-ae25-1fdd7969ba2e/jiKqqB91JX.lottie`,
  // 24. Rope skipping (with person) — Abdul Latif | rope-skipping-4upnEw5J9G
  ropeWithPerson: `${CDN}/aa7f6818-67ee-11ee-9683-e71567e2da28/wAk0uRxN2O.lottie`,
  // 25. Walking and drinking — Abdul Latif | walking-and-drinking-PCGpQbbADU
  drinkWater:    `${CDN}/74a4a6a4-b203-11ee-ba3a-87d2cc23af2d/yWuNkUgb4z.lottie`,
  // 26. Sleeping — DU AMV | sleeping-duJHnWdTuw
  sleep:         `${CDN}/0ee4b980-41ae-11f0-b446-2f5900a963ac/icVA3BqeE0.lottie`,
  // 27. Cycling — Priyanshu Rijhwani | cycling-yDIsbK5QBB
  cycling:       `${CDN}/fc4b7bae-117d-11ee-ab45-6319e358fb46/I0hv6QOGXo.lottie`,
  // 28. Swimming — Musa Adanur | swimming-2RXrcVUMFx
  swimming:      `${CDN}/462ac92a-117c-11ee-9ee7-df0f5eb780fa/XdsjHLWcUG.lottie`,
  // 29. Happy Woman Eating — Agent Smith | happy-woman-eating-N7pTW13Nqb
  eating:        `${CDN}/6b082d9c-1185-11ee-ab04-237900be7e3b/H5bGG12ID4.lottie`,
  // 30. Overhead Press — Arka Bhowmik | weight-lifting-kfzUYCND6B
  //     Мужик поднимает штангу над головой — жим стоя/над головой
  overheadpress: `${CDN}/ec5c7e0c-1185-11ee-8890-238802282f9a/nf1lCTEjYl.lottie`,
  // 31. Leg Press — Blinix | leg-press-IirCP8idhZ
  //     Жим ногами на тренажёре — ближайшая анимация для подъёмов / ног
  legpress:      `${CDN}/b24f11bc-85e7-11ee-98ac-339ebd655a22/hRkeOm5JUn.lottie`,
  // 32. Woman using dumbbells — bezi | woman-using-dumbbells-hJlLbE6XHm
  lateralRaise:  `${CDN}/2dc70adc-43af-11ee-838b-9fd039685ce8/nwxNoiHXLc.lottie`,
  // 33. Tricep Exercises By Women — So G / LeverageStudio | tricep-exercises-by-women-flVL6jDABJ
  //     Трицепс-упражнения s гантелёй (kickback-тип) — специфично
  tricepKickback:`${CDN}/64ba5aa2-1165-11ee-a736-3bdf05fb3fd9/YApKEMJ4qO.lottie`,
  // 34. Woman using dumbbells — bezi | woman-using-dumbbells-hJlLbE6XHm
  //     Женщина с гантелями — наиболее подходящее для разведения лёжа
  dumbbellFly:   `${CDN}/2dc70adc-43af-11ee-838b-9fd039685ce8/nwxNoiHXLc.lottie`,
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
  "гибкост":      A.cobra,  // ── Вода / Водный баланс ─────────────────────────────────────
  "водный балан":  A.drinkWater,
  "водной балан":  A.drinkWater,
  "водный":        A.drinkWater,
  "выпей вод":      A.drinkWater,
  "drinking":      A.drinkWater,
  "water":         A.drinkWater,
  "вода":          A.drinkWater,
  "воду":          A.drinkWater,

  // ── Сон / Здоровый сон ────────────────────────────────
  "здоровый сон":    A.sleep,
  "сон":           A.sleep,
  "спать":         A.sleep,
  "sleep":         A.sleep,
  "ночной":        A.sleep,
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
  "велопрогулк":  A.cycling,  // велопрогулка — раньше чем общий "прогулк"
  "прогулк":      A.run,
  "walking":      A.run,

  // ── Велосипед / Велотренажер ────────────────────────────────────────────────
  "вело":         A.cycling,
  "cycling":      A.cycling,
  "bicycle":      A.cycling,
  "bike":         A.cycling,

  // ── Плавание ───────────────────────────────────────────────────────────────
  "плав":         A.swimming,
  "swimming":     A.swimming,

  // ── Гребля / Гребной тренажер ──────────────────────────────────────────────
  "гребл":        A.cablerow,
  "гребн":        A.cablerow,
  "rowing":       A.cablerow,

  // ── Эллипс / Эллиптический тренажер ──────────────────────────────────────
  "эллип":        A.run,
  "elliptic":     A.run,

  // ── Степпер ────────────────────────────────────────────────────────────────
  "степп":        A.legext,

  // ── Лестница / Stair climber ───────────────────────────────────────────────
  "лестниц":      A.climber,

  // ── Табата ─────────────────────────────────────────────────────────────────
  "табат":        A.burpee,

  // ── Еда / Питание / Завтрак ────────────────────────────────────────────────
  "завтрак":      A.eating,
  "питани":       A.eating,
  "сахар":        A.eating,
  "детокс":       A.eating,
  "еда":          A.eating,
  "eating":       A.eating,
  "food":         A.eating,

  // ── Отдых / Здоровье / День здоровья ──────────────────────────────────────
  "отдых":        A.meditate,
  "здоровь":      A.meditate,

  // ── Скакалка ──────────────────────────────────────────────────────
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

  // ── Гантели — специфичные правила (ОБЯЗАТЕЛЬНО до общих `жим`, `тяга`!) ───
  // Жим лёжа / на наклонной: "Жим гантелей лежа", "Жим гантелей на наклонной скамье"
  "гантелей лежа":      A.dumbbellFly,
  "гантелей на наклон": A.dumbbellFly,
  "наклонной скамь":    A.dumbbellFly,
  // Разведение / разводка гантелей лёжа: женщина с гантелями
  "разведение гантел":  A.dumbbellFly,
  "разводка гантел":    A.dumbbellFly,
  // Жим гантелей стоя / над головой
  "гантелей стоя":      A.shoulder,
  // Жим гантелей над головой
  "гантелей над гол":   A.shoulder,
  // Отведение назад (kickback): специфичная трицепс-анимация
  "отведение назад":    A.tricepKickback,
  // Подъёмы через стороны (lateral raise): специфичная анимация
  "через сторон":       A.lateralRaise,
  "подъёмы гантелей":   A.lateralRaise,
  "подъемы гантелей":   A.lateralRaise,
  // Тяга гантели в наклоне (one-arm row): "Тяга гантели в наклоне"
  "тяга гантел":        A.cablerow,
  // Шраги: "Шраги с гантелями"
  "шраг":               A.shoulder,
  // Подъёмы на носки: "Подъёмы на носки с гантелями"
  "носки":              A.legpress,
  // Любое упражнение с гантелями (catch-all — ПОСЛЕ всех специфичных!)
  "гантел":             A.dumbbellFly,

  // ── Бицепс ─────────────────────────────────────────────────────────────────
  "bicep":        A.bicep,
  "curl":         A.bicep,
  "бицепс":       A.bicep,  "сгибани":      A.bicep,
  "молотков":     A.bicep,
  // "гантел" убран — теперь не перехватывает все упражнения с гантелями!
  // ── Трицепс ────────────────────────────────────────────────────────────────
  "tricep":       A.tricep,
  "трицепс":      A.tricep,  "разгибани рук": A.tricep,
  "french":       A.tricep,
  // ── Становая тяга / Гиперэкстензия ────────────────────────────────────────
  "deadlift":     A.deadlift,
  "становая":     A.deadlift,  "румынск":      A.deadlift,
  "гиперэкст":    A.deadlift,
  "hyperext":     A.deadlift,
  // ── Жим от груди / Bench press ─────────────────────────────────────────────
  "bench":        A.benchpress,
  "жим лёж":      A.benchpress,
  "жим лежа":     A.benchpress,
  "chest press":  A.benchpress,
  // флай/разведение/сведение — это упражнения с гантелями/кабелями, не отжимания
  "разводк":      A.dumbbellFly,
  "флай":         A.dumbbellFly,
  "сведени":      A.dumbbellFly,
  "разведени":    A.dumbbellFly,
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
