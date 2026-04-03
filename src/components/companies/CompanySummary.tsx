import { Company, CompanyWithTickets, STATUS_MAP } from '@/types';
import { Button } from '../ui/button';
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Send } from 'lucide-react';
import CompanyContacts from './CompanyContacts';
import { useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

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
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 w-full overflow-hidden">
        <AccordionTrigger
          onClick={() => setOpened(true)}
          className="py-4 font-semibold hover:no-underline min-w-0 flex-1"
        >
          <span className="truncate text-left block w-full pr-4">
            {company.name}
          </span>
        </AccordionTrigger>

        <div className="hidden md:flex items-center justify-end gap-4 ml-auto">
          {Object.values(STATUS_MAP).map((status) => {
            const count = StatusNumber[status.value] || 0;

            return (
              <div
                key={status.value}
                className={cn(
                  'flex items-center transition-opacity',
                  count === 0 ? 'invisible' : 'visible',
                )}
              >
                <Badge
                  variant="ghost"
                  className="whitespace-nowrap px-0 flex items-center gap-2"
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      status.color,
                    )}
                  />
                  <span className="hidden xl:inline text-muted-foreground font-normal text-[11px]">
                    {status.label}
                  </span>
                  <span className="font-bold text-xs min-w-[1.5ch] text-right">
                    {count}
                  </span>
                </Badge>
              </div>
            );
          })}
        </div>
        {isAdmin && (
          <div className="flex shrink-0">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-3 gap-2 hover:bg-primary border hover:text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onAssign(company);
              }}
              title="Invite Manager"
            >
              <Send className="h-4 w-4" />
              Assign
            </Button>
          </div>
        )}
      </div>
      {opened && <CompanyContacts companyId={company.id} />}
    </AccordionItem>
  );
}
