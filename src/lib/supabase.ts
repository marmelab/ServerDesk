import { createClient } from '@supabase/supabase-js';
import { Database } from 'supabase/types';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
