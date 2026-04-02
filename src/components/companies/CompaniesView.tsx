import { Company } from '@/types';
import CompanySummary from './CompanySummary';
import { Accordion } from '../ui/accordion';

interface CompaniesViewProps {
  companies: Company[];
  isPlaceholderData: boolean;
  isAdmin: boolean;
  onAssign: (company: Company) => void;
}

export default function CompaniesView({
  companies,
  isAdmin,
  onAssign,
}: CompaniesViewProps) {
  return (
    <div className="rounded-md border bg-card">
      <Accordion type="single" collapsible className={'transition-opacity'}>
        {companies.map((company) => (
          <CompanySummary
            key={company.id}
            company={company}
            isAdmin={isAdmin}
            onAssign={onAssign}
          />
        ))}
        {companies.length === 0 && (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-lg font-medium text-tertiary">
              No companies found
            </p>
          </div>
        )}
      </Accordion>
    </div>
  );
}
