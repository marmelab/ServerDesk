import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/Messages';
import { TicketWithDetails } from '@/types';
import TicketMessage from './TicketMessage';

export default function MessageThread({
  ticket,
}: {
  ticket: TicketWithDetails;
}) {
  const {
    data,
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['messages', ticket.id],
    queryFn: () => fetchMessages(ticket.id),
    placeholderData: (previousData) => previousData,
  });

  const messages = data?.data ?? [];

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
