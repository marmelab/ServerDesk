import { UseResourceData } from '@/lib/utils';
import { fetchCustomerManagers } from '@/services/Users';
import { AppUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

export type FetchCustomerManagersResponse = { data: AppUser[] };

export function useCustomerManagers(
  companyId: number,
): UseResourceData<AppUser[], FetchCustomerManagersResponse> {
  const query = useQuery({
    queryKey: ['users', companyId],
    queryFn: () => fetchCustomerManagers(companyId),
  });

  return {
    data: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
