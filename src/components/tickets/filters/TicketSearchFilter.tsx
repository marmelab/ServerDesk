import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Search } from 'lucide-react';

interface TicketSearchFilterProps {
  searchLabel: string;
  setSearchLabel: (value: string) => void;
  count: number;
}

export default function TicketSearchFilter({
  searchLabel,
  setSearchLabel,
  count,
}: TicketSearchFilterProps) {
  return (
    <InputGroup className="max-w-xs">
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
