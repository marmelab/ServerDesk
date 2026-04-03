import { STATUS_MAP, TicketStatus } from '@/types';
import TicketSelectFilter from './TicketSelectFilter';

interface TicketStatusFilterProps {
  selectedStatus?: TicketStatus;
  setSelectedStatus: (value: TicketStatus) => void;
}

export default function TicketStatusFilter({
  selectedStatus,
  setSelectedStatus,
}: TicketStatusFilterProps) {
  return (
    <TicketSelectFilter<TicketStatus>
      label="Status"
      map={STATUS_MAP}
      selected={selectedStatus ?? ''}
      setSelected={setSelectedStatus}
    />
  );
}
