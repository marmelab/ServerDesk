import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketInsert } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAddTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTicket: TicketInsert) => {
      const { error } = await supabase.from('tickets').insert(newTicket);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created successfully!');
    },
  });
}
