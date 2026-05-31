import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabasekey: string = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabasekey) {
    throw new Error('Faltan variables de entorno de Supabase.')
}

export const supabase = createClient<Database>(supabaseUrl, supabasekey);