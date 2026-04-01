import { supabase } from '@/lib/supabase';
import { Company } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchCompanies(
  page?: number,
  onlyCount: boolean = false,
): Promise<{
  data: Company[];
  count: number;
}> {
  let query = supabase.from('companies').select(`id, name, created_at`, {
    count: 'exact',
    head: onlyCount,
  });

  if (page != null) {
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  }

  const { data, error, count } = await query;
  if (error) {
    throw error;
  }
  return {
    data: data || [],
    count: count || 0,
  };
}
