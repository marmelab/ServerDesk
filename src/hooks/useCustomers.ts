import { fetchCustomers } from '@/services/Customers';
import { useQuery } from '@tanstack/react-query';

interface UseCustomersProps {
  companiesId?: number[];
  page?: number;
  onlyCount?: boolean;
}

export function useCustomers({
  companiesId,
  page,
  onlyCount = false,
}: UseCustomersProps = {}) {
  const query = useQuery({
    queryKey: ['customers', companiesId, page, { onlyCount }],
    queryFn: () => fetchCustomers(companiesId, page, onlyCount),
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
