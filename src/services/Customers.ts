import { supabase } from '@/lib/supabase';
import { Customer, CustomerInsert } from '@/types';

export async function fetchCustomers(companyId: number): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('company_contacts')
    .select('*')
    .eq('company', companyId);

  if (error) throw error;

  return data;
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
