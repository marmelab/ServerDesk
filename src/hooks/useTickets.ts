import { fetchTickets } from '@/services/Tickets';
import { useQuery } from '@tanstack/react-query';

export function useTickets(page: number) {
  const query = useQuery({
    queryKey: ['tickets', page],
    queryFn: () => fetchTickets(page),
    placeholderData: (previousData) => previousData,
  });

  return {
    tickets: query.data?.data ?? [],
    totalCount: query.data?.count ?? 0,
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
