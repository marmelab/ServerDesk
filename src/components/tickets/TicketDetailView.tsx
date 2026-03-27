import { PRIORITY_MAP, STATUS_MAP, TicketWithDetails } from '@/types';
import {
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { TextAreaField, BaseSelectField } from '@/components/FormInputs';
import { FullUser } from '@/contexts/AuthContext';
import { Button } from '../ui/button';

interface TicketDetailsViewProps {
  ticket: TicketWithDetails | undefined;
  form: any;
  user: FullUser | null;
  isPending: boolean;
  error: any;
  children?: React.ReactNode;
}

export default function TicketDetailsView({
  ticket,
  form,
  user,
  isPending,
  error,
  children,
}: TicketDetailsViewProps) {
  if (isPending && !ticket) return <div className="p-10">Loading...</div>;
  if (error || !ticket)
    return <div className="p-10 text-red-500">Error loading ticket.</div>;
  if (!user) return null;

  const priorityInfo = PRIORITY_MAP[ticket.priority];
  const statusInfo = STATUS_MAP[ticket.status];

  return (
    <DrawerContent className="h-full fixed right-0 top-0 mt-0 rounded-l-xl border-l !w-[900px] !max-w-[90vw] outline-none">
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load ticket
          </h3>
        </div>
      )}
      {ticket && (
        <>
          <DrawerHeader className="border-b pb-4">
            <div className="flex flex-col gap-1 text-left">
              <div className="flex items-start justify-between gap-4">
                <DrawerTitle className="flex items-baseline gap-2 text-xl font-bold tracking-tight">
                  <span
                    className="text-tertiary font-mono text-sm font-normal"
                    role="article"
                  >
                    #{ticket.id}
                  </span>
                  {ticket.subject}
                </DrawerTitle>
                <DrawerDescription />
                <div className="flex gap-2 shrink-0 pt-1">
                  <Badge variant="secondary" className="whitespace-nowrap">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityInfo.color}`}
                    />
                    {priorityInfo.label}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="whitespace-nowrap"
                    data-testid="ticket-status"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${statusInfo.color}`}
                    />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold">{ticket.creator?.name}</span>
                <span>·</span>
                <span>{ticket.company?.name}</span>
              </div>
            </div>
          </DrawerHeader>
          {children}
          {user.role !== 'admin' && (
            <div className="p-4 border-t bg-background shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col"
              >
                {user.role === 'agent' && (
                  <div className="flex items-center gap-2">
                    <form.Field name="status">
                      {(field: any) => (
                        <BaseSelectField
                          label="Set status on reply:"
                          field={field}
                          options={STATUS_MAP}
                          placeholder={ticket.status}
                        />
                      )}
                    </form.Field>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <form.Field name="text">
                      {(field: any) => (
                        <TextAreaField label="Type a reply:" field={field} />
                      )}
                    </form.Field>
                  </div>
                  <div className="shrink-0">
                    <Button
                      type="submit"
                      disabled={form.state.isSubmitting}
                      className="rounded-full h-10 w-10 bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </DrawerContent>
  );
}
