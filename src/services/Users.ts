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

export async function fetchCustomerManagers(companyId: number): Promise<{
  data: AppUser[];
}> {
  const { data, error } = await supabase
    .from('user_companies')
    .select(
      `customer_manager:app_user (
      id,
      name,
      role
      )
      `,
    )
    .eq('company_id', companyId);
  if (error) {
    throw error;
  }
  if (!data) return { data: [] };

  const managers: AppUser[] = data.map((row: any) => {
    const m = row.customer_manager;
    return {
      id: m.id,
      name: m.name,
      role: m.role,
    };
  });

  return {
    data: managers,
  };
}
