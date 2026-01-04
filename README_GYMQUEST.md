# GymQuest 🏋️‍♂️

Геймифицированное приложение для отслеживания фитнес-целей с системой квестов, уровней и достижений.

## 🌟 Особенности

- ✅ **Система квестов** - создавайте задачи и получайте XP за их выполнение
- 📊 **Система уровней** - прокачивайте своего персонажа
- 📈 **Графики прогресса** - отслеживайте свой рост
- 🎨 **Темная/светлая тема** - настройте интерфейс под себя
- 🔊 **Звуковые эффекты** - получайте награды со звуком
- 📝 **Опросник для новых пользователей** - персонализированный опыт
- 🔐 **Авторизация через NextAuth** - безопасный вход
- 💾 **MySQL база данных** - надежное хранение данных
- 🔄 **Синхронизация** - работа онлайн и офлайн

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 16+ и npm
- MySQL 8.0+
- Git

### 1. Клонирование репозитория

```bash
git clone <your-repo-url>
cd gymquest
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка MySQL

📖 **Подробная инструкция**: [MYSQL_SETUP.md](./MYSQL_SETUP.md)

Или кратко:

```bash
# Создайте базу данных
mysql -u root -p
CREATE DATABASE gymquest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Настройка переменных окружения

```bash
# Скопируйте пример файла
Copy-Item .env.example .env

# Отредактируйте .env и укажите:
# - DATABASE_URL с вашими учетными данными MySQL
# - NEXTAUTH_SECRET (сгенерируйте: openssl rand -base64 32)
```

Пример `.env`:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/gymquest"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ваш-секретный-ключ
```

### 5. Применение миграций Prisma

```bash
# Генерируем Prisma Client
npx prisma generate

# Создаем и применяем миграции
npx prisma migrate dev --name init
```

### 6. Запуск приложения

```bash
# Режим разработки
npm run dev

# Открыть в браузере
# http://localhost:3000
```

## 📦 Структура проекта

```
gymquest/
├── prisma/
│   └── schema.prisma        # Схема базы данных
├── public/
│   └── manifest.json        # PWA манифест
├── src/
│   ├── components/          # React компоненты
│   │   ├── OnboardingQuestionnaire.tsx
│   │   ├── PlayerCard.tsx
│   │   ├── AddQuestForm.tsx
│   │   └── ...
│   ├── lib/                 # Утилиты и хуки
│   │   ├── prisma.ts        # Prisma Client
│   │   ├── useDBSync.ts     # Синхронизация с БД
│   │   ├── usePlayer.tsx    # Хук игрока
│   │   └── ...
│   ├── pages/
│   │   ├── api/             # API маршруты
│   │   │   ├── quests/      # CRUD для квестов
│   │   │   └── player/      # Профиль и опросник
│   │   ├── index.tsx        # Главная страница
│   │   └── profile.tsx      # Профиль пользователя
│   └── styles/
│       └── globals.css      # Глобальные стили
├── .env                     # Переменные окружения (не в git!)
├── .env.example             # Пример настроек
├── MYSQL_SETUP.md           # Инструкция по MySQL
└── README.md                # Этот файл
```

## 🗄️ Схема базы данных

### Таблицы

- **users** - пользователи (NextAuth)
- **players** - профили игроков с XP и уровнями
- **quests** - задачи/квесты пользователей
- **onboarding_data** - данные опросника новых пользователей
- **xp_history** - история получения XP для графиков

См. [prisma/schema.prisma](./prisma/schema.prisma) для деталей.

## 🔧 API Endpoints

### Квесты

- `GET /api/quests` - получить все квесты
- `POST /api/quests` - создать квест
- `PUT /api/quests/[id]` - обновить квест
- `DELETE /api/quests/[id]` - удалить квест

### Игрок

- `GET /api/player` - получить профиль игрока
- `PUT /api/player` - обновить профиль
- `POST /api/player/onboarding` - сохранить данные опросника
- `GET /api/player/onboarding` - получить данные опросника

## 🛠️ Полезные команды

```bash
# Разработка
npm run dev              # Запуск dev сервера
npm run build            # Сборка для продакшена
npm start                # Запуск продакшен сервера

# Prisma
npx prisma studio        # GUI для просмотра БД
npx prisma generate      # Генерация Prisma Client
npx prisma migrate dev   # Создание миграции
npx prisma db seed       # Заполнение тестовыми данными
npx prisma format        # Форматирование schema.prisma

# Утилиты
npm run lint             # Проверка кода
```

## 🎮 Как использовать

1. **Первый вход**

   - Войдите через NextAuth
   - Заполните опросник (возраст, вес, цели, и т.д.)

2. **Создание квестов**

   - Добавьте задачу (например: "20 отжиманий")
   - Выберите сложность (easy/medium/hard)
   - Укажите награду XP

3. **Выполнение квестов**

   - Отметьте квест как выполненный
   - Получите XP и прокачайте уровень!

4. **Отслеживание прогресса**
   - Просматривайте графики XP
   - Отслеживайте свой уровень
   - Смотрите статистику в профиле

## 🎨 Технологии

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL + Prisma ORM
- **Auth**: NextAuth.js
- **Charts**: Chart.js

## 📱 PWA Support

Приложение поддерживает установку как PWA (Progressive Web App):

- Работа офлайн
- Иконка на главном экране
- Push-уведомления (в разработке)

## 🤝 Разработка

### Добавление новых фич

1. Обновите Prisma схему в `prisma/schema.prisma`
2. Создайте миграцию: `npx prisma migrate dev --name feature_name`
3. Добавьте API endpoints в `src/pages/api/`
4. Создайте компоненты в `src/components/`
5. Обновите типы TypeScript

### Тестирование

```bash
# Просмотр БД в GUI
npx prisma studio
```

## 📝 TODO

- [ ] Система достижений
- [ ] Социальные фичи (друзья, соревнования)
- [ ] Push-уведомления
- [ ] Мобильное приложение (React Native)
- [ ] Интеграция с фитнес-трекерами
- [ ] Персональные рекомендации на основе опросника

## 🐛 Решение проблем

### Ошибка подключения к БД

Убедитесь что:

- MySQL сервис запущен
- Правильные учетные данные в `.env`
- База данных `gymquest` создана

### Ошибка Prisma Client

```bash
npx prisma generate
```

### Проблемы с миграциями

```bash
npx prisma migrate reset  # ОСТОРОЖНО: удалит все данные!
npx prisma migrate dev
```

## 📄 Лицензия

MIT

## 👤 Автор

Кишкодер17

---

Сделано с 💪 и ❤️
