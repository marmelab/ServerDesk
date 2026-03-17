import { supabase } from '@/lib/supabase';
import { Company } from '@/types';

export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, created_at');
  if (error) {
    throw error;
  }
  return data || [];
}
