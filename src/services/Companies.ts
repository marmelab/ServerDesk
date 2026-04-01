import { supabase } from '@/lib/supabase';
import { Company } from '@/types';

export async function fetchCompanies(onlyCount: boolean = false): Promise<{
  data: Company[];
  count: number;
}> {
  const { data, error, count } = await supabase
    .from('companies')
    .select(`id, name, created_at`, {
      count: 'exact',
      head: onlyCount,
    });
  if (error) {
    throw error;
  }
  return {
    data: data || [],
    count: count || 0,
  };
}
