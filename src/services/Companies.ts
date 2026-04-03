import { supabase } from '@/lib/supabase';
import { Company, CompanyWithTickets } from '@/types';

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

export async function fetchCompaniesWithTickets(page?: number): Promise<{
  data: CompanyWithTickets[];
  count: number;
}> {
  let query = supabase.from('companies').select(
    `
    id, 
    name, 
    created_at,
    tickets(status)
    `,
    {
      count: 'exact',
    },
  );

  if (page != null) {
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  }

  const { data, error, count } = await query;
  if (error) {
    throw error;
  }
  return {
    data: (data as CompanyWithTickets[]) || [],
    count: count || 0,
  };
}
