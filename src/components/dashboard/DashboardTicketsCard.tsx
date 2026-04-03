import { File } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { UseTicketFilters, useTickets } from '@/hooks/useTickets';
import { useMemo } from 'react';

interface DashboardTicketsCardProp {
  companiesId?: number[];
}

export default function DashboardTicketsCard({
  companiesId,
}: DashboardTicketsCardProp) {
  const filters = useMemo(
    (): UseTicketFilters => ({
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
