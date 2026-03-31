import { fetchTickets } from '@/services/Tickets';
import { useQuery } from '@tanstack/react-query';

interface useTicketsProps {
  companiesId?: number[] | null;
  page: number | null;
}

export function useTickets({ companiesId, page }: useTicketsProps) {
  const query = useQuery({
    queryKey: ['tickets', page, companiesId],
    queryFn: () => fetchTickets(companiesId, page),
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
