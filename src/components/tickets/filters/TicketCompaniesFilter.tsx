import { CompanyMultiSelect } from '@/components/companies/CompanyMultiSelect';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TicketCompaniesFilterProps {
  selectedCompanies: number[];
  setSelectedCompanies: (value: number[]) => void;
}

export default function TicketCompaniesFilter({
  selectedCompanies,
  setSelectedCompanies,
}: TicketCompaniesFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Companies</Button>
      </PopoverTrigger>
      <PopoverContent>
        <CompanyMultiSelect
          selectedIds={selectedCompanies}
          onChange={setSelectedCompanies}
        />
      </PopoverContent>
    </Popover>
  );
}
