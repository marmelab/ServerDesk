import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageInsert } from '@/types';
import { supabase } from '@/lib/supabase';

export function useCreateMessage() {
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
