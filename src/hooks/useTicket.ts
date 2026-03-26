import { fetchTicket } from '@/services/Tickets';
import { useQuery } from '@tanstack/react-query';

export function useTicket(ticketId: number) {
  const query = useQuery({
    queryKey: ['ticket'],
    queryFn: () => fetchTicket(ticketId),
  });

  return {
    ticket: query.data?.data,
    isPending: query.isPending,
    error: query.error,
  };
}
