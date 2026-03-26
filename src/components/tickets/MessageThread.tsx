import { TicketWithDetails } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import MessageThreadView from './MessageThreadView';

interface MessageThreadProps {
  ticket: TicketWithDetails;
}

export default function MessageThread({ ticket }: MessageThreadProps) {
  const { messages, isPending, error } = useMessages(ticket.id);

  return (
    <MessageThreadView
      ticket={ticket}
      messages={messages}
      isPending={isPending}
      error={error}
    />
  );
}
