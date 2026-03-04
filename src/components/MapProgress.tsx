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
    position: { x: 70, y: 65 },
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
    position: { x: 25, y: 80 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "strength",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "strength",
    description: "Максимальная сила!",
    position: { x: 50, y: 95 },
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
    position: { x: 70, y: 65 },
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
    position: { x: 25, y: 80 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "cardio",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "cardio",
    description: "Безграничная выносливость!",
    position: { x: 50, y: 95 },
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
    position: { x: 70, y: 65 },
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
    position: { x: 25, y: 80 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "flexibility",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "flexibility",
    description: "Совершенная гибкость!",
    position: { x: 50, y: 95 },
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
    position: { x: 25, y: 80 },
    color: "from-yellow-400 to-orange-500",
    icon: "6",
    trainingType: "mixed",
  },
  {
    id: "node-7",
    name: "День 7",
    category: "recovery",
    description: "Комплексное испытание всех навыков!",
    position: { x: 50, y: 95 },
    color: "from-purple-500 to-pink-600",
    icon: "7",
    isBoss: true,
    trainingType: "mixed",
  },
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
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // animatedPaths — индекс завершённых патей (запускаются в каскаде при монте или при завершении)
  const [animatedPaths, setAnimatedPaths] = useState<Set<number>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState<Set<string>>(new Set());
  const prevCompletedRef = useRef<Set<string> | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Восстанавливаем позицию скролла при возврате на карту
  useEffect(() => {
    const saved = sessionStorage.getItem("gymquest_map_scroll");
    if (saved) {
      const y = parseInt(saved, 10);
      setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 80);
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
      // Первая загрузка квестов — запускаем каскадную анимацию всех завершённых путей
      prevCompletedRef.current = nowCompleted;
      if (nowCompleted.size > 0) {
        const indices = mapNodes.slice(0, -1)
          .map((node, i) => ({ id: node.id, i }))
          .filter(({ id }) => nowCompleted.has(id));
        indices.forEach(({ i }, order) => {
          setTimeout(() => setAnimatedPaths((s) => new Set([...s, i])), order * 350);
        });
      }
      return;
    }
    const prev = prevCompletedRef.current;
    const newlyDone = [...nowCompleted].filter((id) => !prev.has(id));
    if (newlyDone.length > 0) {
      newlyDone.forEach((id) => {
        const idx = mapNodes.findIndex((n) => n.id === id);
        if (idx !== -1 && idx < mapNodes.length - 1) {
          setAnimatedPaths((s) => new Set([...s, idx]));
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
      case 'forest':
        return [
          { emoji: '�', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '🍀', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '🍃', position: '-bottom-16 left-20', size: 'text-7xl', delay: '4s' },
          { emoji: '🌱', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
          { emoji: '🦋', position: 'top-40 left-10', size: 'text-3xl', delay: '1s' },
        ];
      case 'ocean':
        return [
          { emoji: '🌊', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '🐚', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '🐟', position: '-bottom-16 left-20', size: 'text-6xl', delay: '4s' },
          { emoji: '🦐', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
          { emoji: '💧', position: 'top-60 left-5', size: 'text-3xl', delay: '1.5s' },
        ];
      case 'sunset':
        return [
          { emoji: '☀️', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '🌴', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '🦩', position: '-bottom-16 left-20', size: 'text-6xl', delay: '4s' },
          { emoji: '🌺', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
          { emoji: '🍂', position: 'top-10 right-20', size: 'text-5xl', delay: '1s' },
        ];
      case 'cyberpunk':
        return [
          { emoji: '💎', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '⚡', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '🔮', position: '-bottom-16 left-20', size: 'text-6xl', delay: '4s' },
          { emoji: '💜', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
          { emoji: '✦', position: 'top-40 left-10', size: 'text-3xl', delay: '1s' },
        ];
      case 'galaxy':
        return [
          { emoji: '⭐', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '🌙', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '✨', position: '-bottom-16 left-20', size: 'text-7xl', delay: '4s' },
          { emoji: '💫', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
          { emoji: '🪐', position: 'top-60 left-5', size: 'text-3xl', delay: '1.5s' },
          { emoji: '✧', position: 'bottom-20 left-40', size: 'text-5xl', delay: '2.5s' },
        ];
      default:
        // Дефолтная тема с облаками
        return [
          { emoji: '☁️', position: '-top-20 -left-10', size: 'text-6xl', delay: '0s' },
          { emoji: '☁️', position: 'top-20 -right-16', size: 'text-5xl', delay: '2s' },
          { emoji: '☁️', position: '-bottom-16 left-20', size: 'text-7xl', delay: '4s' },
          { emoji: '☁️', position: 'bottom-40 -right-12', size: 'text-4xl', delay: '3s' },
        ];
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

      // Для боссовых узлов требуется 100% прогресса
      const requiredPercent = node.isBoss ? 100 : 50;

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

      <div className="relative h-[700px] sm:h-[800px] px-4 sm:px-16 py-4 sm:py-12 overflow-visible">
        {/* Декоративные элементы темы */}
        {getThemeDecorations().map((deco, index) => (
          <div
            key={`deco-${index}`}
            className={`absolute ${deco.position} ${deco.size} opacity-15 animate-float pointer-events-none`}
            style={{ animationDelay: deco.delay }}
          >
            {deco.emoji}
          </div>
        ))}

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
          </defs>
          {mapNodes.slice(0, -1).map((node, i) => {
            const nextNode = mapNodes[i + 1];
            const isUnlocked = isNodeUnlocked(i + 1);

            // Координаты центров узлов
            const x1 = node.position.x;
            const y1 = node.position.y;
            const x2 = nextNode.position.x;
            const y2 = nextNode.position.y;

            // Радиус окружности в процентах
            const radius = 2.86;

            // Определяем направление (вправо/влево)
            const goingRight = x2 > x1;

            // Линия выходит СБОКУ от первого круга
            const startX = x1 + (goingRight ? radius : -radius);
            const startY = y1;

            // Линия входит СБОКУ во второй круг
            const endX = x2 + (goingRight ? -radius : radius);
            const endY = y2;

            const verticalDistance = Math.abs(y2 - y1);

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

            return (
              <g key={`path-${node.id}`}>
                {/* Базовая серая линия */}
                <path
                  d={pathData}
                  stroke="#4b5563"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  opacity="0.3"
                  fill="none"
                />
                {/* Градиентная линия для завершённых патей */}
                {isUnlocked && isPathAnimated && (
                  <path
                    d={pathData}
                    stroke={`url(#${themeColors.gradientId})`}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="1"
                    style={{
                      strokeDasharray: "1",
                      strokeDashoffset: "0",
                      filter: "brightness(1.5) drop-shadow(0 0 3px rgba(167,139,250,0.7))",
                      opacity: 0.9,
                    }}
                  />
                )}
                {/* Анимированная линия заполнения — показываем пока не анимация не закончилась */}
                {isUnlocked && !isPathAnimated && (
                  <path
                    d={pathData}
                    stroke={`url(#${themeColors.gradientId})`}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                    pathLength="1"
                    style={{
                      strokeDasharray: "1",
                      strokeDashoffset: "1",
                      animation: `mapFillPath 2.5s cubic-bezier(0.4,0,0.2,1) forwards`,
                      animationDelay: `${i * 400}ms`,
                      filter: "brightness(1.5) drop-shadow(0 0 3px rgba(167,139,250,0.7))",
                      opacity: 0.9,
                    }}
                    onAnimationEnd={() => setAnimatedPaths((s) => new Set([...s, i]))}
                  />
                )}
              </g>
            );
          })}
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
                className={`relative transition-all duration-500 ${
                  isUnlocked
                    ? "cursor-pointer hover:scale-[1.25] active:scale-95"
                    : "cursor-not-allowed opacity-60"
                } ${newlyUnlocked.has(node.id) ? "map-node-unlock" : ""}`}
                style={{ zIndex: 10 }}
              >
                {/* Круг узла */}
                <div
                  className={`w-16 h-16 rounded-full ${
                    isCompleted
                      ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/50"
                      : isUnlocked
                      ? `bg-gradient-to-br ${node.color} shadow-2xl ${
                          isHovered ? "shadow-purple-500/50" : ""
                        }`
                      : "bg-gray-800 dark:bg-gray-900 shadow-lg"
                  } flex items-center justify-center relative ${
                    isHovered ? "ring-4 ring-purple-400 ring-opacity-50" : ""
                  }`}
                  style={{
                    filter: isUnlocked ? "brightness(1.1)" : "brightness(0.7)",
                    transform: node.isBoss ? "scale(1.2)" : "scale(1)",
                    position: "relative",
                    zIndex: 10,
                  }}
                >
                  <span
                    className={`text-3xl font-bold ${
                      isUnlocked
                        ? "filter drop-shadow-lg"
                        : "opacity-30 grayscale"
                    }`}
                  >
                    {node.icon}
                  </span>

                  {/* Прогресс */}
                  {isUnlocked && progress.total > 0 && (
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl border-2 border-white dark:border-gray-900">
                      {progress.completed}/{progress.total}
                    </div>
                  )}

                  {/* Галочка */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                      <span className="text-white text-base font-bold">✓</span>
                    </div>
                  )}

                  {/* Замок для закрытых узлов */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded-full backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Название узла внизу */}
                <div className="absolute top-full mt-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`text-base font-bold text-center px-3 py-1 rounded-full ${
                      isUnlocked
                        ? "text-gray-800 dark:text-white bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                        : "text-gray-400 dark:text-gray-600"
                    } ${
                      isHovered ? "scale-110" : ""
                    } transition-transform duration-200`}
                  >
                    {node.name}
                  </div>
                </div>

                {/* Описание при наведении - чередуется слева-справа */}
                {isHovered && isUnlocked && (
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap ${
                      index % 2 === 0 ? "left-full ml-4" : "right-full mr-4"
                    }`}
                  >
                    <div
                      className={`text-xs text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg backdrop-blur-sm max-w-xs shadow-lg ${
                        index % 2 === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      {node.description}
                    </div>
                  </div>
                )}
                {!isUnlocked && isHovered && (
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 whitespace-nowrap ${
                      index % 2 === 0 ? "left-full ml-4" : "right-full mr-4"
                    }`}
                  >
                    <div
                      className={`text-xs text-red-600 dark:text-red-400 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg ${
                        index % 2 === 0 ? "text-left" : "text-right"
                      }`}
                    >
                      Требуется {mapNodes[index - 1]?.isBoss ? "100%" : "70%"}{" "}
                      прогресса
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Проходи узлы последовательно. Новый узел открывается после 70%
          прогресса.
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Боссовые узлы требуют 100% прохождения предыдущего узла
        </div>
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
                        router.push(`/?nodeId=${selectedNode.id}`);
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
