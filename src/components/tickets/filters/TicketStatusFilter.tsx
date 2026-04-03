import { STATUS_MAP, TicketStatus } from '@/types';
import TicketSelectFilter from './TicketSelectFilter';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';

export default function TicketStatusFilter() {
  const { selectedStatus, setSelectedStatus } = useTicketsFiltersContext();
  return (
    <TicketSelectFilter<TicketStatus>
      label="Status"
      map={STATUS_MAP}
      selected={selectedStatus ?? ''}
      setSelected={setSelectedStatus}
    />
  );
}
