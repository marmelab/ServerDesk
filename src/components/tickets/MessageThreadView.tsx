import { isInternalRole, MessageWithDetails, TicketWithDetails } from '@/types';
import TicketMessage from './TicketMessage';
import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { user } = useAuth();
  const userRole = user?.role;
  const isViewerInternal = useMemo(() => isInternalRole(userRole), [userRole]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        <TicketMessage
          message={ticket.description}
          isSentByMeOrPeer={!isViewerInternal}
          id={ticket.id}
          created_at={ticket.created_at}
          name={ticket.creator?.name}
        />
        {!isPending && !error ? (
          messages.map((message) => (
            <TicketMessage
              message={message.text}
              isSentByMeOrPeer={
                isViewerInternal === isInternalRole(message.sender?.role)
              }
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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
