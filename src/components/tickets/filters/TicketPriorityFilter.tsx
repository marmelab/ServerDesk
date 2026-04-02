import { PRIORITY_MAP, TicketPriority } from '@/types';
import TicketSelectFilter from './TicketSelectFilter';

interface TicketPriorityFilterProps {
  selectedPriority?: TicketPriority;
  setSelectedPriority: (value: TicketPriority) => void;
}

export default function TicketPriorityFilter({
  selectedPriority,
  setSelectedPriority,
}: TicketPriorityFilterProps) {
  return (
    <TicketSelectFilter<TicketPriority>
      label="Priority"
      map={PRIORITY_MAP}
      selected={selectedPriority ?? ''}
      setSelected={setSelectedPriority}
    />
  );
}
