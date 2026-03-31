import { supabase } from '@/lib/supabase';
import { AppUser } from '@/types';

export async function fetchUsers(): Promise<{
  data: AppUser[];
  count: number;
}> {
  const { data, error, count } = await supabase
    .from('app_user')
    .select(`*`, { count: 'exact' });
  if (error) {
    throw error;
  }
  return {
    data: data || [],
    count: count || 0,
  };
}
