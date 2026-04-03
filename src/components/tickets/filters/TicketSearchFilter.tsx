import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';
import { Search } from 'lucide-react';

interface TicketSearchFilterProps {
  count: number;
}

export default function TicketSearchFilter({ count }: TicketSearchFilterProps) {
  const { searchLabel, setSearchLabel } = useTicketsFiltersContext();
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput
        placeholder="Search by subject or description"
        value={searchLabel}
        onChange={(e) => setSearchLabel(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon className="text-tertiary" align="inline-end">
        {count} results
      </InputGroupAddon>
    </InputGroup>
  );
}
