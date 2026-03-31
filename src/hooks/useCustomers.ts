import { fetchCustomers } from '@/services/Customers';
import { useQuery } from '@tanstack/react-query';

export function useCustomers(companyId: number | undefined, page: number) {
  const query = useQuery({
    queryKey: ['customers', companyId, page],
    queryFn: () => {
      if (companyId === undefined) throw new Error('Company ID required');
      return fetchCustomers(companyId, page);
    },
    enabled: !!companyId,
    placeholderData: (previousData) => previousData,
  });

  return {
    customers: query.data?.data ?? [],
    totalCount: query.data?.count ?? 0,
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
