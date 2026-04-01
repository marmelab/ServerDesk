import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PAGE_SIZE } from '@/services/Tickets';
import AddTicketDialog from '@/components/tickets/AddTicketDialog';
import { PageHeader } from '@/components/PageHeader';
import TicketSummary from '@/components/tickets/TicketSummary';
import { TicketWithDetails } from '@/types';
import { Drawer } from '@/components/ui/drawer';
import TicketDetails from '../components/tickets/TicketDetail';
import { useTickets } from '@/hooks/useTickets';
import { PageHelper } from '@/components/PageHelper';

export default function TicketsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithDetails | null>(null);

  const { tickets, totalCount, isPending, isPlaceholderData, error, refetch } =
    useTickets({ page });
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load tickets
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Tickets"
            description="View and manage all tickets."
          >
            {user?.role === 'customer_manager' && <AddTicketDialog />}
          </PageHeader>
          <div className="rounded-md border bg-card">
            {isPlaceholderData && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
                  Updating...
                </span>
              </div>
            )}
            <Table
              className={
                isPlaceholderData
                  ? 'opacity-50 transition-opacity'
                  : 'transition-opacity'
              }
            >
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Subject</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  {(user?.role === 'admin' || user?.role === 'agent') && (
                    <TableHead>Company</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TicketSummary
                    key={ticket.id}
                    ticket={ticket}
                    onSelect={setSelectedTicket}
                  />
                ))}
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No tickets found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Drawer
              open={!!selectedTicket}
              onOpenChange={(open) => !open && setSelectedTicket(null)}
              direction="right"
            >
              {selectedTicket && <TicketDetails ticket={selectedTicket} />}
            </Drawer>
          </div>
          <PageHelper
            totalPages={totalPages}
            totalCount={totalCount}
            currentCount={tickets.length}
            page={page}
            isPlaceholderData={isPlaceholderData}
            pageSize={PAGE_SIZE}
            setPage={setPage}
            label="tickets"
          />
        </div>
      )}
    </div>
  );
}
