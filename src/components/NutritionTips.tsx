// src/components/NutritionTips.tsx
import { useState } from "react";

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
    title: "🏋️ Питание для Набора Массы",
    description: "Для роста мышц необходим профицит калорий и достаточное количество белка",
    dailyCalories: "+300-500 калорий сверх нормы",
    proteinIntake: "1.6-2.2 г на кг веса тела",
    tips: [
      "Питайтесь 4-6 раз в день небольшими порциями",
      "Потребляйте белок с каждым приёмом пищи",
      "Не забывайте про сложные углеводы для энергии",
      "Включайте здоровые жиры (орехи, авокадо, рыба)",
      "Пейте достаточно воды (2-3 литра в день)",
      "Принимайте пищу за 1-2 часа до тренировки",
      "Углеводно-белковое окно после тренировки (30-60 мин)",
    ],
    foods: [
      {
        name: "Куриная грудка",
        protein: "31г белка на 100г",
        calories: "165 ккал",
        benefit: "Низкожировой источник качественного белка",
      },
      {
        name: "Яйца",
        protein: "13г белка на 100г",
        calories: "155 ккал",
        benefit: "Полноценный белок + полезные жиры",
      },
      {
        name: "Творог (обезжиренный)",
        protein: "18г белка на 100г",
        calories: "72 ккал",
        benefit: "Казеиновый белок, медленное усвоение",
      },
      {
        name: "Лосось",
        protein: "20г белка на 100г",
        calories: "208 ккал",
        benefit: "Омега-3 жирные кислоты + белок",
      },
      {
        name: "Овсянка",
        protein: "13г белка на 100г",
        calories: "389 ккал",
        benefit: "Сложные углеводы для энергии",
      },
      {
        name: "Рис (бурый)",
        protein: "7.5г белка на 100г",
        calories: "370 ккал",
        benefit: "Медленные углеводы + клетчатка",
      },
      {
        name: "Греческий йогурт",
        protein: "10г белка на 100г",
        calories: "59 ккал",
        benefit: "Пробиотики + качественный белок",
      },
      {
        name: "Говядина",
        protein: "26г белка на 100г",
        calories: "250 ккал",
        benefit: "Креатин + железо + витамины группы B",
      },
      {
        name: "Орехи (миндаль)",
        protein: "21г белка на 100г",
        calories: "579 ккал",
        benefit: "Здоровые жиры + витамин E",
      },
      {
        name: "Бананы",
        protein: "1.1г белка на 100г",
        calories: "89 ккал",
        benefit: "Быстрые углеводы + калий",
      },
    ],
    mealTiming: [
      "Завтрак (7-8 утра): Овсянка + яйца + фрукты",
      "Перекус (10-11 утра): Греческий йогурт + орехи",
      "Обед (13-14 часов): Курица/рыба + рис + овощи",
      "Перед тренировкой (за 1.5 часа): Банан + творог",
      "После тренировки (сразу): Протеиновый коктейль",
      "Ужин (18-19 часов): Говядина + овощи + картофель",
      "Перед сном: Творог или казеиновый протеин",
    ],
    supplements: [
      "Протеиновый порошок (сывороточный)",
      "Креатин моногидрат (5г в день)",
      "Омега-3 жирные кислоты",
      "Витамин D3",
      "Магний + Цинк",
    ],
  },
  cutting: {
    title: "🔥 Питание для Сжигания Жира",
    description: "Для потери веса нужен дефицит калорий при сохранении мышечной массы",
    dailyCalories: "-300-500 калорий ниже нормы",
    proteinIntake: "2.0-2.5 г на кг веса тела (выше для сохранения мышц)",
    tips: [
      "Приоритет белку - он насыщает и сохраняет мышцы",
      "Ешьте овощи для чувства насыщения (низкокалорийные)",
      "Уменьшите количество быстрых углеводов",
      "Пейте много воды (помогает контролировать аппетит)",
      "Избегайте жидких калорий (соки, сладкие напитки)",
      "Готовьте на пару, варите или запекайте без масла",
      "Используйте интервальное голодание (16/8) по желанию",
    ],
    foods: [
      {
        name: "Куриная грудка",
        protein: "31г белка на 100г",
        calories: "165 ккал",
        benefit: "Максимум белка, минимум калорий",
      },
      {
        name: "Белая рыба (треска)",
        protein: "18г белка на 100г",
        calories: "82 ккал",
        benefit: "Очень низкокалорийный белок",
      },
      {
        name: "Яичные белки",
        protein: "11г белка на 100г",
        calories: "52 ккал",
        benefit: "Чистый белок без жира",
      },
      {
        name: "Творог (0% жирности)",
        protein: "18г белка на 100г",
        calories: "71 ккал",
        benefit: "Надолго насыщает",
      },
      {
        name: "Брокколи",
        protein: "3г белка на 100г",
        calories: "34 ккал",
        benefit: "Много клетчатки, мало калорий",
      },
      {
        name: "Шпинат",
        protein: "2.9г белка на 100г",
        calories: "23 ккал",
        benefit: "Витамины + минералы + клетчатка",
      },
      {
        name: "Гречка",
        protein: "13г белка на 100г",
        calories: "343 ккал",
        benefit: "Сложные углеводы + насыщение",
      },
      {
        name: "Тунец (в собственном соку)",
        protein: "26г белка на 100г",
        calories: "116 ккал",
        benefit: "Высокий белок, удобно",
      },
      {
        name: "Огурцы",
        protein: "0.7г белка на 100г",
        calories: "15 ккал",
        benefit: "Объём без калорий",
      },
      {
        name: "Кефир (обезжиренный)",
        protein: "3г белка на 100г",
        calories: "30 ккал",
        benefit: "Пробиотики + утоление голода",
      },
    ],
    mealTiming: [
      "Завтрак (8-9 утра): Яичные белки + овощи + овсянка",
      "Перекус (11-12 часов): Творог 0% + огурец",
      "Обед (14-15 часов): Куриная грудка + гречка + салат",
      "Перекус (16-17 часов): Тунец + овощи",
      "После тренировки: Протеиновый коктейль на воде",
      "Ужин (18-19 часов): Рыба + овощи на пару",
      "При голоде вечером: Кефир или творог",
    ],
    supplements: [
      "Протеиновый порошок (изолят)",
      "BCAA (для сохранения мышц)",
      "L-карнитин (поддержка жиросжигания)",
      "Мультивитамины",
      "Омега-3",
    ],
  },
};

