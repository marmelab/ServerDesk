import { Priorities, Statuses, TicketWithDetails } from '@/types';
import {
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import MessageThread from './MessageThread';

export default function TicketDetails({
  ticket,
}: {
  ticket: TicketWithDetails;
}) {
  if (!ticket) return null;

  const priorityInfo = Priorities.find((p) => p.value === ticket.priority);
  const statusInfo = Statuses.find((p) => p.value === ticket.status);

  return (
    <DrawerContent className="h-full fixed right-0 top-0 mt-0 rounded-l-xl border-l !w-[900px] !max-w-[90vw] outline-none">
      <DrawerHeader className="border-b pb-4">
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-start justify-between gap-4">
            <DrawerTitle className="flex items-baseline gap-2 text-xl font-bold tracking-tight">
              <span className="text-muted-foreground font-mono text-sm font-normal">
                #{ticket.id}
              </span>
              {ticket.subject}
            </DrawerTitle>
            <DrawerDescription />
            <div className="flex gap-2 shrink-0 pt-1">
              <Badge variant="secondary" className="whitespace-nowrap">
                <span
                  className={`h-2 w-2 rounded-full ${priorityInfo?.color}`}
                />
                {priorityInfo?.label}
              </Badge>
              <Badge variant="secondary" className="whitespace-nowrap">
                <span className={`h-2 w-2 rounded-full ${statusInfo?.color}`} />
                {statusInfo?.label}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="underline underline-offset-4">
              {ticket.creator?.name}
            </span>
            <span>·</span>
            <span>{ticket.company?.name}</span>
          </div>
        </div>
      </DrawerHeader>
      <MessageThread ticket={ticket} />

      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 ring-primary"
            placeholder="Type a reply..."
          />
          <button className="bg-primary text-white p-2 rounded-full w-9 h-9 flex items-center justify-center">
            ↑
          </button>
        </div>
      </div>
    </DrawerContent>
  );
}
