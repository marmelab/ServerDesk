import TicketCompaniesFilter from './TicketCompaniesFilter';
import TicketPriorityFilter from './TicketPriorityFilter';
import TicketSearchFilter from './TicketSearchFilter';
import TicketStatusFilter from './TicketStatusFilter';
import { CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';

interface TicketFiltersProps {
  count: number;
}

export default function TicketFilters({ count }: TicketFiltersProps) {
  const { user } = useAuth();
  const { clearFilters } = useTicketsFiltersContext();
  const showCompanies = user
    ? user.role
      ? ['admin', 'agent'].includes(user.role)
      : false
    : false;

  return (
    <div className="flex gap-2 py-2">
      <TicketSearchFilter count={count} />
      {showCompanies && <TicketCompaniesFilter />}
      <TicketStatusFilter />
      <TicketPriorityFilter />
      <Button variant="ghost" onClick={clearFilters} title="Clear filters">
        <CircleX />
      </Button>
    </div>
  );
}
