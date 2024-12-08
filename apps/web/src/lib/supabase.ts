import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../types/database';

export const createClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}; 