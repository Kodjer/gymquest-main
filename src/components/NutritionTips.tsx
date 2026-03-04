// src/components/NutritionTips.tsx
import { useState } from "react";
import { useAppTheme } from "@/lib/ThemeContext";

type NutritionGoal = "bulking" | "cutting";

interface FoodItem {
  name: string;
  protein: string;
  calories: string;
  benefit: string;
}

interface NutritionSection {
  title: string;
  description: string;
  dailyCalories: string;
  proteinIntake: string;
  tips: string[];
  foods: FoodItem[];
  mealTiming: string[];
  supplements?: string[];
}

const nutritionData: Record<NutritionGoal, NutritionSection> = {
  bulking: {
    title: "Набор массы",
    description: "Для роста мышц необходим профицит калорий и достаточное количество белка",
    dailyCalories: "+300–500 калорий сверх нормы",
    proteinIntake: "1.6–2.2 г на кг веса тела",
    tips: [
      "Питайтесь 4–6 раз в день небольшими порциями",
      "Потребляйте белок с каждым приёмом пищи",
      "Не забывайте про сложные углеводы для энергии",
      "Включайте здоровые жиры (орехи, авокадо, рыба)",
      "Пейте достаточно воды (2–3 литра в день)",
      "Принимайте пищу за 1–2 часа до тренировки",
      "Углеводно-белковое окно после тренировки (30–60 мин)",
    ],
    foods: [
      { name: "Куриная грудка", protein: "31г белка на 100г", calories: "165 ккал", benefit: "Низкожировой источник качественного белка" },
      { name: "Яйца", protein: "13г белка на 100г", calories: "155 ккал", benefit: "Полноценный белок + полезные жиры" },
      { name: "Творог обезжиренный", protein: "18г белка на 100г", calories: "72 ккал", benefit: "Казеиновый белок, медленное усвоение" },
      { name: "Лосось", protein: "20г белка на 100г", calories: "208 ккал", benefit: "Омега-3 + белок" },
      { name: "Овсянка", protein: "13г белка на 100г", calories: "389 ккал", benefit: "Сложные углеводы для энергии" },
      { name: "Рис бурый", protein: "7.5г белка на 100г", calories: "370 ккал", benefit: "Медленные углеводы + клетчатка" },
      { name: "Греческий йогурт", protein: "10г белка на 100г", calories: "59 ккал", benefit: "Пробиотики + качественный белок" },
      { name: "Говядина", protein: "26г белка на 100г", calories: "250 ккал", benefit: "Креатин + железо + витамины B" },
    ],
    mealTiming: [
      "Завтрак (7–8 утра): Овсянка + яйца + фрукты",
      "Перекус (10–11): Греческий йогурт + орехи",
      "Обед (13–14): Курица/рыба + рис + овощи",
      "Перед тренировкой (за 1.5ч): Банан + творог",
      "После тренировки: Протеиновый коктейль",
      "Ужин (18–19): Говядина + овощи + картофель",
      "Перед сном: Творог или казеиновый протеин",
    ],
    supplements: ["Протеиновый порошок (сывороточный)", "Креатин моногидрат (5г/день)", "Омега-3", "Витамин D3", "Магний + Цинк"],
  },
  cutting: {
    title: "Сжигание жира",
    description: "Для потери веса нужен дефицит калорий при сохранении мышечной массы",
    dailyCalories: "−300–500 калорий ниже нормы",
    proteinIntake: "2.0–2.5 г на кг веса тела",
    tips: [
      "Приоритет белку — он насыщает и сохраняет мышцы",
      "Ешьте овощи для чувства насыщения",
      "Уменьшите количество быстрых углеводов",
      "Пейте много воды (помогает контролировать аппетит)",
      "Избегайте жидких калорий (соки, сладкие напитки)",
      "Готовьте на пару, варите или запекайте без масла",
      "Используйте интервальное голодание (16/8) по желанию",
    ],
    foods: [
      { name: "Куриная грудка", protein: "31г белка на 100г", calories: "165 ккал", benefit: "Максимум белка, минимум калорий" },
      { name: "Белая рыба (треска)", protein: "18г белка на 100г", calories: "82 ккал", benefit: "Очень низкокалорийный белок" },
      { name: "Яичные белки", protein: "11г белка на 100г", calories: "52 ккал", benefit: "Чистый белок без жира" },
      { name: "Творог 0%", protein: "18г белка на 100г", calories: "71 ккал", benefit: "Надолго насыщает" },
      { name: "Брокколи", protein: "3г белка на 100г", calories: "34 ккал", benefit: "Много клетчатки, мало калорий" },
      { name: "Гречка", protein: "13г белка на 100г", calories: "343 ккал", benefit: "Сложные углеводы + насыщение" },
      { name: "Тунец в собственном соку", protein: "26г белка на 100г", calories: "116 ккал", benefit: "Высокий белок, удобно" },
      { name: "Кефир обезжиренный", protein: "3г белка на 100г", calories: "30 ккал", benefit: "Пробиотики + утоление голода" },
    ],
    mealTiming: [
      "Завтрак (8–9): Яичные белки + овощи + овсянка",
      "Перекус (11–12): Творог 0% + огурец",
      "Обед (14–15): Куриная грудка + гречка + салат",
      "Перекус (16–17): Тунец + овощи",
      "После тренировки: Протеиновый коктейль на воде",
      "Ужин (18–19): Рыба + овощи на пару",
      "При голоде вечером: Кефир или творог",
    ],
    supplements: ["Протеиновый порошок (изолят)", "BCAA", "L-карнитин", "Мультивитамины", "Омега-3"],
  },
};

