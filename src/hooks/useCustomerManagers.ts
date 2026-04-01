import { fetchCustomerManager } from '@/services/Users';
import { useQuery } from '@tanstack/react-query';

export function useCustomerManagers(companyId: number) {
  const query = useQuery({
    queryKey: ['users', companyId],
    queryFn: () => fetchCustomerManager(companyId),
  });

  return {
    customerManagers: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
