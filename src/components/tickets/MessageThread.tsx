import { TicketWithDetails } from '@/types';
import TicketMessage from './TicketMessage';
import { useMessages } from '@/hooks/useMessages';

interface MessageThreadProps {
  ticket: TicketWithDetails;
}

export default function MessageThread({ ticket }: MessageThreadProps) {
  const { messages, isPending, error: queryError } = useMessages(ticket.id);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col p-4">
        <TicketMessage
          message={ticket.description}
          role="customer_manager"
          id={ticket.id}
          created_at={ticket.created_at}
          name={ticket.creator?.name}
        />
        {!isPending && !queryError ? (
          messages.map((message) => (
            <TicketMessage
              message={message.text}
              role={message.sender?.role}
              id={message.id}
              created_at={message.created_at}
              name={message.sender?.name}
            />
          ))
        ) : queryError ? (
          <p> Error while retrieving messages...</p>
        ) : (
          <p>Loading messages...</p>
        )}
      </div>
    </div>
  );
}
