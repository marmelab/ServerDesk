import { TicketPriority, TicketStatus } from '@/types';
import TicketCompaniesFilter from './TicketCompaniesFilter';
import TicketPriorityFilter from './TicketPriorityFilter';
import TicketSearchFilter from './TicketSearchFilter';
import TicketStatusFilter from './TicketStatusFilter';
import { CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketFiltersProps {
  selectedStatus?: TicketStatus;
  setSelectedStatus: (value: TicketStatus) => void;
  selectedPriority?: TicketPriority;
  setSelectedPriority: (value: TicketPriority) => void;
  searchLabel: string;
  setSearchLabel: (value: string) => void;
  count: number;
  selectedCompanies: number[];
  setSelectedCompanies: (value: number[]) => void;
  clearFilters: () => void;
}

export default function TicketFilters({
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  searchLabel,
  setSearchLabel,
  count,
  selectedCompanies,
  setSelectedCompanies,
  clearFilters,
}: TicketFiltersProps) {
  return (
    <div className="flex gap-2 py-2">
      <TicketSearchFilter
        searchLabel={searchLabel}
        setSearchLabel={setSearchLabel}
        count={count}
      />
      <TicketCompaniesFilter
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
      />
      <TicketStatusFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <TicketPriorityFilter
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
      />
      <Button variant="ghost" onClick={clearFilters} title="Clear filters">
        <CircleX />
      </Button>
    </div>
  );
}
