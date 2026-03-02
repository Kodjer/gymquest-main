// src/components/AnimatedQuestList.tsx
import { ReactNode } from "react";

interface AnimatedQuestListProps {
  children: ReactNode;
}

export function AnimatedQuestList({ children }: AnimatedQuestListProps) {
  return <ul className="space-y-2">{children}</ul>;
}

interface AnimatedQuestItemProps {
  children: ReactNode;
  index: number;
  isCompleted?: boolean;
}

export function AnimatedQuestItem({
  children,
  index,
  isCompleted = false,
}: AnimatedQuestItemProps) {
  return (
    <li
      className={`
        quest-item transform transition-all duration-300 ease-out
        animate-in slide-in-from-left-2 fade-in-0
        ${
          isCompleted
            ? "opacity-70 scale-95"
            : "hover:scale-102 hover:shadow-md"
        }
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      {children}
    </li>
  );
}

// РљРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ Р°РЅРёРјРёСЂРѕРІР°РЅРЅРѕР№ СЃС‚Р°С‚РёСЃС‚РёРєРё
interface AnimatedStatProps {
  value: number | string;
  label: string;
  delay?: number;
  color?: "green" | "blue" | "purple" | "orange";
}

export function AnimatedStat({
  value,
  label,
  delay = 0,
  color = "blue",
}: AnimatedStatProps) {
  const colorClasses = {
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
  };

  return (
    <div
      className="text-center animate-in zoom-in-95 fade-in-0"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "400ms",
        animationFillMode: "backwards",
      }}
    >
      <div
        className={`text-2xl font-bold ${colorClasses[color]} transition-all duration-300 hover:scale-110`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

// РљРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ РїР»Р°РІРЅРѕР№ Р·Р°РіСЂСѓР·РєРё РєРѕРЅС‚РµРЅС‚Р°
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
  const directionClasses = {
    up: "slide-in-from-bottom-4",
    down: "slide-in-from-top-4",
    left: "slide-in-from-right-4",
    right: "slide-in-from-left-4",
  };

  return (
    <div
      className={`animate-in ${directionClasses[direction]} fade-in-0`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "500ms",
        animationFillMode: "backwards",
      }}
    >
      {children}
    </div>
  );
}

// SlideIn компонент для плавного появления элементов
interface SlideInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function SlideIn({ children, delay = 0, direction = "up" }: SlideInProps) {
  const directionClasses = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
  };

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 1,
        transform: 'translateY(0)',
      }}
    >
      {children}
    </div>
  );
}

// РљРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ Р°РЅРёРјР°С†РёРё СЃС‡РµС‚С‡РёРєР°
interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
}

export function CountUp({ end, duration = 1000, suffix = "" }: CountUpProps) {
  return (
    <span className="inline-block tabular-nums">
      {end}
      {suffix}
    </span>
  );
}
