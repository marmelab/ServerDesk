import { FullUser } from '@/contexts/AuthContext';
import { TicketWithDetails } from '@/types';
import { useForm } from '@tanstack/react-form';

interface UseMessageFormProps {
  ticket: TicketWithDetails;
  user: FullUser | null;
  addMessage: (vars: any) => Promise<void>;
}

export const useMessageForm = ({
  ticket,
  user,
  addMessage,
}: UseMessageFormProps) => {
  return useForm({
    defaultValues: {
      text: '',
      status: ticket.status,
    },
    onSubmit: async ({ value, formApi }) => {
      if (user) {
        try {
          await addMessage({
            ...value,
            contact_id: null,
            sender_id: user.id,
            ticket_id: ticket.id,
          });
          formApi.reset();
        } catch (error) {
          // Error is handled
          console.error(error);
        }
      }
    },
  });
};
