import { UseResourceData } from '@/lib/utils';
import { fetchTickets } from '@/services/Tickets';
import { TicketWithDetails } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseTicketsProps {
  companiesId?: number[] | null;
  page: number | null;
  onlyCount?: boolean;
}

export type FetchTicketsResponse = { data: TicketWithDetails[]; count: number };

export function useTickets({
  companiesId,
  page,
  onlyCount = false,
}: UseTicketsProps): UseResourceData<
  TicketWithDetails[],
  FetchTicketsResponse
> {
  const query = useQuery({
    queryKey: ['tickets', page, companiesId, { onlyCount }],
    queryFn: () => fetchTickets(companiesId, page, onlyCount),
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
