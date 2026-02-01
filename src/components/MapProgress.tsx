// src/components/MapProgress.tsx
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";

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
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
    let nodeQuests = quests.filter((q) => q.nodeId === nodeId);

    // Применяем фильтр по локации
    nodeQuests = nodeQuests.filter((q) => {
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

  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Карта прогресса
      </h2>

      {/* Слайдер для выбора локации */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
            Где тренируемся?
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLocationFilter("home");
                onLocationFilterChange?.("home");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                locationFilter === "home"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Дома
            </button>
            <button
              onClick={() => {
                setLocationFilter("gym");
                onLocationFilterChange?.("gym");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                locationFilter === "gym"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              В зале
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            {locationFilter === "home" &&
              "Упражнения без спортивного инвентаря"}
            {locationFilter === "gym" &&
              "Упражнения со спортивным инвентарем"}
          </p>
        </div>
      </div>

      <div className="relative h-[800px] px-16 py-12 overflow-visible">
        {/* Декоративные облака с плавным движением */}
        <div
          className="absolute -top-20 -left-10 text-6xl opacity-10 animate-float"
          style={{ animationDelay: "0s" }}
        >
          ☁️
        </div>
        <div
          className="absolute top-20 -right-16 text-5xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        >
          ☁️
        </div>
        <div
          className="absolute -bottom-16 left-20 text-7xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        >
          ☁️
        </div>
        <div
          className="absolute bottom-40 -right-12 text-4xl opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        >
          ☁️
        </div>

        {/* Плавные соединительные линии */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="75%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
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

            return (
              <g key={`path-${node.id}`}>
                <path
                  d={pathData}
                  stroke={isUnlocked ? "url(#lineGradient)" : "#4b5563"}
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  opacity={isUnlocked ? "0.6" : "0.3"}
                  fill="none"
                  className="transition-all duration-500"
                />
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
                }`}
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
          // Вычисляем данные сразу, когда selectedNode существует
          const nodeQuests = getNodeQuests(selectedNode.id);
          const progress = getNodeProgress(selectedNode.id);

          return (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedNode(null)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedNode.color} flex items-center justify-center text-4xl shadow-lg`}
                    >
                      {selectedNode.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {selectedNode.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedNode.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Прогресс узла */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Прогресс узла
                      </span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {progress.completed} / {progress.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
                      {progress.percent}% завершено
                    </div>
                  </div>

                  {/* Информация о квестах узла */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                          {nodeQuests.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Всего квестов
                        </div>
                      </div>
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                          {progress.completed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Выполнено
                        </div>
                      </div>
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                          {nodeQuests.length - progress.completed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Осталось
                        </div>
                      </div>
                    </div>

                    {nodeQuests.length > 0 ? (
                      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Готовы начать тренировку? Нажмите кнопку ниже!
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          В этом узле пока нет квестов
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Сгенерируйте новые квесты, чтобы продолжить!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Кнопка начать тренировку */}
                  {nodeQuests.length > 0 && (
                    <button
                      onClick={() => {
                        router.push(`/?nodeId=${selectedNode.id}`);
                        setSelectedNode(null);
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                    >
                      Начать тренировку
                    </button>
                  )}

                  {/* Кнопка закрытия */}
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
