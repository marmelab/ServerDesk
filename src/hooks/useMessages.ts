import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/Messages';

export function useMessages(ticketId: number) {
  const query = useQuery({
    queryKey: ['messages', ticketId],
    queryFn: () => fetchMessages(ticketId),
    placeholderData: (previousData) => previousData,
  });

  return {
    messages: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
  };
}
