import { File } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { TicketFilters, useTickets } from '@/hooks/useTickets';
import { useMemo } from 'react';

interface DashboardTicketsCardProp {
  companiesId?: number[];
}

export default function DashboardTicketsCard({
  companiesId,
}: DashboardTicketsCardProp) {
  const filters = useMemo(
    (): TicketFilters => ({
      companies: companiesId,
    }),
    [companiesId],
  );

  const { count } = useTickets({
    filters: filters,
    page: null,
    onlyCount: true,
  });

  return (
    <DashboardCard
      singularLabel="Ticket"
      label="Tickets"
      icon={<File />}
      count={count}
    />
  );
}
