import { supabase } from '@/lib/supabase';
import { Customer, CustomerInsert } from '@/types';

export const PAGE_SIZE = 10;

export async function fetchCustomers(
  companyId: number,
  page: number,
): Promise<{ data: Customer[]; count: number }> {
  const { data, error, count } = await supabase
    .from('company_contacts')
    .select('*', { count: 'exact' })
    .eq('company_id', companyId)
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

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
