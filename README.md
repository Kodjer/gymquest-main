# GymQuest

## Цель проекта

GymQuest — геймифицированное мобильное фитнес-приложение. Пользователь регистрируется, проходит онбординг (опросник и выбор персонажа), после чего система автоматически генерирует недельные квесты. За выполнение заданий начисляются XP и монеты, которые можно тратить в магазине косметики и бустов. Прогресс отображается на интерактивной карте.

## Технологии и инструменты

- **Next.js 16** (Turbopack) — фреймворк
- **React 19**, **TypeScript** — UI и типизация
- **Prisma** + **MySQL / PlanetScale** — база данных и ORM
- **NextAuth** — аутентификация (Google + credentials)
- **Tailwind CSS** — стилизация
- **Capacitor** — сборка нативного Android приложения
- **next-pwa** — поддержка PWA
- **Resend** — отправка email
- **Vercel** — деплой

## Инструкции по выполнению

### Требования

- Node.js 18+
- npm
- MySQL (локально) или облачная MySQL-совместимая БД (например PlanetScale)

### Установка

```bash
git clone https://disa.codestorage.space/oleksandr.sazonov/gymquest.git
cd gymquest
npm install
```

### Переменные окружения

Создай файл `.env.local` в корне проекта со следующими переменными:

```
DATABASE_URL=mysql://user:pass@localhost:3306/gymquest
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=случайная_строка
```

Опционально:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=...
```

### Запуск

```bash
npx prisma migrate dev
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка Android APK

```bash
npm run build
npx cap sync android
npx cap open android
```

## Структура приложения

```
gymquest/
├── android/          # Нативный Android проект (Capacitor)
├── prisma/           # Схема базы данных и миграции
├── public/           # Статические файлы
├── src/
│   ├── components/   # React компоненты
│   ├── lib/          # Утилиты и хелперы
│   ├── pages/        # Страницы и API маршруты (Next.js)
│   └── styles/       # Глобальные стили
├── .env.example      # Пример переменных окружения
├── next.config.ts    # Конфигурация Next.js
└── README.md
```

## Автор

Sazonov Oleksandr
