// src/components/ExerciseGuide.tsx
// Понятные пошаговые инструкции для упражнений

type ExerciseType =
  | "pushup"
  | "squat"
  | "plank"
  | "lunge"
  | "jumping-jack"
  | "burpee"
  | "crunch"
  | "mountain-climber"
  | "dumbbell-press"
  | "dumbbell-row"
  | "dumbbell-curl"
  | "dumbbell-shoulder"
  | "deadlift"
  | "bench-press"
  | "pull-up"
  | "dip"
  | "leg-raise"
  | "bicycle"
  | "run"
  | "walk"
  | "stretch"
  | "yoga"
  | "default";

type ExerciseGuideProps = {
  exerciseType: ExerciseType;
  title?: string;
};

// Маппинг названий упражнений на типы
export function getExerciseType(title: string): ExerciseType {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("отжимания") || lowerTitle.includes("отжимание")) {
    if (lowerTitle.includes("брус")) return "dip";
    return "pushup";
  }
  
  if (lowerTitle.includes("присед") || lowerTitle.includes("squat")) {
    return "squat";
  }
  
  if (lowerTitle.includes("планка") || lowerTitle.includes("plank")) {
    return "plank";
  }
  
  if (lowerTitle.includes("выпад") || lowerTitle.includes("lunge")) {
    return "lunge";
  }
  
  if (lowerTitle.includes("прыжк") || lowerTitle.includes("jumping")) {
    return "jumping-jack";
  }
  
  if (lowerTitle.includes("берпи") || lowerTitle.includes("burpee")) {
    return "burpee";
  }
  
  if (lowerTitle.includes("скручивани") || lowerTitle.includes("пресс") || lowerTitle.includes("crunch")) {
    return "crunch";
  }
  
  if (lowerTitle.includes("альпинист") || lowerTitle.includes("mountain")) {
    return "mountain-climber";
  }
  
  if (lowerTitle.includes("жим") && lowerTitle.includes("гантел")) {
    if (lowerTitle.includes("стоя") || lowerTitle.includes("плеч")) {
      return "dumbbell-shoulder";
    }
    return "dumbbell-press";
  }
  
  if (lowerTitle.includes("жим") && lowerTitle.includes("штанг")) {
    return "bench-press";
  }
  
  if (lowerTitle.includes("тяга") && lowerTitle.includes("гантел")) {
    return "dumbbell-row";
  }
  
  if (lowerTitle.includes("станов") || lowerTitle.includes("deadlift")) {
    return "deadlift";
  }
  
  if (lowerTitle.includes("сгибани") && lowerTitle.includes("гантел")) {
    return "dumbbell-curl";
  }
  
  if (lowerTitle.includes("бицепс") || lowerTitle.includes("curl")) {
    return "dumbbell-curl";
  }
  
  if (lowerTitle.includes("подтягив") || lowerTitle.includes("pull")) {
    return "pull-up";
  }
  
  if (lowerTitle.includes("брусь") || lowerTitle.includes("dip")) {
    return "dip";
  }
  
  if (lowerTitle.includes("подъем ног") || lowerTitle.includes("leg raise")) {
    return "leg-raise";
  }
  
  if (lowerTitle.includes("велосипед")) {
    return "bicycle";
  }
  
  if (lowerTitle.includes("бег") || lowerTitle.includes("run") || lowerTitle.includes("кардио")) {
    return "run";
  }
  
  if (lowerTitle.includes("прогулк") || lowerTitle.includes("ходьб") || lowerTitle.includes("walk")) {
    return "walk";
  }
  
  if (lowerTitle.includes("растяж") || lowerTitle.includes("stretch")) {
    return "stretch";
  }
  
  if (lowerTitle.includes("йога") || lowerTitle.includes("yoga")) {
    return "yoga";
  }
  
  return "default";
}

