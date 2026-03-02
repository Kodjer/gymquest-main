// src/components/LottieAnimation.tsx
// Компонент для отображения Lottie-анимаций упражнений из LottieFiles
// Библиотека: lottie-react | loop = true | speed = 1.0
"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

// ─── Таблица упражнений → Lottie JSON URL ────────────────────────────────────
// Все анимации бесплатны по лицензии Lottie Simple License (LottieFiles.com)
//
// Пример для отжиманий:
//   «Military Push Ups» by Dinh Bui Xuan
//   https://lottiefiles.com/free-animation/military-push-ups-sFmjfnsBQ9
//   JSON: https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json
//
// Чтобы добавить свою анимацию:
//   1. Найди бесплатную анимацию на https://lottiefiles.com
//   2. Скопируй JSON-ссылку (кнопка «Copy JSON URL» или используй lottie.host)
//   3. Добавь строку ниже: "ключевое слово": "https://lottie.host/…/animation.json"
// ─────────────────────────────────────────────────────────────────────────────

const EXERCISE_ANIMATION_URLS: Record<string, string> = {
  // Отжимания — главный пример из задания
  "push-up":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "pushup":    "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "отжимани":  "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Приседания
  "squat":     "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "приседани": "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Планка
  "plank":     "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "планк":     "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Бег / кардио
  "run":       "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "cardio":    "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "бег":       "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "кардио":    "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Медитация / йога
  "meditat":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "yoga":      "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "медитац":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "йога":      "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Растяжка
  "stretch":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
  "растяжк":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",

  // Дефолт — показывается для всех остальных упражнений
  "default":   "https://lottie.host/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.json",
};

/** Возвращает URL Lottie JSON по названию упражнения */
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
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const src = url ?? getLottieUrl(title);
  const maxH = SIZE_MAP[size];

  // Загрузка JSON по URL
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setAnimationData(null);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: object) => {
        if (!cancelled) {
          setAnimationData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [src]);

  // Установка speed = 1.0 после загрузки анимации
  useEffect(() => {
    if (lottieRef.current && animationData) {
      lottieRef.current.setSpeed(1.0); // speed = 1.0
    }
  }, [animationData]);

  // ── Состояние загрузки ──
  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-900"
        style={{ height: maxH }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400" />
      </div>
    );
  }

  // ── Ошибка загрузки ──
  if (error || !animationData) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-900"
        style={{ height: maxH }}
      >
        <p className="text-gray-500 text-sm">Анимация временно недоступна</p>
      </div>
    );
  }

  // ── Lottie-плеер ──
  return (
    <div className="rounded-xl overflow-hidden bg-gray-900">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}      // loop = true
        autoplay={true}
        style={{ width: "100%", height: "auto", maxHeight: maxH }}
        aria-label={`Анимация упражнения: ${title}`}
      />
    </div>
  );
}
