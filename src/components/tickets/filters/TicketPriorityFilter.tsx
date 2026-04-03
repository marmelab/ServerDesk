import { PRIORITY_MAP, TicketPriority } from '@/types';
import TicketSelectFilter from './TicketSelectFilter';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';

export default function TicketPriorityFilter() {
  const { selectedPriority, setSelectedPriority } = useTicketsFiltersContext();
  return (
    <TicketSelectFilter<TicketPriority>
      label="Priority"
      map={PRIORITY_MAP}
      selected={selectedPriority ?? ''}
      setSelected={setSelectedPriority}
    />
  );
}
