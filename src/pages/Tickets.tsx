import { useState } from 'react';
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
import { Pagination } from '@/components/Pagination';
import { Placeholder } from '@/components/Placeholder';
import ErrorView from '@/components/ErrorView';
import PendingView from '@/components/PendingView';
import TicketFilters from '@/components/tickets/filters/TicketFilters';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';

export default function TicketsPage() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithDetails | null>(null);

  const { filters, page, setPage } = useTicketsFiltersContext();

  const {
    data: tickets,
    count,
    isPending,
    isPlaceholderData,
    error,
    refetch,
  } = useTickets({ filters, page });
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="container mx-auto py-10">
      {error && <ErrorView label="Failed to load tickets" refetch={refetch} />}
      {isPending && <PendingView label="Loading tickets" />}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Tickets"
            description="View and manage all tickets."
          >
            {user?.role === 'customer_manager' && <AddTicketDialog />}
          </PageHeader>

          <TicketFilters count={count ?? 0} />

          <div className="rounded-md border bg-card">
            {isPlaceholderData && <Placeholder />}

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
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-tertiary">
                        <p className="text-sm font-medium">No tickets found</p>
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
          <Pagination
            totalPages={totalPages}
            totalCount={count ?? 0}
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
