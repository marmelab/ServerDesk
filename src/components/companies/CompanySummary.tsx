import { Company } from '@/types';
import { Button } from '../ui/button';
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Send } from 'lucide-react';
import CompanyContacts from './CompanyContacts';
import { useState } from 'react';

interface CompanySummaryProps {
  company: Company;
  onAssign: (company: Company) => void;
  isAdmin: boolean;
}

export default function CompanySummary({
  company,
  onAssign,
  isAdmin,
}: CompanySummaryProps) {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  return (
    <AccordionItem
      key={company.id}
      value={company.name}
      className="border-b px-4 last:border-b-0"
    >
      <div className="flex w-full items-center justify-between">
        <AccordionTrigger
          onClick={() => setHasBeenOpened(true)}
          className="flex-1 font-semibold py-4"
        >
          <span className="font-medium">{company.name}</span>
        </AccordionTrigger>

        {isAdmin && (
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onAssign(company);
            }}
            title="Invite Manager"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
      {hasBeenOpened && <CompanyContacts companyId={company.id} />}
    </AccordionItem>
  );
}
