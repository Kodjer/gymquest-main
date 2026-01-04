# Следующие шаги для запуска GymQuest

## ✅ Что уже сделано

1. ✅ Установлен Prisma и @prisma/client
2. ✅ Создана схема базы данных (prisma/schema.prisma)
3. ✅ Обновлены переменные окружения (.env.example)
4. ✅ Созданы API endpoints для работы с БД
5. ✅ Создан опросник для новых пользователей
6. ✅ Интегрирована синхронизация с БД

## 🔧 Что нужно сделать

### Шаг 1: Установите MySQL (если еще не установлен)

Следуйте инструкциям в файле **MYSQL_SETUP.md** раздел "Установка MySQL для Windows"

Или скачайте: https://dev.mysql.com/downloads/installer/

### Шаг 2: Создайте базу данных

```powershell
# Войдите в MySQL
mysql -u root -p

# Создайте БД
CREATE DATABASE gymquest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Проверьте
SHOW DATABASES;

# Выйдите
EXIT;
```

### Шаг 3: Настройте переменные окружения

```powershell
# Скопируйте файл окружения
Copy-Item .env.example .env

# Откройте .env в редакторе и замените:
# - "password" на ваш MySQL пароль
# - "your-secret-key-here..." на случайную строку
```

Пример `.env`:

```env
DATABASE_URL="mysql://root:ВАШ_ПАРОЛЬ@localhost:3306/gymquest"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=случайная-строка-32-символа
```

### Шаг 4: Примените миграции Prisma

```powershell
# Сгенерируйте Prisma Client
npx prisma generate

# Создайте и примените миграции (создаст таблицы в БД)
npx prisma migrate dev --name init
```

### Шаг 5: Проверьте таблицы

```powershell
# Откройте Prisma Studio для просмотра БД
npx prisma studio

# Или через MySQL:
mysql -u root -p gymquest
SHOW TABLES;
EXIT;
```

Вы должны увидеть таблицы:

- users
- players
- quests
- onboarding_data
- xp_history

### Шаг 6: Запустите приложение

```powershell
npm run dev
```

Откройте http://localhost:3000

## 🎯 Первый запуск приложения

1. При первом входе вас попросят войти через NextAuth (настройте провайдеров в `src/pages/api/auth/[...nextauth].ts`)
2. После входа появится опросник с вопросами о вашем опыте
3. Заполните опросник (или пропустите)
4. Начните создавать квесты!

## ⚠️ Возможные проблемы

### MySQL не запускается

```powershell
# Проверьте службу
Get-Service -Name MySQL*

# Запустите службу
Start-Service -Name "MySQL80"
```

### Ошибка "Access denied"

- Проверьте пароль в `.env`
- Убедитесь что пользователь root имеет права

### Ошибка подключения Prisma

```powershell
# Проверьте формат DATABASE_URL
# Должен быть: mysql://USER:PASSWORD@HOST:PORT/DATABASE

# Убедитесь что БД существует
mysql -u root -p -e "SHOW DATABASES;"
```

### TypeScript ошибки

```powershell
# Пересоберите проект
npm run build
```

## 📚 Дополнительная информация

- **Полная инструкция по MySQL**: см. MYSQL_SETUP.md
- **Описание проекта**: см. README_GYMQUEST.md
- **API документация**: см. раздел "API Endpoints" в README_GYMQUEST.md

## 🎉 После запуска

Протестируйте основные функции:

1. ✅ Создание квеста
2. ✅ Выполнение квеста (получение XP)
3. ✅ Повышение уровня
4. ✅ Просмотр графика прогресса
5. ✅ Просмотр профиля
6. ✅ Переключение темы
7. ✅ Звуковые эффекты

Удачи! 🚀
