import { TicketWithDetails, PRIORITY_MAP, STATUS_MAP } from '@/types';
import { TableRow, TableCell } from '../ui/table';
import { useAuth } from '@/contexts/AuthContext';

interface TicketSummaryProps {
  ticket: TicketWithDetails;
  onSelect: (ticket: TicketWithDetails) => void;
}

export default function TicketSummary({
  ticket,
  onSelect,
}: TicketSummaryProps) {
  const { user } = useAuth();

  const priorityInfo = PRIORITY_MAP[ticket.priority];
  const statusInfo = STATUS_MAP[ticket.status];

  return (
    <TableRow
      key={ticket.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onSelect(ticket)}
    >
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{ticket.subject}</span>
        </div>
      </TableCell>
      <TableCell className="text-foreground">
        {new Date(ticket.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${priorityInfo?.color}`} />
          <span className="capitalize text-sm">{priorityInfo.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusInfo?.color}`} />
          <span className="capitalize text-sm">{statusInfo.label}</span>
        </div>
      </TableCell>
      {(user?.role === 'admin' || user?.role === 'agent') && (
        <TableCell>{ticket.company?.name}</TableCell>
      )}
    </TableRow>
  );
}
