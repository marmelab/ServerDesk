import { supabase } from '@/lib/supabase';
import { AppUser } from '@/types';

export async function fetchUsers(onlyCount: boolean = false): Promise<{
  data: AppUser[];
  count: number;
}> {
  const { data, error, count } = await supabase
    .from('app_user')
    .select(`*`, { count: 'exact', head: onlyCount });
  if (error) {
    throw error;
  }
  return {
    data: data || [],
    count: count || 0,
  };
}
