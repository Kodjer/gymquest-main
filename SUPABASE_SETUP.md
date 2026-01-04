# GymQuest - Настройка синхронизации данных

## 🔄 Supabase Setup (Синхронизация данных)

### 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project" 
3. Войдите через GitHub
4. Создайте новый проект:
   - **Name**: gymquest
   - **Password**: надежный пароль для БД
   - **Region**: ближайший регион (Europe West)

### 2. Настройка базы данных

1. Перейдите в **SQL Editor** 
2. Создайте новый query
3. Скопируйте и выполните SQL из `src/lib/supabase.ts`:

```sql
-- Таблица для игроков
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_quests INTEGER DEFAULT 0,
  completed_quests INTEGER DEFAULT 0,
  sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для квестов
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  status TEXT CHECK (status IN ('pending', 'done')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_quests_user_id ON quests(user_id);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);

-- RLS (Row Level Security) политики
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

-- Политики доступа (пользователи видят только свои данные)
CREATE POLICY "Users can view own player data" ON players FOR SELECT USING (user_id = current_user::text);
CREATE POLICY "Users can insert own player data" ON players FOR INSERT WITH CHECK (user_id = current_user::text);
CREATE POLICY "Users can update own player data" ON players FOR UPDATE USING (user_id = current_user::text);

CREATE POLICY "Users can view own quests" ON quests FOR SELECT USING (user_id = current_user::text);
CREATE POLICY "Users can insert own quests" ON quests FOR INSERT WITH CHECK (user_id = current_user::text);
CREATE POLICY "Users can update own quests" ON quests FOR UPDATE USING (user_id = current_user::text);
CREATE POLICY "Users can delete own quests" ON quests FOR DELETE USING (user_id = current_user::text);
```

### 3. Получение API ключей

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: https://abcdefgh.supabase.co)
   - **anon/public** ключ

### 4. Настройка environment variables

Создайте файл `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Активация синхронизации

В `src/pages/index.tsx` добавьте:

```tsx
import { SyncStatus } from "../components/SyncStatus";
import { useSupabaseSync } from "../lib/useSupabaseSync";

// В компоненте Home:
const { syncQuests, syncPlayer } = useSupabaseSync();

// После изменения квестов или игрока:
useEffect(() => {
  syncQuests(quests).then(setQuests);
  syncPlayer(player);
}, [quests, player]);
```

В навигацию добавьте:
```tsx
<SyncStatus className="hidden md:flex" />
```

## 🎯 Результат

После настройки получите:

✅ **Автоматическая синхронизация** квестов и профиля  
✅ **Работа оффлайн** с синхронизацией при подключении  
✅ **Мульти-устройство** - данные синхронизируются между устройствами  
✅ **Безопасность** - RLS защищает данные пользователей  
✅ **Индикатор статуса** - видно состояние синхронизации  

## �� Дальнейшее развитие

- **Аутентификация** через NextAuth + Supabase Auth
- **Командные квесты** для совместного выполнения 
- **Рейтинги** между пользователями
- **Социальные функции** (друзья, достижения)
- **Уведомления** о новых квестах
- **Экспорт данных** в JSON/CSV
