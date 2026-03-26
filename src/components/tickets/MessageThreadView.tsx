import { MessageWithDetails, TicketWithDetails } from '@/types';
import TicketMessage from './TicketMessage';

interface MessageThreadViewProps {
  ticket: TicketWithDetails;
  messages: MessageWithDetails[];
  isPending: boolean;
  error: any;
}

export default function MessageThreadView({
  ticket,
  messages,
  isPending,
  error,
}: MessageThreadViewProps) {
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
        {!isPending && !error ? (
          messages.map((message) => (
            <TicketMessage
              message={message.text}
              role={message.sender?.role}
              id={message.id}
              created_at={message.created_at}
              name={message.sender?.name}
            />
          ))
        ) : error ? (
          <p> Error while retrieving messages...</p>
        ) : (
          <p>Loading messages...</p>
        )}
      </div>
    </div>
  );
}
