// src/components/MapProgress.tsx
import { useRouter } from "next/router";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAppTheme } from "../lib/ThemeContext";

type MapNode = {
  id: string;
  name: string;
  category: string;
  description: string;
  position: { x: number; y: number };
  color: string;
  icon: string;
  isBoss?: boolean;
  trainingType?: "strength" | "cardio" | "flexibility" | "mixed"; // Тип тренировки
};

// Карты для разных режимов тренировки
const strengthMap: MapNode[] = [
  {
    id: "node-1",
    name: "День 1",
    category: "strength",
    description: "Базовые силовые упражнения",
    position: { x: 50, y: 5 },
    color: "from-green-400 to-emerald-500",
    icon: "1",
    trainingType: "strength",
  },
  {
    id: "node-2",
    name: "День 2",
    category: "strength",
    description: "Увеличиваем нагрузку",
    position: { x: 20, y: 20 },
    color: "from-blue-400 to-cyan-500",
    icon: "2",
    trainingType: "strength",
  },
  {
    id: "node-3",
    name: "День 3",
    category: "strength",
    description: "Тяжелые базовые упражнения",
    position: { x: 75, y: 35 },
    color: "from-orange-400 to-red-500",
    icon: "3",
    trainingType: "strength",
  },
  {
    id: "node-4",
    name: "День 4",
    category: "strength",
    description: "Гипертрофия и масса",
    position: { x: 30, y: 50 },
    color: "from-purple-400 to-pink-500",
    icon: "4",
    trainingType: "strength",
  },
  {
    id: "node-5",
    name: "Силовой вызов",
    category: "strength",
    description: "Испытай свою силу!",
    position: { x: 70, y: 62 },
    color: "from-red-500 to-orange-600",
    icon: "5",
    isBoss: true,
    trainingType: "strength",
  },
  {
    id: "node-6",
    name: "День 6",
    category: "strength",
    description: "Сложные силовые паттерны",
    position: { x: 25, y: 75 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "strength",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "strength",
    description: "Максимальная сила!",
    position: { x: 50, y: 88 },
    color: "from-purple-500 to-pink-600",
    icon: "7",
    isBoss: true,
    trainingType: "strength",
  },
];

const cardioMap: MapNode[] = [
  {
    id: "node-1",
    name: "День 1",
    category: "cardio",
    description: "Начинаем с легкого кардио",
    position: { x: 50, y: 5 },
    color: "from-green-400 to-emerald-500",
    icon: "1",
    trainingType: "cardio",
  },
  {
    id: "node-2",
    name: "День 2",
    category: "cardio",
    description: "Увеличиваем темп",
    position: { x: 20, y: 20 },
    color: "from-blue-400 to-cyan-500",
    icon: "2",
    trainingType: "cardio",
  },
  {
    id: "node-3",
    name: "День 3",
    category: "cardio",
    description: "Интервальные тренировки",
    position: { x: 75, y: 35 },
    color: "from-orange-400 to-red-500",
    icon: "3",
    trainingType: "cardio",
  },
  {
    id: "node-4",
    name: "День 4",
    category: "cardio",
    description: "Высокая интенсивность",
    position: { x: 30, y: 50 },
    color: "from-purple-400 to-pink-500",
    icon: "4",
    trainingType: "cardio",
  },
  {
    id: "node-5",
    name: "День 5",
    category: "cardio",
    description: "Испытай свою выносливость!",
    position: { x: 70, y: 62 },
    color: "from-red-500 to-orange-600",
    icon: "5",
    isBoss: true,
    trainingType: "cardio",
  },
  {
    id: "node-6",
    name: "День 6",
    category: "cardio",
    description: "Экстремальные интервалы",
    position: { x: 25, y: 75 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "cardio",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "cardio",
    description: "Безграничная выносливость!",
    position: { x: 50, y: 88 },
    color: "from-purple-500 to-pink-600",
    icon: "7",
    isBoss: true,
    trainingType: "cardio",
  },
];

const flexibilityMap: MapNode[] = [
  {
    id: "node-1",
    name: "День 1",
    category: "flexibility",
    description: "Базовая растяжка",
    position: { x: 50, y: 5 },
    color: "from-green-400 to-emerald-500",
    icon: "1",
    trainingType: "flexibility",
  },
  {
    id: "node-2",
    name: "День 2",
    category: "flexibility",
    description: "Улучшаем мобильность",
    position: { x: 20, y: 20 },
    color: "from-blue-400 to-cyan-500",
    icon: "2",
    trainingType: "flexibility",
  },
  {
    id: "node-3",
    name: "День 3",
    category: "flexibility",
    description: "Асаны и баланс",
    position: { x: 75, y: 35 },
    color: "from-orange-400 to-red-500",
    icon: "3",
    trainingType: "flexibility",
  },
  {
    id: "node-4",
    name: "День 4",
    category: "flexibility",
    description: "Глубокая гибкость",
    position: { x: 30, y: 50 },
    color: "from-purple-400 to-pink-500",
    icon: "4",
    trainingType: "flexibility",
  },
  {
    id: "node-5",
    name: "День 5",
    category: "flexibility",
    description: "Испытай свою гибкость!",
    position: { x: 70, y: 62 },
    color: "from-red-500 to-orange-600",
    icon: "5",
    isBoss: true,
    trainingType: "flexibility",
  },
  {
    id: "node-6",
    name: "День 6",
    category: "flexibility",
    description: "Сложные асаны",
    position: { x: 25, y: 75 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "flexibility",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "flexibility",
    description: "Совершенная гибкость!",
    position: { x: 50, y: 88 },
    color: "from-purple-500 to-pink-600",
    icon: "7",
    isBoss: true,
    trainingType: "flexibility",
  },
];

const mixedMap: MapNode[] = [
  {
    id: "node-1",
    name: "День 1",
    category: "strength",
    description: "Базовые упражнения для начинающих",
    position: { x: 50, y: 5 },
    color: "from-green-400 to-emerald-500",
    icon: "1",
    trainingType: "mixed",
  },
  {
    id: "node-2",
    name: "День 2",
    category: "strength",
    description: "Увеличиваем нагрузку и технику",
    position: { x: 20, y: 20 },
    color: "from-blue-400 to-cyan-500",
    icon: "2",
    trainingType: "mixed",
  },
  {
    id: "node-3",
    name: "День 3",
    category: "cardio",
    description: "Добавляем выносливость",
    position: { x: 75, y: 35 },
    color: "from-orange-400 to-red-500",
    icon: "3",
    trainingType: "mixed",
  },
  {
    id: "node-4",
    name: "День 4",
    category: "flexibility",
    description: "Растяжка и мобильность",
    position: { x: 30, y: 50 },
    color: "from-purple-400 to-pink-500",
    icon: "4",
    trainingType: "mixed",
  },
  {
    id: "node-5",
    name: "День 5",
    category: "strength",
    description: "Испытай свою силу!",
    position: { x: 70, y: 65 },
    color: "from-red-500 to-orange-600",
    icon: "5",
    isBoss: true,
    trainingType: "mixed",
  },
  {
    id: "node-6",
    name: "День 6",
    category: "cardio",
    description: "Интервальные тренировки высокой интенсивности",
    position: { x: 25, y: 75 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "mixed",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "recovery",
    description: "Комплексное испытание всех навыков!",
    position: { x: 50, y: 88 },
    color: "from-purple-500 to-pink-600",
    icon: "7",
    isBoss: true,
    trainingType: "mixed",
  },
];

// Позиции звёзд для дефолтной темы (статичный массив чтобы не пересчитывать)
const DEFAULT_LIGHT_PARTICLES = [
  { x: '5%',  y: '6%',  s: 3,   o: 0.55, d: 6.2, b: '0s'    },
  { x: '14%', y: '10%', s: 2,   o: 0.45, d: 8.5, b: '-2s'   },
  { x: '24%', y: '4%',  s: 3.5, o: 0.60, d: 7.1, b: '-4s'   },
  { x: '34%', y: '13%', s: 1.5, o: 0.40, d: 9.8, b: '-1s'   },
  { x: '46%', y: '7%',  s: 2.5, o: 0.55, d: 6.8, b: '-6s'   },
  { x: '57%', y: '3%',  s: 2,   o: 0.45, d: 8.0, b: '-3s'   },
  { x: '68%', y: '11%', s: 3,   o: 0.60, d: 7.4, b: '-5s'   },
  { x: '79%', y: '6%',  s: 1.5, o: 0.50, d: 9.2, b: '-0.5s' },
  { x: '89%', y: '4%',  s: 2.5, o: 0.55, d: 6.5, b: '-7s'   },
  { x: '97%', y: '9%',  s: 2,   o: 0.40, d: 8.8, b: '-2.5s' },
  { x: '8%',  y: '22%', s: 2,   o: 0.45, d: 7.6, b: '-1.5s' },
  { x: '19%', y: '28%', s: 3,   o: 0.55, d: 6.3, b: '-4.5s' },
  { x: '37%', y: '20%', s: 1.5, o: 0.40, d: 9.4, b: '-3.5s' },
  { x: '54%', y: '26%', s: 2.5, o: 0.60, d: 7.9, b: '-6.5s' },
  { x: '65%', y: '18%', s: 2,   o: 0.50, d: 8.2, b: '-0.8s' },
  { x: '76%', y: '24%', s: 3.5, o: 0.55, d: 6.7, b: '-5.5s' },
  { x: '87%', y: '19%', s: 1.5, o: 0.45, d: 9.1, b: '-2.8s' },
  { x: '94%', y: '27%', s: 2,   o: 0.55, d: 7.3, b: '-7.5s' },
  { x: '3%',  y: '40%', s: 2.5, o: 0.50, d: 8.6, b: '-1.2s' },
  { x: '21%', y: '45%', s: 2,   o: 0.45, d: 6.9, b: '-5s'   },
  { x: '42%', y: '38%', s: 3,   o: 0.55, d: 7.7, b: '-3.2s' },
  { x: '60%', y: '43%', s: 1.5, o: 0.40, d: 9.5, b: '-6.2s' },
  { x: '73%', y: '37%', s: 2.5, o: 0.60, d: 6.4, b: '-2.2s' },
  { x: '85%', y: '42%', s: 2,   o: 0.50, d: 8.3, b: '-4.8s' },
  { x: '96%', y: '39%', s: 3,   o: 0.55, d: 7.0, b: '-0.4s' },
  { x: '11%', y: '57%', s: 2,   o: 0.45, d: 8.9, b: '-3.8s' },
  { x: '31%', y: '60%', s: 2.5, o: 0.50, d: 6.6, b: '-7.2s' },
  { x: '50%', y: '55%', s: 1.5, o: 0.55, d: 9.3, b: '-1.8s' },
  { x: '70%', y: '59%', s: 3,   o: 0.40, d: 7.5, b: '-5.8s' },
  { x: '91%', y: '56%', s: 2,   o: 0.60, d: 6.1, b: '-4.2s' },
];

const DEFAULT_STARS = [
  { x: '3%',  y: '4%',  s: 2,   o: 0.85, d: 2.1, b: '0s' },
  { x: '12%', y: '8%',  s: 1.5, o: 0.65, d: 3.4, b: '0.8s' },
  { x: '22%', y: '3%',  s: 2.5, o: 0.9,  d: 2.8, b: '1.6s' },
  { x: '31%', y: '11%', s: 1,   o: 0.55, d: 4.1, b: '2.4s' },
  { x: '45%', y: '6%',  s: 2,   o: 0.8,  d: 1.9, b: '0.3s' },
  { x: '58%', y: '2%',  s: 1.5, o: 0.5,  d: 3.7, b: '1.1s' },
  { x: '67%', y: '9%',  s: 2.5, o: 0.75, d: 2.3, b: '1.9s' },
  { x: '78%', y: '5%',  s: 1,   o: 0.7,  d: 4.6, b: '2.7s' },
  { x: '88%', y: '3%',  s: 2,   o: 0.9,  d: 2.0, b: '0.5s' },
  { x: '95%', y: '7%',  s: 1.5, o: 0.6,  d: 3.2, b: '1.3s' },
  { x: '7%',  y: '18%', s: 1,   o: 0.45, d: 5.1, b: '2.1s' },
  { x: '17%', y: '23%', s: 2,   o: 0.65, d: 2.6, b: '0.7s' },
  { x: '38%', y: '19%', s: 1.5, o: 0.75, d: 3.9, b: '1.5s' },
  { x: '52%', y: '25%', s: 1,   o: 0.55, d: 2.4, b: '2.3s' },
  { x: '63%', y: '17%', s: 2.5, o: 0.85, d: 1.8, b: '0.1s' },
  { x: '74%', y: '22%', s: 1,   o: 0.45, d: 4.3, b: '0.9s' },
  { x: '84%', y: '15%', s: 2,   o: 0.7,  d: 3.0, b: '1.7s' },
  { x: '92%', y: '21%', s: 1.5, o: 0.8,  d: 2.7, b: '2.5s' },
  { x: '4%',  y: '38%', s: 1,   o: 0.55, d: 4.8, b: '3.3s' },
  { x: '24%', y: '42%', s: 2,   o: 0.65, d: 2.2, b: '4.1s' },
  { x: '41%', y: '35%', s: 1.5, o: 0.5,  d: 3.5, b: '0.6s' },
  { x: '56%', y: '40%', s: 2,   o: 0.85, d: 2.9, b: '1.4s' },
  { x: '71%', y: '33%', s: 2.5, o: 0.7,  d: 4.0, b: '2.2s' },
  { x: '82%', y: '38%', s: 1,   o: 0.6,  d: 3.3, b: '3.0s' },
  { x: '96%', y: '35%', s: 1.5, o: 0.75, d: 2.5, b: '3.8s' },
  { x: '9%',  y: '55%', s: 1,   o: 0.5,  d: 5.4, b: '4.6s' },
  { x: '28%', y: '58%', s: 2,   o: 0.65, d: 2.1, b: '0.4s' },
  { x: '47%', y: '52%', s: 1.5, o: 0.85, d: 3.1, b: '1.2s' },
  { x: '69%', y: '57%', s: 1,   o: 0.55, d: 4.2, b: '2.0s' },
  { x: '89%', y: '53%', s: 2,   o: 0.75, d: 2.8, b: '2.8s' },
];

type MapProgressProps = {
  quests: Array<{
    id: string;
    nodeId?: string;
    status: string;
    category?: string;
    location?: "home" | "gym" | "both";
    showInAllMode?: boolean; // Показывать ли в режиме "Все"
  }>;
  trainingMode?: "strength" | "cardio" | "flexibility" | "mixed"; // Режим тренировки
  onLocationFilterChange?: (filter: "home" | "gym") => void; // Callback при изменении фильтра
};

export function MapProgress({
  quests,
  trainingMode = "mixed",
  onLocationFilterChange,
}: MapProgressProps) {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [isDark, setIsDark] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // animatedPaths — индекс завершённых патей (запускаются в каскаде при монте или при завершении)
  const [animatedPaths, setAnimatedPaths] = useState<Set<number>>(new Set());
  // noDelayPaths — пути завершённые во время сессии, анимируются сразу (без задержки)
  const [noDelayPaths, setNoDelayPaths] = useState<Set<number>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());
  const prevCompletedRef = useRef<Set<string> | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Восстанавливаем позицию скролла при возврате на карту
  useEffect(() => {
    const saved = sessionStorage.getItem("gymquest_map_scroll");
    if (saved) {
      const y = parseInt(saved, 10);
      // Ждём пока layout устаканится
      setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 200);
    }
    const onScroll = () => {
      sessionStorage.setItem("gymquest_map_scroll", String(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      sessionStorage.setItem("gymquest_map_scroll", String(window.scrollY));
    };
  }, []);

  // Анимируем новые завершённые пати при выполнении квеста
  useEffect(() => {
    const nowCompleted = new Set(
      mapNodes
        .filter((n) => {
          const p = getGlobalNodeProgress(n.id);
          return p.percent === 100 && p.total > 0;
        })
        .map((n) => n.id)
    );
    if (prevCompletedRef.current === null) {
      // Первая загрузка — все уже пройденные пути, кроме последнего, показываем мгновенно.
      // Последний пройденный путь анимируется (чтобы видеть прогресс).
      prevCompletedRef.current = nowCompleted;
      if (nowCompleted.size > 0) {
        const completedIndices = mapNodes.slice(0, -1)
          .map((node, i) => ({ id: node.id, i }))
          .filter(({ id }) => nowCompleted.has(id))
          .map(({ i }) => i);
        // Все кроме последнего — мгновенно
        const instantIndices = completedIndices.slice(0, -1);
        if (instantIndices.length > 0) {
          setAnimatedPaths(new Set(instantIndices));
        }
        // Последний пройденный путь — анимируется сразу без задержки
        const lastIdx = completedIndices[completedIndices.length - 1];
        if (lastIdx !== undefined) {
          setNoDelayPaths(new Set([lastIdx]));
        }
      }
      return;
    }
    const prev = prevCompletedRef.current;
    const newlyDone = [...nowCompleted].filter((id) => !prev.has(id));
    if (newlyDone.length > 0) {
      newlyDone.forEach((id) => {
        const idx = mapNodes.findIndex((n) => n.id === id);
        if (idx !== -1 && idx < mapNodes.length - 1) {
          // Добавляем в noDelayPaths для мгновенной анимации (delay 0)
          setNoDelayPaths((s) => new Set([...s, idx]));
        }
      });
      requestAnimationFrame(() => {
        const el = nodeRefs.current[newlyDone[0]];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      const nextIds = newlyDone
        .map((id) => {
          const idx = mapNodes.findIndex((n) => n.id === id);
          return mapNodes[idx + 1]?.id;
        })
        .filter(Boolean) as string[];
      setTimeout(() => setNewlyUnlocked((s) => new Set([...s, ...nextIds])), 3000);
      setTimeout(() => setNewlyUnlocked((s) => {
        const next = new Set(s); nextIds.forEach((id) => next.delete(id)); return next;
      }), 5000);
    }
    prevCompletedRef.current = nowCompleted;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quests]);

  // Декоративные элементы для каждой темы
  const getThemeDecorations = () => {
    switch (theme) {
      default:
        return [];
    }
  };

  // Инициализация locationFilter из localStorage
  const [locationFilter, setLocationFilter] = useState<"home" | "gym">(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("mapLocationFilter");
        if (saved === "home" || saved === "gym") return saved;
      }
      return "home"; // По умолчанию "Дома"
    }
  );

  // Сохранение в localStorage при изменении
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mapLocationFilter", locationFilter);
    }
  }, [locationFilter]);

  // Выбираем карту в зависимости от режима тренировки
  const mapNodes = useMemo(() => {
    switch (trainingMode) {
      case "strength":
        return strengthMap;
      case "cardio":
        return cardioMap;
      case "flexibility":
        return flexibilityMap;
      default:
        return mixedMap;
    }
  }, [trainingMode]);

  const getNodeProgress = (nodeId: string) => {
    // Сначала проверяем ГЛОБАЛЬНЫЙ прогресс - если день выполнен в любой локации, то он выполнен везде
    const globalProgress = getGlobalNodeProgress(nodeId);
    if (globalProgress.percent === 100) {
      return { completed: 1, total: 1, percent: 100 };
    }

    // Показываем прогресс текущей локации
    let nodeQuests = quests.filter((q) => q.nodeId === nodeId);

    nodeQuests = nodeQuests.filter((q) => {
      if (locationFilter === "home") return q.location === "home";
      if (locationFilter === "gym")  return q.location === "gym";
      return true;
    });

    if (nodeQuests.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = nodeQuests.filter((q) => q.status === "done").length;
    return {
      completed,
      total: nodeQuests.length,
      percent: Math.round((completed / nodeQuests.length) * 100),
    };
  };

  // Получить ОБЩИЙ прогресс ноды (без фильтра по локации) для разблокировки
  const getGlobalNodeProgress = (nodeId: string) => {
    // Считаем прогресс по ВСЕМ квестам ноды (и home, и gym)
    const nodeQuests = quests.filter((q) => q.nodeId === nodeId);
    if (nodeQuests.length === 0) return { completed: 0, total: 0, percent: 0 };
    
    // Группируем квесты по локации и проверяем завершение каждой группы
    const homeQuests = nodeQuests.filter((q) => q.location === "home");
    const gymQuests = nodeQuests.filter((q) => q.location === "gym");
    
    const homeCompleted = homeQuests.filter((q) => q.status === "done").length;
    const gymCompleted = gymQuests.filter((q) => q.status === "done").length;
    
    // Нода считается завершенной если ВСЕ квесты в ЛЮБОЙ локации выполнены
    const homeComplete = homeQuests.length > 0 && homeCompleted === homeQuests.length;
    const gymComplete = gymQuests.length > 0 && gymCompleted === gymQuests.length;
    
    // Если хотя бы одна локация полностью завершена - 100%
    if (homeComplete || gymComplete) {
      return { completed: 1, total: 1, percent: 100 };
    }
    
    // Иначе показываем максимальный прогресс из двух локаций
    const homePercent = homeQuests.length > 0 ? Math.round((homeCompleted / homeQuests.length) * 100) : 0;
    const gymPercent = gymQuests.length > 0 ? Math.round((gymCompleted / gymQuests.length) * 100) : 0;
    const maxPercent = Math.max(homePercent, gymPercent);
    
    return { completed: maxPercent, total: 100, percent: maxPercent };
  };

  const isNodeUnlocked = (nodeIndex: number) => {
    if (nodeIndex === 0) return true;

    // Проверяем все предыдущие узлы - они должны быть завершены в ЛЮБОЙ локации
    for (let i = 0; i < nodeIndex; i++) {
      const node = mapNodes[i];
      // Используем ГЛОБАЛЬНЫЙ прогресс (без фильтра по локации)
      const progress = getGlobalNodeProgress(node.id);

      // Для всех узлов требуется 100% прогресса (полное завершение)
      const requiredPercent = 100;

      // Если хотя бы один из предыдущих узлов не завершен - блокируем
      if (progress.percent < requiredPercent) {
        return false;
      }
    }

    return true;
  };

  const handleNodeClick = (node: MapNode, nodeIndex: number) => {
    if (isNodeUnlocked(nodeIndex)) {
      setSelectedNode(node);
    }
  };

  const getNodeQuests = (nodeId: string) => {
    let filtered = quests.filter((q) => q.nodeId === nodeId);

    // Фильтруем по локации
    filtered = filtered.filter((q) => {
      if (locationFilter === "home") {
        // Дома - квесты без инвентаря (location === "home")
        return q.location === "home";
      }
      if (locationFilter === "gym") {
        // В зале - квесты с инвентарем (location === "gym")
        return q.location === "gym";
      }
      return true;
    });

    return filtered;
  };

  // Получаем тематические цвета для карты
  const getThemeColors = () => {
    switch (theme) {
      case 'forest':
        return {
          gradientId: 'forestGradient',
          stops: ['#22c55e', '#16a34a', '#15803d', '#14532d'],
          cardBg: 'bg-green-50 dark:bg-green-900/50',
          cardBorder: 'border-green-300 dark:border-green-700',
          titleText: 'text-green-800 dark:text-green-200',
          labelText: 'text-green-700 dark:text-green-300',
          buttonActive: 'from-green-500 to-emerald-600',
          buttonInactive: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300',
        };
      case 'ocean':
        return {
          gradientId: 'oceanGradient',
          stops: ['#06b6d4', '#0891b2', '#0e7490', '#155e75'],
          cardBg: 'bg-cyan-50 dark:bg-cyan-900/50',
          cardBorder: 'border-cyan-300 dark:border-cyan-700',
          titleText: 'text-cyan-800 dark:text-cyan-200',
          labelText: 'text-cyan-700 dark:text-cyan-300',
          buttonActive: 'from-cyan-500 to-blue-600',
          buttonInactive: 'bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-300',
        };
      case 'sunset':
        return {
          gradientId: 'sunsetGradient',
          stops: ['#f97316', '#ea580c', '#dc2626', '#b91c1c'],
          cardBg: 'bg-orange-50 dark:bg-orange-900/50',
          cardBorder: 'border-orange-300 dark:border-orange-700',
          titleText: 'text-orange-800 dark:text-orange-200',
          labelText: 'text-orange-700 dark:text-orange-300',
          buttonActive: 'from-orange-500 to-red-600',
          buttonInactive: 'bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300',
        };
      case 'cyberpunk':
        return {
          gradientId: 'cyberpunkGradient',
          stops: ['#e879f9', '#c026d3', '#7c3aed', '#06b6d4'],
          cardBg: 'bg-gray-900/80',
          cardBorder: 'border-fuchsia-500',
          titleText: 'text-fuchsia-300',
          labelText: 'text-pink-300',
          buttonActive: 'from-fuchsia-500 to-cyan-500',
          buttonInactive: 'bg-gray-800 text-fuchsia-300',
        };
      case 'galaxy':
        return {
          gradientId: 'galaxyGradient',
          stops: ['#a855f7', '#7c3aed', '#4f46e5', '#ec4899'],
          cardBg: 'bg-indigo-900/50',
          cardBorder: 'border-purple-500',
          titleText: 'text-purple-200',
          labelText: 'text-purple-300',
          buttonActive: 'from-purple-500 to-pink-500',
          buttonInactive: 'bg-indigo-800 text-purple-300',
        };
      default:
        return {
          gradientId: 'lineGradient',
          stops: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
          cardBg: 'bg-white dark:bg-gray-800',
          cardBorder: 'border-gray-200 dark:border-gray-700',
          titleText: 'text-gray-800 dark:text-white',
          labelText: 'text-gray-700 dark:text-gray-300',
          buttonActive: 'from-purple-500 to-pink-500',
          buttonInactive: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className="w-full py-4 sm:py-8">
      <h2 className={`text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 ${themeColors.titleText}`}>
        Карта прогресса
      </h2>

      {/* Слайдер для выбора локации */}
      <div className="max-w-md mx-auto mb-4 sm:mb-8 px-3 sm:px-0">
        <div className={`${themeColors.cardBg} border ${themeColors.cardBorder} rounded-2xl shadow-lg p-4 sm:p-6`}>
          <label className={`block text-xs sm:text-sm font-semibold ${themeColors.labelText} mb-2 sm:mb-3 text-center`}>
            Где тренируемся?
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setLocationFilter("home");
                onLocationFilterChange?.("home");
              }}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                locationFilter === "home"
                  ? `bg-gradient-to-r ${themeColors.buttonActive} text-white shadow-lg scale-105`
                  : `${themeColors.buttonInactive} hover:opacity-80`
              }`}
            >
              Дома
            </button>
            <button
              onClick={() => {
                setLocationFilter("gym");
                onLocationFilterChange?.("gym");
              }}
              className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                locationFilter === "gym"
                  ? `bg-gradient-to-r ${themeColors.buttonActive} text-white shadow-lg scale-105`
                  : `${themeColors.buttonInactive} hover:opacity-80`
              }`}
            >
              В зале
            </button>
          </div>
          <p className={`text-xs ${themeColors.labelText} opacity-70 text-center mt-3`}>
            {locationFilter === "home" &&
              "Упражнения без спортивного инвентаря"}
            {locationFilter === "gym" &&
              "Упражнения со спортивным инвентарем"}
          </p>
        </div>
      </div>

      <div className="relative h-[700px] sm:h-[800px] px-4 sm:px-16 py-4 sm:py-12 overflow-visible rounded-2xl">

        {/* === DEFAULT THEME: горы + облака + звёзды/солнце === */}
        {theme === 'default' && (
          <>
            {/* Луна (тёмн) / Солнце (светл) */}
            <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%', animation: isDark ? 'moonGlow 6s ease-in-out infinite' : 'sunGlow 5s ease-in-out infinite' }}>
              {isDark ? (
                /* Луна */
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 38% 38%, rgba(245,240,255,0.95) 0%, rgba(220,200,255,0.85) 40%, rgba(167,139,250,0.55) 70%, transparent 100%)',
                  boxShadow: '0 0 18px 6px rgba(167,139,250,0.35), 0 0 48px 16px rgba(139,92,246,0.18), 0 0 90px 30px rgba(109,40,217,0.10)',
                }}>
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 38, height: 38, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,20,60,0.45) 0%, transparent 70%)' }} />
                </div>
              ) : (
                /* Солнце */
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 42% 38%, rgba(255,255,210,1) 0%, rgba(255,225,50,1) 38%, rgba(255,175,0,0.85) 65%, rgba(255,120,0,0.45) 100%)',
                  boxShadow: '0 0 18px 6px rgba(255,200,0,0.40), 0 0 48px 16px rgba(255,155,0,0.20), 0 0 90px 28px rgba(255,100,0,0.10)',
                }} />
              )}
            </div>

            {/* Фон с overflow-hidden только для гор и облаков */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {/* Дальние горы */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: '35%' }}>
                <defs>
                  <linearGradient id="farMtnDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(210,195,255,0.60)" />
                    <stop offset="35%"  stopColor="rgba(140,110,230,0.42)" />
                    <stop offset="100%" stopColor="rgba(80,55,170,0.48)" />
                  </linearGradient>
                  <linearGradient id="farMtnLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(90,120,75,0.88)" />
                    <stop offset="35%"  stopColor="rgba(130,160,110,0.78)" />
                    <stop offset="70%"  stopColor="rgba(170,195,150,0.68)" />
                    <stop offset="100%" stopColor="rgba(200,220,180,0.55)" />
                  </linearGradient>
                  <linearGradient id="nearMtnDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(185,155,255,0.52)" />
                    <stop offset="40%"  stopColor="rgba(105,75,210,0.44)" />
                    <stop offset="100%" stopColor="rgba(55,30,140,0.52)" />
                  </linearGradient>
                  <linearGradient id="nearMtnLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(72,100,58,0.92)" />
                    <stop offset="30%"  stopColor="rgba(110,145,88,0.84)" />
                    <stop offset="65%"  stopColor="rgba(155,185,130,0.74)" />
                    <stop offset="100%" stopColor="rgba(190,215,168,0.60)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,300 0,225 70,215 155,250 280,70 365,210 430,175 480,215 585,25 690,205 760,145 840,215 945,55 1045,215 1110,170 1200,200 1200,300"
                  fill={isDark ? 'url(#farMtnDark)' : 'url(#farMtnLight)'}
                />
              </svg>
              {/* Ближние горы */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 180" preserveAspectRatio="none" style={{ height: '18%' }}>
                <defs>
                  <linearGradient id="nearMtnDark2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(170,140,255,0.58)" />
                    <stop offset="38%"  stopColor="rgba(90,60,200,0.50)" />
                    <stop offset="100%" stopColor="rgba(40,22,120,0.58)" />
                  </linearGradient>
                  <linearGradient id="nearMtnLight2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="rgba(60,90,46,0.95)" />
                    <stop offset="28%"  stopColor="rgba(98,132,78,0.88)" />
                    <stop offset="62%"  stopColor="rgba(148,178,122,0.78)" />
                    <stop offset="100%" stopColor="rgba(185,210,160,0.62)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,180 0,145 120,162 270,168 410,8 540,155 640,120 730,158 880,5 1010,152 1120,88 1200,125 1200,180"
                  fill={isDark ? 'url(#nearMtnDark2)' : 'url(#nearMtnLight2)'}
                />
              </svg>

              {/* Облака */}
              {/* Облако 1 */}
              <div className="absolute pointer-events-none" style={{ bottom: '34%', left: '-180px', animation: 'cloudDrift 55s linear -8s infinite' }}>
                <svg width="140" height="50" viewBox="0 0 140 50" fill="none">
                  <path d="M10,42 Q10,22 30,22 Q32,10 52,10 Q68,4 80,14 Q90,6 104,14 Q118,14 120,26 Q132,26 132,38 Q132,42 120,42 Z" fill={isDark ? 'rgba(139,92,246,0.11)' : 'rgba(200,220,255,0.55)'} />
                </svg>
              </div>
              {/* Облако 2 */}
              <div className="absolute pointer-events-none" style={{ bottom: '33%', left: '-110px', animation: 'cloudDrift 38s linear -22s infinite' }}>
                <svg width="100" height="38" viewBox="0 0 100 38" fill="none">
                  <path d="M8,32 Q8,16 24,16 Q26,6 42,6 Q56,0 66,10 Q78,4 86,12 Q96,14 96,26 Q96,32 84,32 Z" fill={isDark ? 'rgba(109,40,217,0.12)' : 'rgba(180,210,255,0.50)'} />
                </svg>
              </div>
              {/* Облако 3 */}
              <div className="absolute pointer-events-none" style={{ bottom: '35%', left: '-80px', animation: 'cloudDrift 28s linear -12s infinite' }}>
                <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
                  <path d="M6,26 Q6,12 18,12 Q20,4 32,4 Q42,0 50,8 Q60,2 66,10 Q74,10 74,20 Q74,26 62,26 Z" fill={isDark ? 'rgba(139,92,246,0.10)' : 'rgba(200,220,255,0.50)'} />
                </svg>
              </div>
              {/* Облако 4 */}
              <div className="absolute pointer-events-none" style={{ bottom: '32%', left: '-220px', animation: 'cloudDrift 70s linear -35s infinite' }}>
                <svg width="160" height="56" viewBox="0 0 160 56" fill="none">
                  <path d="M12,48 Q12,26 36,26 Q38,12 62,10 Q82,2 98,14 Q112,6 124,16 Q142,16 144,32 Q148,32 148,42 Q148,48 132,48 Z" fill={isDark ? 'rgba(109,40,217,0.10)' : 'rgba(180,210,255,0.48)'} />
                </svg>
              </div>
              {/* Облако 5 */}
              <div className="absolute pointer-events-none" style={{ bottom: '36%', left: '-130px', animation: 'cloudDrift 45s linear -50s infinite' }}>
                <svg width="110" height="42" viewBox="0 0 110 42" fill="none">
                  <path d="M8,36 Q8,18 26,18 Q28,6 46,6 Q60,0 72,10 Q84,4 94,14 Q106,14 106,28 Q106,36 92,36 Z" fill={isDark ? 'rgba(139,92,246,0.11)' : 'rgba(200,220,255,0.55)'} />
                </svg>
              </div>
            </div>

            {/* Звёзды — только в тёмном режиме, вне overflow-hidden */}
            {isDark && DEFAULT_STARS.map((s, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: s.x, top: s.y,
                  width: `${s.s}px`, height: `${s.s}px`,
                  background: `radial-gradient(circle, rgba(220,200,255,${Math.min(s.o * 1.6, 1)}) 0%, rgba(167,139,250,${s.o * 0.9}) 50%, transparent 100%)`,
                  animation: `twinkle ${s.d}s ease-in-out ${s.b} infinite`,
                  filter: s.s >= 2 ? `drop-shadow(0 0 ${s.s * 2}px rgba(167,139,250,1)) drop-shadow(0 0 ${s.s + 3}px rgba(200,180,255,0.8))` : `drop-shadow(0 0 2px rgba(167,139,250,0.6))`,
                }}
              />
            ))}

            {/* Воздушный шар — только в светлом режиме */}
            {!isDark && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute pointer-events-none" style={{ top: '44%', left: 0, animation: 'balloonFloat 52s linear -22s infinite' }}>
                  <svg width="58" height="88" viewBox="0 0 58 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Balloon body — proper rounded balloon shape */}
                    <path d="M29 2 C56 2,60 26,54 44 C48 60,38 66,29 66 C20 66,10 60,4 44 C-2 26,2 2,29 2 Z" fill="rgba(210,40,40,0.95)" />
                    {/* Soft shadow on right side for depth */}
                    <path d="M29 2 C56 2,60 26,54 44 C48 60,38 66,29 66 C20 66,10 60,4 44 C-2 26,2 2,29 2 Z" fill="rgba(140,10,10,0.10)" />
                    {/* Highlight top-left */}
                    <ellipse cx="18" cy="22" rx="9" ry="12" fill="rgba(255,255,255,0.26)" />
                    {/* Neck */}
                    <path d="M24 66 L26 72 L32 72 L34 66 Z" fill="rgba(175,60,110,0.90)" />
                    {/* Ropes */}
                    <line x1="26" y1="72" x2="19" y2="80" stroke="rgba(95,52,12,0.72)" strokeWidth="1.3" />
                    <line x1="32" y1="72" x2="39" y2="80" stroke="rgba(95,52,12,0.72)" strokeWidth="1.3" />
                    {/* Basket */}
                    <rect x="14" y="80" width="30" height="8" rx="2" fill="rgba(160,108,40,0.97)" stroke="rgba(90,55,8,0.50)" strokeWidth="1" />
                    <line x1="14" y1="83.5" x2="44" y2="83.5" stroke="rgba(90,55,8,0.35)" strokeWidth="0.8" />
                  </svg>
                </div>
              </div>
            )}
          </>
        )}

        {/* === FOREST THEME === */}
        {theme === 'forest' && (
          <>
            <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%', animation: isDark ? 'moonGlow 7s ease-in-out infinite' : 'sunGlow 5s ease-in-out infinite' }}>
              {isDark ? (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, rgba(220,255,200,0.95) 0%, rgba(160,220,120,0.85) 45%, rgba(60,140,40,0.6) 100%)', boxShadow: '0 0 16px rgba(120,200,80,0.5), 0 0 36px rgba(60,160,20,0.25)' }}>
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,30,5,0.4) 0%, transparent 70%)' }} />
                </div>
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, rgba(255,240,100,1) 0%, rgba(255,200,0,0.9) 55%, rgba(240,160,0,0.7) 100%)', boxShadow: '0 0 20px rgba(255,220,0,0.6), 0 0 50px rgba(255,160,0,0.3)' }} />
              )}
            </div>
            {/* Far forest silhouette */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '32%' }}>
                <path d="M0,200 L0,155 L30,155 L50,120 L70,155 L95,155 L115,115 L135,88 L155,115 L175,155 L200,155 L220,110 L240,80 L260,110 L280,155 L305,155 L325,118 L345,90 L365,118 L385,155 L410,155 L430,105 L450,72 L470,105 L490,155 L515,155 L535,112 L555,85 L575,112 L595,155 L620,155 L640,108 L660,75 L680,108 L700,155 L725,155 L745,118 L765,92 L785,118 L805,155 L830,155 L850,105 L870,70 L890,105 L910,155 L935,155 L955,115 L975,88 L995,115 L1015,155 L1040,155 L1060,108 L1080,78 L1100,108 L1120,155 L1145,155 L1165,118 L1185,92 L1200,108 L1200,200 Z"
                  fill={isDark ? 'rgba(20,80,15,0.20)' : 'rgba(34,105,18,0.45)'} />
              </svg>
              {/* Near forest silhouette */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 220" preserveAspectRatio="none" style={{ height: '22%' }}>
                <path d="M0,220 L0,140 L40,140 L65,95 L90,140 L125,140 L155,80 L180,45 L205,80 L235,140 L270,140 L300,85 L325,52 L350,85 L378,140 L410,140 L440,75 L465,38 L490,75 L518,140 L550,140 L580,82 L605,50 L630,82 L658,140 L690,140 L720,78 L745,42 L770,78 L800,140 L832,140 L862,88 L888,55 L914,88 L942,140 L974,140 L1004,80 L1030,46 L1055,80 L1083,140 L1115,140 L1145,85 L1170,52 L1195,85 L1200,90 L1200,220 Z"
                  fill={isDark ? 'rgba(10,55,8,0.28)' : 'rgba(20,80,10,0.58)'} />
              </svg>
              {/* Mist clouds */}
              <div className="absolute pointer-events-none" style={{ bottom: '30%', left: '-160px', animation: 'cloudDrift 60s linear -15s infinite' }}>
                <svg width="130" height="45" viewBox="0 0 130 45" fill="none"><path d="M8,38 Q8,20 26,20 Q28,8 46,8 Q60,2 72,12 Q84,6 94,14 Q108,14 108,26 Q118,28 118,36 Q118,40 106,40 Z" fill={isDark ? 'rgba(100,180,80,0.08)' : 'rgba(200,230,180,0.72)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '32%', left: '-100px', animation: 'cloudDrift 42s linear -28s infinite' }}>
                <svg width="95" height="34" viewBox="0 0 95 34" fill="none"><path d="M6,28 Q6,14 20,14 Q22,4 36,4 Q48,0 58,8 Q68,4 78,10 Q88,12 88,22 Q88,28 78,28 Z" fill={isDark ? 'rgba(80,160,60,0.10)' : 'rgba(185,225,172,0.68)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '29%', left: '-200px', animation: 'cloudDrift 75s linear -40s infinite' }}>
                <svg width="148" height="52" viewBox="0 0 148 52" fill="none"><path d="M10,44 Q10,24 32,24 Q34,10 56,8 Q74,0 90,12 Q104,6 116,16 Q132,16 134,30 Q140,32 140,40 Q140,46 124,46 Z" fill={isDark ? 'rgba(100,180,80,0.08)' : 'rgba(200,230,180,0.68)'} /></svg>
              </div>
            </div>
            {/* Fireflies (dark mode only) */}
            {isDark && [
              { x: '8%', y: '52%', d: 1.5 }, { x: '18%', y: '65%', d: 2.2 },
              { x: '35%', y: '58%', d: 1.8 }, { x: '52%', y: '70%', d: 2.5 },
              { x: '68%', y: '55%', d: 1.6 }, { x: '82%', y: '62%', d: 2.0 },
              { x: '44%', y: '48%', d: 2.8 }, { x: '76%', y: '74%', d: 1.4 },
            ].map((f, i) => (
              <div key={`ff-${i}`} className="absolute rounded-full pointer-events-none" style={{ left: f.x, top: f.y, width: '4px', height: '4px', background: 'rgba(180,255,100,0.9)', boxShadow: '0 0 6px 3px rgba(140,240,60,0.6)', animation: `twinkle ${f.d}s ease-in-out ${i * 0.4}s infinite` }} />
            ))}
          </>
        )}

        {/* === OCEAN THEME === */}
        {theme === 'ocean' && (
          <>
            <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%', animation: isDark ? 'moonGlow 6s ease-in-out infinite' : 'sunGlow 5s ease-in-out infinite' }}>
              {isDark ? (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, rgba(200,240,255,0.95) 0%, rgba(100,180,255,0.85) 45%, rgba(20,90,200,0.6) 100%)', boxShadow: '0 0 18px rgba(80,160,255,0.55), 0 0 45px rgba(20,80,220,0.3)' }}>
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 38, height: 38, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,15,50,0.4) 0%, transparent 70%)' }} />
                </div>
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, rgba(255,240,100,1) 0%, rgba(255,200,0,0.9) 55%, rgba(240,160,0,0.7) 100%)', boxShadow: '0 0 20px rgba(255,220,0,0.6), 0 0 50px rgba(255,160,0,0.3)' }} />
              )}
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {/* Far waves */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 160" preserveAspectRatio="none" style={{ height: '25%' }}>
                <path d="M0,160 L0,80 C60,65 120,90 180,75 C240,60 300,80 360,68 C420,56 480,74 540,62 C600,50 660,70 720,58 C780,46 840,68 900,55 C960,42 1020,64 1080,52 C1140,40 1170,58 1200,50 L1200,160 Z"
                  fill={isDark ? 'rgba(20,70,160,0.18)' : 'rgba(28,105,200,0.48)'} />
              </svg>
              {/* Near waves with foam */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '18%' }}>
                <path d="M0,120 L0,55 C50,40 100,60 160,45 C220,30 280,52 340,38 C400,24 460,46 520,32 C580,18 640,42 700,28 C760,14 820,38 880,24 C940,10 1000,34 1060,20 C1120,6 1160,26 1200,15 L1200,120 Z"
                  fill={isDark ? 'rgba(10,50,130,0.25)' : 'rgba(18,88,180,0.58)'} />
                <path d="M0,55 C50,40 100,60 160,45 C220,30 280,52 340,38 C400,24 460,46 520,32 C580,18 640,42 700,28 C760,14 820,38 880,24 C940,10 1000,34 1060,20 C1120,6 1160,26 1200,15"
                  stroke={isDark ? 'rgba(180,220,255,0.30)' : 'rgba(255,255,255,0.85)'} strokeWidth="4" fill="none" />
              </svg>
              {/* Clouds */}
              <div className="absolute pointer-events-none" style={{ bottom: '28%', left: '-160px', animation: 'cloudDrift 50s linear -10s infinite' }}>
                <svg width="130" height="46" viewBox="0 0 130 46" fill="none"><path d="M10,40 Q10,22 28,22 Q30,10 48,10 Q62,4 74,14 Q86,6 98,14 Q112,14 112,26 Q122,28 122,38 Q122,42 108,42 Z" fill={isDark ? 'rgba(60,120,200,0.10)' : 'rgba(200,230,255,0.72)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '30%', left: '-95px', animation: 'cloudDrift 35s linear -20s infinite' }}>
                <svg width="95" height="34" viewBox="0 0 95 34" fill="none"><path d="M6,28 Q6,14 20,14 Q22,4 36,4 Q48,0 58,8 Q68,4 78,10 Q88,12 88,22 Q88,28 78,28 Z" fill={isDark ? 'rgba(40,100,180,0.12)' : 'rgba(180,220,255,0.68)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '27%', left: '-210px', animation: 'cloudDrift 68s linear -38s infinite' }}>
                <svg width="152" height="55" viewBox="0 0 152 55" fill="none"><path d="M12,48 Q12,26 36,26 Q38,12 62,10 Q82,2 98,16 Q112,8 126,18 Q144,18 146,34 Q150,36 150,44 Q150,50 134,50 Z" fill={isDark ? 'rgba(60,120,200,0.10)' : 'rgba(200,230,255,0.68)'} /></svg>
              </div>
              {/* Seagulls (light mode) */}
              {!isDark && (
                <>
                  <svg className="absolute pointer-events-none" style={{ top: '15%', left: '20%' }} width="36" height="16" viewBox="0 0 36 16" fill="none">
                    <path d="M0,10 Q6,4 12,10 Q18,4 24,10" stroke="rgba(80,100,130,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute pointer-events-none" style={{ top: '22%', left: '40%' }} width="28" height="12" viewBox="0 0 28 12" fill="none">
                    <path d="M0,8 Q5,3 10,8 Q15,3 20,8" stroke="rgba(55,75,115,0.65)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute pointer-events-none" style={{ top: '10%', left: '58%' }} width="22" height="10" viewBox="0 0 22 10" fill="none">
                    <path d="M0,6 Q4,2 8,6 Q12,2 16,6" stroke="rgba(55,75,115,0.55)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </>
              )}
            </div>
          </>
        )}

        {/* === SUNSET THEME === */}
        {theme === 'sunset' && (
          <>
            {/* Large setting sun near horizon */}
            <div className="absolute pointer-events-none" style={{ bottom: '24%', right: '14%', animation: 'sunGlow 5s ease-in-out infinite' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(255,240,80,1) 0%, rgba(255,130,0,0.95) 45%, rgba(200,40,0,0.85) 100%)', boxShadow: '0 0 30px rgba(255,140,0,0.8), 0 0 70px rgba(200,60,0,0.5), 0 0 120px rgba(255,100,0,0.25)' }} />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {/* Far horizon hills */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '32%' }}>
                <path d="M0,200 L0,145 C80,120 160,145 240,128 C320,110 400,138 480,118 C560,98 640,130 720,112 C800,94 880,128 960,108 C1040,88 1120,118 1200,100 L1200,200 Z"
                  fill={isDark ? 'rgba(120,40,10,0.30)' : 'rgba(140,55,15,0.55)'} />
              </svg>
              {/* Near dark hills */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 150" preserveAspectRatio="none" style={{ height: '20%' }}>
                <path d="M0,150 L0,95 C60,72 120,95 190,75 C260,55 330,80 400,62 C470,44 540,70 610,52 C680,34 750,62 820,44 C890,26 960,56 1030,38 C1100,20 1150,46 1200,30 L1200,150 Z"
                  fill={isDark ? 'rgba(80,20,5,0.40)' : 'rgba(75,18,5,0.72)'} />
              </svg>
              {/* Sunset clouds */}
              <div className="absolute pointer-events-none" style={{ bottom: '38%', left: '-160px', animation: 'cloudDrift 58s linear -12s infinite' }}>
                <svg width="145" height="52" viewBox="0 0 145 52" fill="none"><path d="M10,44 Q10,24 30,24 Q32,10 54,10 Q72,4 86,16 Q100,8 112,18 Q130,18 132,32 Q138,34 138,44 Q138,50 122,50 Z" fill={isDark ? 'rgba(180,60,15,0.22)' : 'rgba(255,120,35,0.72)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '40%', left: '-105px', animation: 'cloudDrift 40s linear -25s infinite' }}>
                <svg width="105" height="38" viewBox="0 0 105 38" fill="none"><path d="M8,32 Q8,16 24,16 Q26,5 42,5 Q56,0 66,10 Q78,5 88,12 Q100,14 100,26 Q100,32 88,32 Z" fill={isDark ? 'rgba(200,80,20,0.20)' : 'rgba(255,100,25,0.68)'} /></svg>
              </div>
              <div className="absolute pointer-events-none" style={{ bottom: '42%', left: '-230px', animation: 'cloudDrift 72s linear -42s infinite' }}>
                <svg width="162" height="58" viewBox="0 0 162 58" fill="none"><path d="M12,50 Q12,28 38,28 Q40,14 66,12 Q86,4 104,18 Q118,10 132,22 Q150,22 152,38 Q156,40 156,50 Q156,56 138,56 Z" fill={isDark ? 'rgba(160,50,10,0.22)' : 'rgba(255,90,15,0.65)'} /></svg>
              </div>
            </div>
          </>
        )}

        {/* === CYBERPUNK THEME === */}
        {theme === 'cyberpunk' && (
          <>
            <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%', animation: isDark ? 'moonGlow 4s ease-in-out infinite' : 'sunGlow 4s ease-in-out infinite' }}>
              {isDark ? (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, rgba(255,200,255,0.95) 0%, rgba(220,60,255,0.85) 45%, rgba(140,0,200,0.6) 100%)', boxShadow: '0 0 20px rgba(220,60,255,0.65), 0 0 50px rgba(140,0,200,0.40)' }}>
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 38, height: 38, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,0,60,0.45) 0%, transparent 70%)' }} />
                </div>
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, rgba(255,255,140,1) 0%, rgba(180,255,0,0.9) 50%, rgba(100,200,0,0.75) 100%)', boxShadow: '0 0 20px rgba(180,255,0,0.65), 0 0 50px rgba(100,200,0,0.35)' }} />
              )}
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {/* Far building skyline */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ height: '45%' }}>
                <path d="M0,300 L0,200 L50,200 L50,160 L70,160 L70,130 L90,130 L90,200 L130,200 L130,145 L150,145 L150,100 L170,100 L170,145 L190,145 L190,200 L230,200 L230,155 L250,155 L250,115 L265,115 L265,155 L285,155 L285,200 L320,200 L320,140 L340,140 L340,95 L360,95 L360,140 L380,140 L380,200 L415,200 L415,160 L435,160 L435,120 L450,120 L450,160 L468,160 L468,200 L500,200 L500,130 L520,130 L520,85 L535,85 L535,130 L555,130 L555,200 L590,200 L590,155 L610,155 L610,118 L625,118 L625,155 L645,155 L645,200 L680,200 L680,142 L700,142 L700,105 L715,105 L715,142 L732,142 L732,200 L768,200 L768,160 L788,160 L788,125 L803,125 L803,160 L820,160 L820,200 L855,200 L855,138 L875,138 L875,92 L890,92 L890,138 L910,138 L910,200 L945,200 L945,158 L965,158 L965,122 L980,122 L980,158 L995,158 L995,200 L1030,200 L1030,145 L1050,145 L1050,108 L1065,108 L1065,145 L1082,145 L1082,200 L1118,200 L1118,155 L1138,155 L1138,115 L1153,115 L1153,155 L1170,155 L1170,200 L1200,200 L1200,300 Z"
                  fill={isDark ? 'rgba(60,0,100,0.22)' : 'rgba(42,0,80,0.48)'} />
                <path d="M50,200 L50,160 L70,160 L70,130 L90,130 L90,200 M130,200 L130,145 L150,145 L150,100 L170,100 L170,145 L190,145 L190,200 M320,200 L320,140 L340,140 L340,95 L360,95 L360,140 L380,140 L380,200 M500,200 L500,130 L520,130 L520,85 L535,85 L535,130 L555,130 L555,200"
                  stroke={isDark ? 'rgba(200,0,255,0.20)' : 'rgba(100,0,150,0.38)'} strokeWidth="1.5" fill="none" />
              </svg>
              {/* Near building silhouette with neon windows */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '28%' }}>
                <path d="M0,200 L0,100 L45,100 L45,200 L50,200 L50,60 L82,60 L82,200 L90,200 L90,80 L125,80 L125,200 L135,200 L135,30 L162,30 L162,200 L175,200 L175,70 L210,70 L210,200 L218,200 L218,45 L248,45 L248,200 L260,200 L260,20 L288,20 L288,200 L300,200 L300,85 L335,85 L335,200 L345,200 L345,50 L375,50 L375,200 L390,200 L390,15 L418,15 L418,200 L430,200 L430,68 L465,68 L465,200 L478,200 L478,38 L508,38 L508,200 L520,200 L520,78 L555,78 L555,200 L568,200 L568,28 L598,28 L598,200 L610,200 L610,60 L645,60 L645,200 L658,200 L658,42 L688,42 L688,200 L700,200 L700,85 L735,85 L735,200 L748,200 L748,34 L778,34 L778,200 L790,200 L790,70 L825,70 L825,200 L838,200 L838,22 L868,22 L868,200 L880,200 L880,80 L915,80 L915,200 L928,200 L928,50 L958,50 L958,200 L970,200 L970,32 L1000,32 L1000,200 L1012,200 L1012,75 L1047,75 L1047,200 L1060,200 L1060,45 L1090,45 L1090,200 L1102,200 L1102,20 L1132,20 L1132,200 L1142,200 L1142,65 L1175,65 L1175,200 L1200,200 Z"
                  fill={isDark ? 'rgba(20,0,50,0.60)' : 'rgba(15,0,38,0.68)'} />
                {true && (
                  <>
                    <rect x="58" y="70" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.85)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="69" y="82" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.80)' : 'rgba(140,0,80,0.50)'} />
                    <rect x="140" y="38" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.80)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="151" y="50" width="5" height="5" fill={isDark ? 'rgba(255,255,0,0.75)' : 'rgba(100,60,0,0.50)'} />
                    <rect x="265" y="28" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.85)' : 'rgba(140,0,80,0.55)'} />
                    <rect x="276" y="42" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.80)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="395" y="22" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.85)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="406" y="36" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.80)' : 'rgba(140,0,80,0.50)'} />
                    <rect x="484" y="46" width="5" height="5" fill={isDark ? 'rgba(255,255,0,0.80)' : 'rgba(100,60,0,0.55)'} />
                    <rect x="495" y="60" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.85)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="574" y="36" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.80)' : 'rgba(140,0,80,0.50)'} />
                    <rect x="585" y="50" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.75)' : 'rgba(80,0,140,0.48)'} />
                    <rect x="663" y="50" width="5" height="5" fill={isDark ? 'rgba(255,255,0,0.80)' : 'rgba(100,60,0,0.55)'} />
                    <rect x="674" y="64" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.80)' : 'rgba(140,0,80,0.50)'} />
                    <rect x="843" y="30" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.85)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="854" y="44" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.80)' : 'rgba(140,0,80,0.50)'} />
                    <rect x="934" y="58" width="5" height="5" fill={isDark ? 'rgba(255,255,0,0.80)' : 'rgba(100,60,0,0.55)'} />
                    <rect x="945" y="72" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.75)' : 'rgba(80,0,140,0.48)'} />
                    <rect x="1006" y="42" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.85)' : 'rgba(140,0,80,0.55)'} />
                    <rect x="1017" y="56" width="5" height="5" fill={isDark ? 'rgba(0,255,255,0.80)' : 'rgba(80,0,140,0.55)'} />
                    <rect x="1108" y="28" width="5" height="5" fill={isDark ? 'rgba(255,255,0,0.80)' : 'rgba(100,60,0,0.55)'} />
                    <rect x="1119" y="42" width="5" height="5" fill={isDark ? 'rgba(255,0,255,0.75)' : 'rgba(140,0,80,0.48)'} />
                  </>
                )}
              </svg>
              {/* Neon ground strip */}
              <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ height: '2px', background: isDark ? 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.5) 20%, rgba(255,0,255,0.5) 50%, rgba(0,255,255,0.5) 80%, transparent 100%)' : 'linear-gradient(90deg, transparent 0%, rgba(150,0,200,0.55) 30%, rgba(0,160,200,0.55) 70%, transparent 100%)' }} />
            </div>
            {/* Neon stars (dark only) */}
            {isDark && DEFAULT_STARS.slice(0, 15).map((s, i) => (
              <div key={`cyberstar-${i}`} className="absolute rounded-full pointer-events-none" style={{
                left: s.x, top: s.y,
                width: `${s.s}px`, height: `${s.s}px`,
                background: i % 2 === 0
                  ? `radial-gradient(circle, rgba(0,255,255,${Math.min(s.o * 1.5, 1)}) 0%, rgba(0,200,255,${s.o}) 50%, transparent 100%)`
                  : `radial-gradient(circle, rgba(255,0,255,${Math.min(s.o * 1.5, 1)}) 0%, rgba(200,0,255,${s.o}) 50%, transparent 100%)`,
                animation: `twinkle ${s.d}s ease-in-out ${s.b} infinite`,
                filter: `drop-shadow(0 0 ${s.s * 2}px ${i % 2 === 0 ? 'rgba(0,255,255,0.8)' : 'rgba(255,0,255,0.8)'})`,
              }} />
            ))}
          </>
        )}

        {/* === GALAXY THEME === */}
        {theme === 'galaxy' && (
          <>
            <div className="absolute pointer-events-none" style={{ top: '8%', right: '12%', animation: 'moonGlow 6s ease-in-out infinite' }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, rgba(240,220,255,0.98) 0%, rgba(180,150,255,0.9) 40%, rgba(80,40,180,0.7) 100%)', boxShadow: '0 0 22px rgba(180,150,255,0.6), 0 0 55px rgba(100,60,220,0.35), 0 0 90px rgba(60,20,160,0.20)' }}>
                <div style={{ position: 'absolute', top: 5, right: 5, width: 42, height: 42, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,10,60,0.45) 0%, transparent 70%)' }} />
              </div>
            </div>
            {/* Nebula blobs */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <ellipse cx="15" cy="30" rx="18" ry="10" fill="rgba(140,60,220,0.06)" />
                <ellipse cx="75" cy="20" rx="22" ry="12" fill="rgba(60,100,220,0.06)" />
                <ellipse cx="45" cy="60" rx="25" ry="14" fill="rgba(200,60,180,0.05)" />
                <ellipse cx="85" cy="65" rx="18" ry="10" fill="rgba(80,140,220,0.06)" />
                <ellipse cx="25" cy="75" rx="20" ry="12" fill="rgba(140,60,220,0.05)" />
              </svg>
            </div>
            {/* Multicolor stars */}
            {DEFAULT_STARS.map((s, i) => {
              const palettes: [string, string][] = [
                ['rgba(220,200,255,', 'rgba(167,139,250,'],
                ['rgba(200,240,255,', 'rgba(100,180,255,'],
                ['rgba(255,240,200,', 'rgba(255,200,100,'],
                ['rgba(255,200,220,', 'rgba(255,120,160,'],
                ['rgba(200,255,220,', 'rgba(100,220,160,'],
              ];
              const c = palettes[i % palettes.length];
              return (
                <div key={`gxstar-${i}`} className="absolute rounded-full pointer-events-none" style={{
                  left: s.x, top: s.y,
                  width: `${s.s}px`, height: `${s.s}px`,
                  background: `radial-gradient(circle, ${c[0]}${Math.min(s.o * 1.6, 1)}) 0%, ${c[1]}${s.o * 0.9}) 50%, transparent 100%)`,
                  animation: `twinkle ${s.d}s ease-in-out ${s.b} infinite`,
                  filter: s.s >= 2 ? `drop-shadow(0 0 ${s.s * 2}px ${c[1]}1))` : `drop-shadow(0 0 2px ${c[1]}0.6))`,
                }} />
              );
            })}
          </>
        )}

        {/* Плавные соединительные линии */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id={themeColors.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              {themeColors.stops.map((color, i) => (
                <stop key={i} offset={`${(i / (themeColors.stops.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
            {(!theme || theme === 'default') && (
              <>
                <linearGradient id="defaultGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#10b981" />
                  <stop offset="25%"  stopColor="#3b82f6" />
                  <stop offset="60%"  stopColor="#8b5cf6" />
                  <stop offset="85%"  stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="defaultGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#f59e0b" />
                  <stop offset="25%"  stopColor="#ef4444" />
                  <stop offset="60%"  stopColor="#8b5cf6" />
                  <stop offset="85%"  stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </>
            )}
          </defs>
          {mapNodes.slice(0, -1).map((node, i) => {
            const nextNode = mapNodes[i + 1];
            const isUnlocked = isNodeUnlocked(i + 1);

            // Линии выходят ровно из центров узлов
            const startX = node.position.x;
            const startY = node.position.y;
            const endX = nextNode.position.x;
            const endY = nextNode.position.y;

            const verticalDistance = Math.abs(endY - startY);

            // Плавные хаотичные дуги, идущие вниз
            let control1X, control1Y, control2X, control2Y;

            switch (i) {
              case 0: // 1->2: мягкая дуга влево
                control1X = startX - 22;
                control1Y = startY + verticalDistance * 0.35;
                control2X = endX - 18;
                control2Y = endY - verticalDistance * 0.35;
                break;
              case 1: // 2->3: плавная широкая дуга вправо
                control1X = startX + 35;
                control1Y = startY + verticalDistance * 0.4;
                control2X = endX + 25;
                control2Y = endY - verticalDistance * 0.3;
                break;
              case 2: // 3->4: средняя дуга влево
                control1X = startX - 32;
                control1Y = startY + verticalDistance * 0.38;
                control2X = endX - 28;
                control2Y = endY - verticalDistance * 0.32;
                break;
              case 3: // 4->5: широкая плавная дуга вправо
                control1X = startX + 40;
                control1Y = startY + verticalDistance * 0.42;
                control2X = endX + 30;
                control2Y = endY - verticalDistance * 0.35;
                break;
              case 4: // 5->6: мягкая дуга влево
                control1X = startX - 38;
                control1Y = startY + verticalDistance * 0.37;
                control2X = endX - 32;
                control2Y = endY - verticalDistance * 0.33;
                break;
              case 5: // 6->7: финальная плавная дуга к центру
                control1X = startX + 28;
                control1Y = startY + verticalDistance * 0.4;
                control2X = endX + 20;
                control2Y = endY - verticalDistance * 0.36;
                break;
              default:
                control1X = startX;
                control1Y = startY + verticalDistance * 0.35;
                control2X = endX;
                control2Y = endY - verticalDistance * 0.35;
            }

            const pathData = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;

            const isPathAnimated = animatedPaths.has(i);
            const isNoDelay = noDelayPaths.has(i);

            return (
              <g key={`path-${node.id}`}>
                {/* Базовая серая линия — тонкая */}
                <path
                  d={pathData}
                  stroke="#6b7280"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                  opacity="0.4"
                  fill="none"
                />
                {/* Градиентная линия для завершённых патей (статично после анимации) */}
                {isUnlocked && isPathAnimated && (
                  <path
                    d={pathData}
                    stroke={(!theme || theme === 'default') ? `url(#${isDark ? 'defaultGradDark' : 'defaultGradLight'})` : `url(#${themeColors.gradientId})`}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="1"
                    style={{
                      strokeDasharray: "1",
                      strokeDashoffset: "0",
                      opacity: 0.9,
                      filter: isDark ? 'brightness(1.3) drop-shadow(0 0 2px rgba(167,139,250,0.55))' : 'brightness(1.1) drop-shadow(0 0 2px rgba(124,58,237,0.45))',
                    }}
                  />
                )}
                {/* Анимированная линия — плавное заполнение */}
                {isUnlocked && !isPathAnimated && (
                  <path
                    d={pathData}
                    stroke={(!theme || theme === 'default') ? `url(#${isDark ? 'defaultGradDark' : 'defaultGradLight'})` : `url(#${themeColors.gradientId})`}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="1"
                    style={{
                      strokeDasharray: "1",
                      strokeDashoffset: "1",
                      animation: `mapFillPath 2.5s cubic-bezier(0.4,0,0.2,1) forwards`,
                      animationDelay: isNoDelay ? "0ms" : `${i * 400}ms`,
                      opacity: 0.9,
                      filter: isDark ? 'brightness(1.3) drop-shadow(0 0 2px rgba(167,139,250,0.55))' : 'brightness(1.1) drop-shadow(0 0 2px rgba(124,58,237,0.45))',
                    }}
                    onAnimationEnd={() => {
                      setAnimatedPaths((s) => new Set([...s, i]));
                      setNoDelayPaths((s) => { const n = new Set(s); n.delete(i); return n; });
                    }}
                  />
                )}
              </g>
            );
          })}
          {/* Конец путей */}
        </svg>

        {/* Узлы карты */}
        {mapNodes.map((node, index) => {
          const isUnlocked = isNodeUnlocked(index);
          const progress = getNodeProgress(node.id);
          const isCompleted = progress.percent === 100 && progress.total > 0;
          const isHovered = hoveredNode === node.id;
          const isNextAvailable =
            index > 0 &&
            isNodeUnlocked(index) &&
            getNodeProgress(mapNodes[index - 1].id).percent >= 70;

          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[node.id] = el; }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                zIndex: 10,
              }}
            >
              <button
                onClick={() => handleNodeClick(node, index)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                disabled={!isUnlocked}
                className={`relative transition-[transform] duration-200 ease-out bg-transparent border-0 outline-none ${
                  isUnlocked
                    ? "cursor-pointer hover:scale-[1.10] active:scale-[0.97]"
                    : "cursor-not-allowed"
                } ${newlyUnlocked.has(node.id) ? "map-node-unlock" : ""}`}
                style={{ zIndex: 10 }}
              >
                {/* Круг узла */}
                {isUnlocked ? (
                  /* ─── РАЗБЛОКИРОВАННЫЙ / ЗАВЕРШЁННЫЙ ─── */
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center relative ${
                      isCompleted
                        ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500"
                        : `bg-gradient-to-br ${node.color}`
                    } ${isHovered ? "ring-2 ring-purple-400 ring-opacity-60" : ""}`}
                    style={{
                      boxShadow: "0 2px 6px rgba(0,0,0,0.28)",
                      zIndex: 10,
                    }}
                  >
                    <span className="text-2xl font-bold text-white">{node.icon}</span>

                    {/* Бейдж прогресса */}
                    {progress.total > 0 && (
                      <div
                        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-gray-900"
                        style={{ zIndex: 20, boxShadow: "0 2px 8px rgba(139,92,246,0.5)" }}
                      >
                        {progress.completed}/{progress.total}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ─── ЗАКРЫТЫЙ ─── */
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    style={{
                      background: isDark ? "rgb(17,24,39)" : "rgb(243,244,246)",
                      border: isDark ? "1.5px solid rgba(255,255,255,0.10)" : "1.5px solid rgba(0,0,0,0.10)",
                      zIndex: 10,
                    }}
                  >
                    {/* Замок */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.30)"} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <rect x="5" y="11" width="14" height="10" rx="2.5" stroke={isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.25)"} strokeWidth="1.6" fill="none" />
                      <circle cx="12" cy="16" r="1.4" fill={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)"} />
                    </svg>
                  </div>
                )}

                {/* Название узла */}
                <div className="absolute top-full mt-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`text-sm font-bold text-center transition-transform duration-200 ${
                      isHovered ? "scale-110" : ""
                    } ${
                      isUnlocked
                        ? "text-gray-700 dark:text-white"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                    style={{ textShadow: isUnlocked && !isDark ? '0 1px 4px rgba(255,255,255,0.85), 0 0 8px rgba(255,255,255,0.60)' : 'none' }}
                  >
                    {node.name}
                  </div>
                </div>


              </button>
            </div>
          );
        })}
      </div>

      {/* Модальное окно с квестами узла */}
      {selectedNode &&
        (() => {
          const allNodeQuests = quests.filter((q) => q.nodeId === selectedNode.id);
          const homeQuests = allNodeQuests.filter((q) => q.location === "home");
          const gymQuests = allNodeQuests.filter((q) => q.location === "gym");
          const progress = getNodeProgress(selectedNode.id);

          const modalBg = () => {
            switch (theme) {
              case "cyberpunk": return "bg-gray-900 text-pink-100";
              case "galaxy":    return "bg-indigo-950 text-purple-100";
              case "forest":    return "bg-green-950 text-green-100";
              case "sunset":    return "bg-orange-950 text-orange-100";
              default:          return "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100";
            }
          };

          const rowBg = () => {
            switch (theme) {
              case "cyberpunk": return "bg-gray-800";
              case "galaxy":    return "bg-indigo-900";
              case "forest":    return "bg-green-900";
              case "sunset":    return "bg-orange-900";
              default:          return "bg-gray-100 dark:bg-gray-800";
            }
          };

          const accentColor = () => {
            switch (theme) {
              case "cyberpunk": return "bg-pink-500";
              case "galaxy":    return "bg-purple-500";
              case "forest":    return "bg-green-500";
              case "sunset":    return "bg-orange-500";
              default:          return "bg-blue-500";
            }
          };

          const barColor = () => {
            switch (theme) {
              case "cyberpunk": return "bg-pink-500";
              case "galaxy":    return "bg-purple-500";
              case "forest":    return "bg-green-400";
              case "sunset":    return "bg-orange-400";
              default:          return "bg-blue-500";
            }
          };

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
              onClick={() => setSelectedNode(null)}
            >
              <div
                className={`${modalBg()} rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative px-4 py-4 flex items-center justify-between">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor()} rounded-l-2xl`} />
                  <div className="pl-3">
                    <p className="text-sm sm:text-base font-semibold leading-tight">
                      {selectedNode.icon} {selectedNode.name}
                    </p>
                    <p className="text-xs opacity-50 mt-0.5">{selectedNode.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-2xl font-bold opacity-40 hover:opacity-70 transition-opacity leading-none ml-3"
                  >
                    ×
                  </button>
                </div>

                <div className="px-3 sm:px-4 pb-4 space-y-2">
                  {/* Прогресс */}
                  <div className={`${rowBg()} rounded-2xl px-4 py-3`}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="opacity-50">Прогресс</span>
                      <span className="font-semibold">{progress.completed} / {progress.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${barColor()} transition-all duration-500`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <div className="text-xs opacity-40 mt-1 text-right">{progress.percent}%</div>
                  </div>

                  {/* Кнопки старта или пустое состояние */}
                  {allNodeQuests.length > 0 ? (
                    <button
                      onClick={() => {
                        sessionStorage.setItem("gymquest_map_scroll", String(window.scrollY));
                        router.push(`/?nodeId=${selectedNode.id}`, undefined, { scroll: false });
                        setSelectedNode(null);
                      }}
                      className="w-full py-3 rounded-2xl text-sm font-semibold bg-blue-500 hover:bg-blue-600 active:scale-95 text-white transition-all"
                    >
                      Начать день
                    </button>
                  ) : (
                    <div className={`${rowBg()} rounded-2xl px-4 py-6 text-center`}>
                      <p className="text-sm opacity-40">
                        Квесты не найдены.<br />Сгенерируйте план недели.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
