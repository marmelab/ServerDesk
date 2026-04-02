import { File } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useTickets } from '@/hooks/useTickets';

interface DashboardTicketsCardProp {
  companiesId?: number[] | null;
}

export default function DashboardTicketsCard({
  companiesId,
}: DashboardTicketsCardProp) {
  const { count } = useTickets({
    companiesId: companiesId,
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