export function NutritionTips() {
  const [selectedGoal, setSelectedGoal] = useState<NutritionGoal>("bulking");
  const data = nutritionData[selectedGoal];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        💪 Руководство по Питанию
      </h1>

      {/* Переключатель целей */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setSelectedGoal("bulking")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            selectedGoal === "bulking"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          🏋️ Набор массы
        </button>
        <button
          onClick={() => setSelectedGoal("cutting")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            selectedGoal === "cutting"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          🔥 Сжигание жира
        </button>
      </div>

      {/* Основная информация */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          {data.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {data.description}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              📊 Калории в день
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {data.dailyCalories}
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
              🥩 Потребление белка
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {data.proteinIntake}
            </p>
          </div>
        </div>
      </div>

      {/* Советы */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          💡 Ключевые советы
        </h3>
        <ul className="space-y-2">
          {data.tips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
            >
              <span className="text-green-500 text-xl flex-shrink-0">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Продукты */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          🍽️ Рекомендуемые продукты
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.foods.map((food, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {food.name}
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-purple-600 dark:text-purple-400 font-medium">
                  {food.protein}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {food.calories}
                </p>
                <p className="text-gray-700 dark:text-gray-300 italic mt-2">
                  {food.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Режим питания */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          ⏰ Примерный режим питания
        </h3>
        <div className="space-y-3">
          {data.mealTiming.map((meal, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-2xl">{index === 0 ? "🌅" : index === data.mealTiming.length - 1 ? "🌙" : index === 4 ? "💪" : "🍴"}</span>
              <p className="text-gray-700 dark:text-gray-300">{meal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Добавки */}
      {data.supplements && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            💊 Рекомендуемые добавки (опционально)
          </h3>
          <ul className="space-y-2">
            {data.supplements.map((supplement, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="text-blue-500 text-xl">•</span>
                <span>{supplement}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
            ⚠️ Перед приёмом добавок проконсультируйтесь с врачом или
            диетологом
          </p>
        </div>
      )}

      {/* Предупреждение */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-2 text-yellow-900 dark:text-yellow-200 flex items-center gap-2">
          ⚠️ Важная информация
        </h3>
        <p className="text-yellow-800 dark:text-yellow-300 text-sm">
          Это общие рекомендации. Для составления индивидуального плана питания
          обратитесь к квалифицированному диетологу или нутрициологу.
          Учитывайте свои особенности здоровья, аллергии и противопоказания.
        </p>
      </div>
    </div>
  );
}
