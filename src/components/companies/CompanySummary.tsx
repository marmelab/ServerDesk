import { Company, CompanyWithTickets, STATUS_MAP } from '@/types';
import { Button } from '../ui/button';
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Send } from 'lucide-react';
import CompanyContacts from './CompanyContacts';
import { useMemo, useState } from 'react';
import { Badge } from '../ui/badge';

interface CompanySummaryProps {
  company: CompanyWithTickets;
  onAssign: (company: Company) => void;
  isAdmin: boolean;
}

export default function CompanySummary({
  company,
  onAssign,
  isAdmin,
}: CompanySummaryProps) {
  const StatusNumber = useMemo(() => {
    return company.tickets.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [company.tickets]);

  const [opened, setOpened] = useState(false);

  return (
    <AccordionItem
      key={company.id}
      value={company.name}
      className="border-b px-4 last:border-b-0"
    >
      <div className="flex w-full items-center justify-between">
        <AccordionTrigger
          onClick={() => setOpened(true)}
          className="flex flex-1 py-4 font-semibold hover:no-underline"
        >
          <span className="shrink-0">{company.name}</span>
          <div className="ml-auto mr-4 flex items-end gap-1.5">
            {Object.values(STATUS_MAP).map((status) => {
              const count = StatusNumber[status.value];
              if (!count) return null;
              return (
                <div key={status.value} className="flex justify-end gap-2">
                  <Badge variant="secondary" className="whitespace-nowrap">
                    <span className={`h-2 w-2 rounded-full ${status.color}`} />
                    <span>{status.label}</span>
                    <span className="text-xs opacity-50">-</span>
                    <span className="min-w-[1ch] text-center">{count}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        </AccordionTrigger>

        {isAdmin && (
          <Button
            size="sm"
            variant="secondary"
            className="ml-2 h-8 p-0 hover:bg-primary border hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onAssign(company);
            }}
            title="Invite Manager"
          >
            <Send className="h-4 w-4" />
            Assign
          </Button>
        )}
      </div>
      {opened && <CompanyContacts companyId={company.id} />}
    </AccordionItem>
  );
}
