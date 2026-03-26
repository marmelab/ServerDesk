import { supabase } from '@/lib/supabase';
import { MessageWithDetails } from '@/types';

export async function fetchMessages(
  ticketId: number,
): Promise<{ data: MessageWithDetails[] }> {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
            *,
            sender:app_user!sender_id(name, role)
        `,
    )
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return {
    data: data,
  };
}
