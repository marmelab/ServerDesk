import { TicketWithDetails } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateMessageAndStatus } from '@/hooks/useCreateMessageAndStatus';
import { useMessageForm } from '@/hooks/useMessageForm';
import { useTicket } from '@/hooks/useTicket';
import TicketDetailsView from './TicketDetailView';
import MessageThread from './MessageThread';

interface TicketDetailsProps {
  ticket: TicketWithDetails;
}

export default function TicketDetails({
  ticket: initialTicket,
}: TicketDetailsProps) {
  const { ticket, isPending, error } = useTicket(initialTicket.id);

  const { user } = useAuth();
  const { mutateAsync: addMessage } = useCreateMessageAndStatus();

  const form = useMessageForm({
    ticket: ticket || initialTicket,
    user,
    addMessage,
  });

  return (
    <TicketDetailsView
      ticket={ticket}
      form={form}
      user={user}
      isPending={isPending}
      error={error}
    >
      <MessageThread ticket={ticket!} />
    </TicketDetailsView>
  );
}
