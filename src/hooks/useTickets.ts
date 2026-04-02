import { UseResourceData } from '@/lib/utils';
import { fetchTickets } from '@/services/Tickets';
import { TicketPriority, TicketStatus, TicketWithDetails } from '@/types';
import { useQuery } from '@tanstack/react-query';

export interface TicketFilters {
  searchLabel?: string;
  status?: TicketStatus[];
  priority?: TicketPriority;
  companies?: number[];
}

interface UseTicketsProps {
  page: number | null;
  onlyCount?: boolean;
  filters?: TicketFilters;
}

export type FetchTicketsResponse = { data: TicketWithDetails[]; count: number };

export function useTickets({
  page,
  onlyCount = false,
  filters,
}: UseTicketsProps): UseResourceData<
  TicketWithDetails[],
  FetchTicketsResponse
> {
  const query = useQuery({
    queryKey: ['tickets', page, filters, { onlyCount }],
    queryFn: () => fetchTickets(filters, page, onlyCount),
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
