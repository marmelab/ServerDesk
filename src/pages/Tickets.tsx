import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchTickets, PAGE_SIZE } from '@/services/Tickets';
import AddTicketDialog from '@/components/AddTicketDialog';
import { PageHeader } from '@/components/PageHeader';
import TicketSummary from '@/components/TicketSummary';
import { TicketWithDetails } from '@/types';
import { Drawer } from '@/components/ui/drawer';
import TicketDetails from '../components/TicketDetail';

export default function TicketsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithDetails | null>(null);

  const {
    data,
    isPending,
    isPlaceholderData,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['tickets', page],
    queryFn: () => fetchTickets(page),
    placeholderData: (previousData) => previousData,
  });

  const tickets = data?.data ?? [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {queryError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load tickets
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isPending && !queryError && (
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page{' '}
                <span className="font-bold text-foreground">{page + 1}</span> on{' '}
                <span className="font-bold text-foreground">
                  {totalPages || 1}
                </span>
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                ({totalCount} tickets)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0 || isPlaceholderData}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (tickets.length === PAGE_SIZE) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={tickets.length < PAGE_SIZE || isPlaceholderData}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
