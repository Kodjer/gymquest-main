// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Эти значения нужно будет заменить на реальные из Supabase проекта
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export interface Quest {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  tip?: string;
  xp_reward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "done";
  category?: string;
  visual_demo?: {
    type: "image" | "video" | "gif" | "youtube";
    url: string;
    thumbnail?: string;
  };
  step_by_step?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface Player {
  id?: string;
  user_id: string;
  level: number;
  xp: number;
  total_quests: number;
  completed_quests: number;
  sound_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}
