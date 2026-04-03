import { CompanyMultiSelect } from '@/components/companies/CompanyMultiSelect';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTicketsFiltersContext } from '@/contexts/TicketsFiltersContext';

export default function TicketCompaniesFilter() {
  const { selectedCompanies, setSelectedCompanies } =
    useTicketsFiltersContext();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-primary">
          Companies
        </Button>
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
