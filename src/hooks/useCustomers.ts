import { fetchCustomers } from '@/services/Customers';
import { useQuery } from '@tanstack/react-query';

export function useCustomers(companiesId?: number[], page?: number) {
  const query = useQuery({
    queryKey: ['customers', companiesId, page],
    queryFn: () => fetchCustomers(companiesId, page),
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