export function NutritionTips() {
  const [selectedGoal, setSelectedGoal] = useState<NutritionGoal>("bulking");
  const { colors, theme } = useAppTheme();
  const isAlwaysDark = theme === "cyberpunk" || theme === "galaxy";
  const data = nutritionData[selectedGoal];

  const labelCls = "text-xs font-semibold uppercase tracking-wide opacity-40";
  const sectionCls = `${colors.cardBg} ${colors.text} rounded-2xl overflow-hidden shadow-sm`;
  const accentBar = selectedGoal === "bulking" ? "bg-violet-500" : "bg-orange-500";

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-8 space-y-3 sm:space-y-4">

      {/* Переключатель */}
      <div className={`relative ${sectionCls}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-bold">Питание</h1>
          <div className={`flex rounded-xl overflow-hidden flex-shrink-0 ${isAlwaysDark ? "bg-white/10" : "bg-black/8 dark:bg-white/8"}`}>
            <button
              onClick={() => setSelectedGoal("bulking")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors ${
                selectedGoal === "bulking"
                  ? "bg-violet-500 text-white"
                  : "opacity-50"
              }`}
            >
              Набор
            </button>
            <button
              onClick={() => setSelectedGoal("cutting")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors ${
                selectedGoal === "cutting"
                  ? "bg-orange-500 text-white"
                  : "opacity-50"
              }`}
            >
              Сушка
            </button>
          </div>
        </div>
      </div>

      {/* Основная информация */}
      <div className={`relative ${sectionCls}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
          <h2 className="text-sm sm:text-base font-bold mb-1">{data.title}</h2>
          <p className="text-xs sm:text-sm opacity-60 mb-3 sm:mb-4">{data.description}</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className={`${colors.insetBg} rounded-xl p-2.5 sm:p-3`}>
              <p className={`${labelCls} mb-1`}>Калории/день</p>
              <p className="text-xs sm:text-sm font-semibold">{data.dailyCalories}</p>
            </div>
            <div className={`${colors.insetBg} rounded-xl p-2.5 sm:p-3`}>
              <p className={`${labelCls} mb-1`}>Белок</p>
              <p className="text-xs sm:text-sm font-semibold">{data.proteinIntake}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Советы */}
      <div className={`relative ${sectionCls}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
          <p className={`${labelCls} mb-2 sm:mb-3`}>Ключевые советы</p>
          <div className="space-y-2">
            {data.tips.map((tip, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${colors.insetBg}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${accentBar}`} />
                <p className="text-sm opacity-80">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Продукты */}
      <div className={`relative ${sectionCls}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
          <p className={`${labelCls} mb-2 sm:mb-3`}>Рекомендуемые продукты</p>
          <div className="grid md:grid-cols-2 gap-2">
            {data.foods.map((food, i) => (
              <div key={i} className={`p-3 rounded-xl ${colors.insetBg}`}>
                <p className="text-sm font-semibold mb-0.5">{food.name}</p>
                <p className="text-xs opacity-60">{food.protein} · {food.calories}</p>
                <p className="text-xs opacity-40 mt-1">{food.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Режим питания */}
      <div className={`relative ${sectionCls}`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
          <p className={`${labelCls} mb-2 sm:mb-3`}>Примерный режим питания</p>
          <div className="space-y-1.5">
            {data.mealTiming.map((meal, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl ${colors.insetBg}`}>
                <span className="text-xs font-bold opacity-40 flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm opacity-80">{meal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Добавки */}
      {data.supplements && (
        <div className={`relative ${sectionCls}`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
          <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
            <p className={`${labelCls} mb-2 sm:mb-3`}>Добавки (опционально)</p>
            <div className="space-y-1.5">
              {data.supplements.map((s, i) => (
                <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${colors.insetBg}`}>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accentBar}`} />
                  <p className="text-sm opacity-80">{s}</p>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-40 mt-3">Перед приёмом добавок проконсультируйтесь с врачом</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className={`relative ${sectionCls}`}>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4">
          <p className="text-xs font-semibold opacity-60 mb-1">Важно</p>
          <p className="text-sm opacity-60">
            Это общие рекомендации. Для составления индивидуального плана обратитесь к квалифицированному диетологу.
          </p>
        </div>
      </div>
    </div>
  );
}
