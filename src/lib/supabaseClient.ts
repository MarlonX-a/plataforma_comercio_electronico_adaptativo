import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Keep the app renderable even when env vars are missing in local setup.
  console.warn(
    'Supabase no está configurado (faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY). Se usarán valores de respaldo para evitar que la app se bloquee.',
  );
}

const fallbackSupabaseUrl = 'http://127.0.0.1:54321';
const fallbackSupabaseAnonKey = 'public-anon-key';

export const supabase = createClient<Database>(
  supabaseUrl ?? fallbackSupabaseUrl,
  supabaseAnonKey ?? fallbackSupabaseAnonKey,
);
