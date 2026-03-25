import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { TicketPriority } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './../ui/button';
import { useAddTicket } from '@/hooks/useTickets';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  TextField,
  TextAreaField,
  PrioritySelectField,
  SubmitButton,
} from '@/components/FormInputs';

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    PrioritySelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export default function AddTicketDialog() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      subject: '',
      description: '',
      priority: 'medium' as TicketPriority,
    },
    onSubmit: async ({ value }) => {
      if (user && user.company_ids) {
        try {
          await addTicket({
            ...value,
            company_id: user.company_ids[0],
            customer_id: user.id,
          });
          form.reset();
          setIsOpen(false);
        } catch (error) {
          // Error is handled
          console.error(error);
        }
      }
    },
  });

  const { mutateAsync: addTicket } = useAddTicket();

  if (!user?.company_ids?.length) {
    console.error('User is not linked to any company.');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="group-hover:bg-primary group-hover:text-primary-foreground w-fit">
          <FilePlus className="ms-2 size-4" />
          Add Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Add a new ticket
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground pt-1">
            Fill the informations of the ticket.
          </DialogDescription>
          <div className="space-y-4">
            <form.AppField name="subject">
              {(field) => <field.TextField label="Subject" field={field} />}
            </form.AppField>
            <form.AppField name="description">
              {(field) => (
                <field.TextAreaField label="Description" field={field} />
              )}
            </form.AppField>
            <form.AppField name="priority">
              {(field) => (
                <field.PrioritySelectField label="Priority" field={field} />
              )}
            </form.AppField>
          </div>
          <DialogFooter className="sm:justify-start">
            <form.AppForm>
              <form.SubmitButton form={form}>Add Ticket</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
