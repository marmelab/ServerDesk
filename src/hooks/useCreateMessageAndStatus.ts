import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageInsert, TicketStatus } from '@/types';
import { supabase } from '@/lib/supabase';

export type MessageInsertWithStatus = MessageInsert & {
  status: TicketStatus;
};

export function useCreateMessageAndStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMessage: MessageInsertWithStatus) => {
      const { status, ...messageData } = newMessage;
      const { error } = await supabase.from('messages').insert(messageData);
      if (error) throw error;

      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ status: newMessage.status })
        .eq('id', newMessage.ticket_id);

      if (ticketError) throw ticketError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });
}
