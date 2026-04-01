import { fetchTickets } from '@/services/Tickets';
import { useQuery } from '@tanstack/react-query';

interface UseTicketsProps {
  companiesId?: number[] | null;
  page: number | null;
  onlyCount?: boolean;
}

export function useTickets({
  companiesId,
  page,
  onlyCount = false,
}: UseTicketsProps) {
  const query = useQuery({
    queryKey: ['tickets', page, companiesId, { onlyCount }],
    queryFn: () => fetchTickets(companiesId, page, onlyCount),
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
