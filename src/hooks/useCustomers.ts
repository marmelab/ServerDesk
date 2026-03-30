import { fetchCustomers } from '@/services/Customers';
import { useQuery } from '@tanstack/react-query';

export function useCustomers(companyId: number | undefined) {
  const query = useQuery({
    queryKey: ['customers', companyId],
    queryFn: () => {
      if (companyId === undefined) throw new Error('Company ID required');
      fetchCustomers(companyId);
    },
    enabled: !!companyId,
    placeholderData: (previousData) => previousData,
  });

  return {
    customers: query.data ?? [],
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
