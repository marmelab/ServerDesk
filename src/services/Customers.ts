import { supabase } from '@/lib/supabase';
import { Customer, CustomerInsert } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchCustomers(
  companiesId?: number[],
  page?: number,
  onlyCount: boolean = false,
): Promise<{ data: Customer[]; count: number }> {
  let query = supabase.from('company_contacts').select('*', {
    count: 'exact',
    head: onlyCount,
  });

  if (companiesId != null) {
    query = query.in('company_id', companiesId);
  }

  query = query.order('created_at', { ascending: false });

  if (page != null) {
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
  };
}

export async function createCustomer(
  newCustomer: CustomerInsert,
): Promise<void> {
  const { error } = await supabase.from('company_contacts').insert(newCustomer);
  if (error) throw error;
}

export async function deleteCustomer(customerId: number): Promise<void> {
  const { error } = await supabase
    .from('company_contacts')
    .delete()
    .eq('id', customerId);
  if (error) throw error;
}

export async function updateCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase
    .from('company_contacts')
    .update(customer)
    .eq('id', customer.id);
  if (error) throw error;
}