// Данные по упражнениям: шаги выполнения
const exerciseData: Record<ExerciseType, { 
  name: string; 
  steps: string[];
  keyPoints: string[];
  muscles: string;
}> = {
  pushup: {
    name: "Отжимания",
    steps: [
      "Примите упор лежа, руки на ширине плеч",
      "Тело прямое от головы до пяток",
      "Согните руки, опускаясь грудью к полу",
      "Оттолкнитесь и вернитесь в исходное положение"
    ],
    keyPoints: [
      "Не прогибайте поясницу",
      "Локти под углом 45 градусов к телу",
      "Опускайтесь до касания грудью пола"
    ],
    muscles: "Грудь, трицепс, плечи"
  },
  squat: {
    name: "Приседания",
    steps: [
      "Встаньте прямо, ноги на ширине плеч",
      "Отведите таз назад, как будто садитесь на стул",
      "Опуститесь до параллели бедер с полом",
      "Оттолкнитесь пятками и встаньте"
    ],
    keyPoints: [
      "Колени не выходят за носки",
      "Спина прямая, грудь вперед",
      "Вес на пятках"
    ],
    muscles: "Квадрицепс, ягодицы, бедра"
  },
  plank: {
    name: "Планка",
    steps: [
      "Примите упор лежа на предплечьях",
      "Локти под плечами, тело прямое",
      "Напрягите пресс и ягодицы",
      "Удерживайте положение заданное время"
    ],
    keyPoints: [
      "Не поднимайте и не опускайте таз",
      "Смотрите в пол, шея расслаблена",
      "Дышите ровно"
    ],
    muscles: "Кор, пресс, спина"
  },
  lunge: {
    name: "Выпады",
    steps: [
      "Встаньте прямо, руки на поясе",
      "Сделайте широкий шаг вперед",
      "Опуститесь, сгибая оба колена до 90 градусов",
      "Оттолкнитесь и вернитесь назад"
    ],
    keyPoints: [
      "Колено не выходит за носок",
      "Корпус вертикально",
      "Чередуйте ноги"
    ],
    muscles: "Квадрицепс, ягодицы, бедра"
  },
  "jumping-jack": {
    name: "Прыжки",
    steps: [
      "Встаньте прямо, ноги вместе, руки вдоль тела",
      "Прыжком расставьте ноги, руки вверх",
      "Прыжком вернитесь в исходное положение",
      "Повторяйте в быстром темпе"
    ],
    keyPoints: [
      "Приземляйтесь мягко на носки",
      "Держите ритм",
      "Руки полностью выпрямляйте"
    ],
    muscles: "Всё тело, кардио"
  },
  burpee: {
    name: "Берпи",
    steps: [
      "Из положения стоя присядьте, руки на пол",
      "Прыжком выбросьте ноги назад в упор лежа",
      "Сделайте отжимание (опционально)",
      "Прыжком подтяните ноги к рукам",
      "Выпрыгните вверх с поднятыми руками"
    ],
    keyPoints: [
      "Выполняйте плавно и контролируемо",
      "В упоре лежа тело прямое",
      "Прыжок вверх максимально высокий"
    ],
    muscles: "Всё тело, кардио"
  },
  crunch: {
    name: "Скручивания",
    steps: [
      "Лягте на спину, ноги согнуты, стопы на полу",
      "Руки за головой или скрещены на груди",
      "Поднимите плечи, скручивая корпус к коленям",
      "Медленно опуститесь назад"
    ],
    keyPoints: [
      "Не тяните себя за шею",
      "Поясница прижата к полу",
      "Выдох на подъеме"
    ],
    muscles: "Пресс"
  },
  "mountain-climber": {
    name: "Альпинист",
    steps: [
      "Примите упор лежа, руки прямые",
      "Подтяните правое колено к груди",
      "Быстро поменяйте ноги прыжком",
      "Продолжайте чередовать в быстром темпе"
    ],
    keyPoints: [
      "Таз не поднимайте",
      "Руки прямые под плечами",
      "Держите ритм"
    ],
    muscles: "Кор, кардио, плечи"
  },
  "dumbbell-press": {
    name: "Жим гантелей лежа",
    steps: [
      "Лягте на скамью, гантели в руках у груди",
      "Локти разведены в стороны под 45 градусов",
      "Выжмите гантели вверх, выпрямляя руки",
      "Медленно опустите к груди"
    ],
    keyPoints: [
      "Лопатки сведены, грудь вперед",
      "Не выгибайте поясницу сильно",
      "Контролируйте движение"
    ],
    muscles: "Грудь, трицепс, плечи"
  },
  "dumbbell-row": {
    name: "Тяга гантели",
    steps: [
      "Обопритесь коленом и рукой на скамью",
      "Вторая нога на полу, в руке гантель",
      "Тяните гантель к поясу, сводя лопатку",
      "Медленно опустите вниз"
    ],
    keyPoints: [
      "Спина параллельна полу",
      "Локоть идет вдоль тела",
      "В верхней точке задержка 1 сек"
    ],
    muscles: "Широчайшие, бицепс, спина"
  },
  "dumbbell-curl": {
    name: "Сгибания на бицепс",
    steps: [
      "Встаньте прямо, гантели в опущенных руках",
      "Ладони развернуты вперед",
      "Согните руки, поднимая гантели к плечам",
      "Медленно опустите вниз"
    ],
    keyPoints: [
      "Локти прижаты к бокам",
      "Не раскачивайте корпус",
      "Полностью выпрямляйте руки внизу"
    ],
    muscles: "Бицепс"
  },
  "dumbbell-shoulder": {
    name: "Жим гантелей стоя",
    steps: [
      "Встаньте прямо, гантели у плеч",
      "Локти разведены в стороны",
      "Выжмите гантели вверх над головой",
      "Медленно опустите к плечам"
    ],
    keyPoints: [
      "Не прогибайте поясницу",
      "Напрягите пресс",
      "Полностью выпрямляйте руки вверху"
    ],
    muscles: "Плечи, трицепс"
  },
  deadlift: {
    name: "Становая тяга",
    steps: [
      "Встаньте, штанга у голеней, хват на ширине плеч",
      "Согните ноги, отведите таз назад, спина прямая",
      "Поднимите штангу, выпрямляя ноги и корпус",
      "Медленно опустите штангу вниз"
    ],
    keyPoints: [
      "Спина прямая на протяжении всего движения",
      "Штанга скользит вдоль ног",
      "Лопатки сведены"
    ],
    muscles: "Спина, ягодицы, бедра"
  },
  "bench-press": {
    name: "Жим штанги лежа",
    steps: [
      "Лягте на скамью, ноги на полу",
      "Возьмите штангу хватом шире плеч",
      "Снимите штангу, опустите к груди",
      "Выжмите штангу вверх, выпрямляя руки"
    ],
    keyPoints: [
      "Лопатки сведены, грудь вперед",
      "Штанга касается нижней части груди",
      "Не отрывайте таз от скамьи"
    ],
    muscles: "Грудь, трицепс, плечи"
  },
  "pull-up": {
    name: "Подтягивания",
    steps: [
      "Повисните на турнике, хват шире плеч",
      "Из виса подтянитесь, поднимая подбородок выше перекладины",
      "Сведите лопатки в верхней точке",
      "Медленно опуститесь в вис"
    ],
    keyPoints: [
      "Не раскачивайтесь",
      "Тяните локти вниз и назад",
      "Полностью выпрямляйте руки внизу"
    ],
    muscles: "Широчайшие, бицепс, спина"
  },
  dip: {
    name: "Отжимания на брусьях",
    steps: [
      "Займите положение в упоре на брусьях",
      "Руки прямые, тело вертикально",
      "Согните руки, опускаясь вниз",
      "Оттолкнитесь и выпрямите руки"
    ],
    keyPoints: [
      "Наклон корпуса вперед - акцент на грудь",
      "Вертикальный корпус - акцент на трицепс",
      "Опускайтесь до угла 90 градусов в локтях"
    ],
    muscles: "Грудь, трицепс, плечи"
  },
  "leg-raise": {
    name: "Подъем ног",
    steps: [
      "Лягте на спину, руки вдоль тела",
      "Ноги прямые, вместе",
      "Поднимите ноги до вертикали",
      "Медленно опустите, не касаясь пола"
    ],
    keyPoints: [
      "Поясница прижата к полу",
      "Ноги держите прямыми",
      "Не используйте инерцию"
    ],
    muscles: "Нижний пресс"
  },
  bicycle: {
    name: "Велосипед",
    steps: [
      "Лягте на спину, руки за головой",
      "Поднимите ноги и плечи от пола",
      "Тяните правый локоть к левому колену",
      "Поменяйте стороны в движении педалирования"
    ],
    keyPoints: [
      "Не тяните себя за шею",
      "Лопатки не касаются пола",
      "Выпрямляйте ногу полностью"
    ],
    muscles: "Пресс, косые мышцы"
  },
  run: {
    name: "Бег",
    steps: [
      "Начните с легкой разминки и ходьбы",
      "Бегите в комфортном темпе",
      "Дышите ритмично: 2 шага вдох, 2 шага выдох",
      "Завершите заминкой и растяжкой"
    ],
    keyPoints: [
      "Приземляйтесь на среднюю часть стопы",
      "Держите корпус прямо",
      "Руки согнуты под 90 градусов"
    ],
    muscles: "Ноги, кардио"
  },
  walk: {
    name: "Ходьба",
    steps: [
      "Встаньте прямо, плечи расправлены",
      "Идите в умеренном темпе",
      "Делайте шаги средней длины",
      "Дышите свободно и глубоко"
    ],
    keyPoints: [
      "Перекатывайтесь с пятки на носок",
      "Руки двигаются в противофазе с ногами",
      "Смотрите вперед, не вниз"
    ],
    muscles: "Ноги, общая выносливость"
  },
  stretch: {
    name: "Растяжка",
    steps: [
      "Займите удобное положение",
      "Медленно потянитесь до легкого натяжения",
      "Удерживайте позицию 20-30 секунд",
      "Дышите глубоко и расслабленно"
    ],
    keyPoints: [
      "Не делайте резких движений",
      "Тянитесь до дискомфорта, но не до боли",
      "Не задерживайте дыхание"
    ],
    muscles: "Гибкость, мышцы всего тела"
  },
  yoga: {
    name: "Йога",
    steps: [
      "Примите указанную позу (асану)",
      "Следите за правильным положением тела",
      "Дышите глубоко и ровно",
      "Удерживайте позу заданное время"
    ],
    keyPoints: [
      "Слушайте свое тело",
      "Не форсируйте растяжку",
      "Концентрируйтесь на дыхании"
    ],
    muscles: "Гибкость, баланс, сила"
  },
  default: {
    name: "Упражнение",
    steps: [
      "Внимательно прочитайте описание",
      "Примите исходное положение",
      "Выполняйте движение контролируемо",
      "Следите за техникой и дыханием"
    ],
    keyPoints: [
      "Не торопитесь",
      "Качество важнее количества",
      "При боли прекратите выполнение"
    ],
    muscles: "См. описание"
  }
};

export function ExerciseGuide({ exerciseType, title }: ExerciseGuideProps) {
  const data = exerciseData[exerciseType] || exerciseData.default;
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 border border-blue-200 dark:border-gray-700">
      {/* Заголовок */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-200 dark:border-gray-600">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          ?
        </div>
        <span className="font-semibold text-gray-800 dark:text-white">
          Как выполнять
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {data.muscles}
        </span>
      </div>
      
      {/* Пошаговая инструкция */}
      <div className="space-y-2 mb-4">
        {data.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {step}
            </p>
          </div>
        ))}
      </div>
      
      {/* Ключевые моменты */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-gray-600">
        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2 uppercase tracking-wide">
          Важно:
        </p>
        <ul className="space-y-1">
          {data.keyPoints.map((point, index) => (
            <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
