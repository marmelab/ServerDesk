import { UseResourceData } from '@/lib/utils';
import { fetchCustomers } from '@/services/Customers';
import { Customer } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseCustomersProps {
  companiesId?: number[];
  page?: number;
  onlyCount?: boolean;
}

export type FetchCustomersResponse = { data: Customer[]; count: number };

export function useCustomers({
  companiesId,
  page,
  onlyCount = false,
}: UseCustomersProps = {}): UseResourceData<
  Customer[],
  FetchCustomersResponse
> {
  const query = useQuery({
    queryKey: ['customers', companiesId, page, { onlyCount }],
    queryFn: () => fetchCustomers(companiesId, page, onlyCount),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data?.data ?? [],
    count: query.data?.count ?? 0,
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
