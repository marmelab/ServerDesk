import { UseResourceData } from '@/lib/utils';
import { fetchCompaniesWithTickets } from '@/services/Companies';
import { CompanyWithTickets } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseCompaniesWithTicketsProps {
  page?: number;
}
export type FetchCompaniesWithTicketsResponse = {
  data: CompanyWithTickets[];
  count: number;
};

export function useCompaniesWithTickets({
  page,
}: UseCompaniesWithTicketsProps = {}): UseResourceData<
  CompanyWithTickets[],
  FetchCompaniesWithTicketsResponse
> {
  const query = useQuery({
    queryKey: ['companies', page],
    queryFn: () => fetchCompaniesWithTickets(page),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count ?? 0,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
