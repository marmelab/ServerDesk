import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/Messages';
import { UseResourceData } from '@/lib/utils';
import { MessageWithDetails } from '@/types';

export type FetchMessagesResponse = { data: MessageWithDetails[] };

export function useMessages(
  ticketId: number,
): UseResourceData<MessageWithDetails[], FetchMessagesResponse> {
  const query = useQuery({
    queryKey: ['messages', ticketId],
    queryFn: () => fetchMessages(ticketId),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data?.data ?? [],
    isPending: query.isPending,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error,
    refetch: query.refetch,
  };
}
