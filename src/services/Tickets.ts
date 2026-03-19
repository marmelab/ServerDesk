import { supabase } from '@/lib/supabase';
import { TicketWithCompany } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchTickets(
  page: number,
): Promise<{ data: TicketWithCompany[]; count: number }> {
  const { data, error, count } = await supabase
    .from('tickets')
    .select('*, company:companies(name)', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  if (error) throw error;
  return {
    data: (data as TicketWithCompany[]) || [],
    count: count || 0,
  };
}
