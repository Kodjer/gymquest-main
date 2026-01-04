# Настройка MySQL для GymQuest

## Шаг 1: Установка MySQL

### Windows

1. **Скачайте MySQL Installer:**
   - Перейдите на https://dev.mysql.com/downloads/installer/
   - Скачайте `mysql-installer-web-community` (легкая версия) или полную версию
2. **Запустите установщик:**
   - Выберите "Developer Default" или "Custom"
   - Установите:
     - MySQL Server 8.0 (или новее)
     - MySQL Workbench (опционально, для GUI)
3. **Настройка во время установки:**

   - **Тип конфигурации:** Development Computer
   - **Порт:** 3306 (по умолчанию)
   - **Root пароль:** Создайте надежный пароль (запомните его!)
   - **Метод аутентификации:** Use Strong Password Encryption
   - **Создайте пользователя** (опционально):
     - Username: `gymquest_user`
     - Password: `ваш_пароль`
     - Role: DB Admin

4. **Запустите MySQL как службу:**
   - Установщик предложит запустить MySQL Server как Windows Service
   - Отметьте "Start the MySQL Server at System Startup"

## Шаг 2: Проверка установки

Откройте PowerShell/CMD и проверьте:

```powershell
mysql --version
```

Если команда не найдена, добавьте MySQL в PATH:

- Path обычно: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

## Шаг 3: Создание базы данных

### Вариант 1: Через командную строку

```powershell
# Войдите в MySQL
mysql -u root -p

# Введите пароль root
# Затем в консоли MySQL:

CREATE DATABASE gymquest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Проверьте создание
SHOW DATABASES;

# Выйдите
EXIT;
```

### Вариант 2: Через MySQL Workbench (если установлен)

1. Откройте MySQL Workbench
2. Подключитесь к локальному серверу
3. Выполните SQL:

```sql
CREATE DATABASE gymquest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Шаг 4: Настройка проекта

1. **Скопируйте файл окружения:**

```powershell
Copy-Item .env.example .env
```

2. **Отредактируйте `.env` файл:**

```env
# Замените значения на ваши
DATABASE_URL="mysql://root:ваш_пароль@localhost:3306/gymquest"

# Или если создали отдельного пользователя:
DATABASE_URL="mysql://gymquest_user:ваш_пароль@localhost:3306/gymquest"
```

⚠️ **Важно:** Файл `.env` НЕ должен попадать в git! Он уже в `.gitignore`

## Шаг 5: Применение миграций Prisma

Теперь создадим таблицы в базе данных:

```powershell
# Генерируем Prisma Client
npx prisma generate

# Создаем миграцию и применяем ее
npx prisma migrate dev --name init

# Эта команда:
# 1. Создаст папку prisma/migrations
# 2. Создаст все таблицы в БД согласно schema.prisma
# 3. Сгенерирует Prisma Client для TypeScript
```

## Шаг 6: Проверка таблиц

### Через командную строку:

```powershell
mysql -u root -p gymquest

# В MySQL консоли:
SHOW TABLES;
DESCRIBE users;
DESCRIBE players;
DESCRIBE quests;
DESCRIBE onboarding_data;
EXIT;
```

### Через Prisma Studio (GUI для базы данных):

```powershell
npx prisma studio
```

Откроется браузер с интерфейсом для просмотра и редактирования данных.

## Шаг 7: Заполнение тестовыми данными (опционально)

Создайте файл `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Тестовый Пользователь",
    },
  });

  // Создаем профиль игрока
  const player = await prisma.player.create({
    data: {
      userId: user.id,
      level: 1,
      xp: 0,
    },
  });

  // Создаем тестовые квесты
  await prisma.quest.createMany({
    data: [
      {
        userId: user.id,
        title: "10 отжиманий",
        xpReward: 10,
        difficulty: "easy",
        status: "pending",
      },
      {
        userId: user.id,
        title: "20 приседаний",
        xpReward: 20,
        difficulty: "medium",
        status: "pending",
      },
    ],
  });

  console.log("✅ База данных заполнена тестовыми данными!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Добавьте в `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Установите ts-node (если еще не установлен):

```powershell
npm install -D ts-node
```

Запустите seed:

```powershell
npx prisma db seed
```

## Полезные команды Prisma

```powershell
# Просмотр данных в GUI
npx prisma studio

# Генерация Prisma Client после изменения schema.prisma
npx prisma generate

# Создание новой миграции
npx prisma migrate dev --name название_миграции

# Применение миграций в продакшене
npx prisma migrate deploy

# Сброс базы данных (ОСТОРОЖНО! Удалит все данные)
npx prisma migrate reset

# Форматирование schema.prisma
npx prisma format
```

## Решение проблем

### Ошибка подключения

1. **Проверьте, запущен ли MySQL:**

```powershell
Get-Service -Name MySQL*
```

2. **Запустите службу, если остановлена:**

```powershell
Start-Service -Name "MySQL80"
```

### Ошибка "Access denied"

- Проверьте правильность пароля в `.env`
- Убедитесь, что пользователь имеет права на базу `gymquest`

```sql
-- Предоставление прав пользователю
GRANT ALL PRIVILEGES ON gymquest.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Prisma не может подключиться

- Проверьте формат DATABASE_URL
- Убедитесь, что БД `gymquest` создана
- Проверьте кодировку: должна быть UTF-8

## Следующие шаги

После настройки MySQL и миграций:

1. Создайте API endpoints в `src/pages/api/`
2. Обновите клиентские хуки для работы с API
3. Протестируйте CRUD операции через Prisma Studio

Готово! 🎉 Ваша MySQL база данных настроена и готова к работе.
