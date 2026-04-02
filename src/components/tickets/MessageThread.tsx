import { TicketWithDetails } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import MessageThreadView from './MessageThreadView';

interface MessageThreadProps {
  ticket: TicketWithDetails;
}

export default function MessageThread({ ticket }: MessageThreadProps) {
  const { data, isPending, error } = useMessages(ticket.id);

  return (
    <MessageThreadView
      ticket={ticket}
      messages={data}
      isPending={isPending}
      error={error}
    />
  );
}
