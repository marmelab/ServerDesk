import { UseResourceData } from '@/lib/utils';
import { fetchTicket } from '@/services/Tickets';
import { TicketWithDetails } from '@/types';
import { useQuery } from '@tanstack/react-query';

export type FetchTicketResponse = { data: TicketWithDetails };

export function useTicket(
  ticketId: number,
): UseResourceData<TicketWithDetails | undefined, FetchTicketResponse> {
  const query = useQuery({
    queryKey: ['ticket'],
    queryFn: () => fetchTicket(ticketId),
  });

  return {
    data: query.data?.data,
    isPending: query.isPending,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}
