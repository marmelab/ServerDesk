import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageInsert } from '@/types';
import { supabase } from '@/lib/supabase';
import { fetchMessages } from '@/services/Messages';

export function useAddMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMessage: MessageInsert) => {
      const { error } = await supabase.from('messages').insert(newMessage);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

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
