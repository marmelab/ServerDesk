import { Company } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import React from 'react';
import CompanySummary from './CompanySummary';
import { Accordion } from '../ui/accordion';
import { Placeholder } from '../Placeholder';

interface CompaniesViewProps {
  companies: Company[];
  isPlaceholderData: boolean;
  isAdmin: boolean;
  onAssign: (company: Company) => void;
  renderAddCompanyDialog: () => React.ReactNode;
}

export default function CompaniesView({
  companies,
  isPlaceholderData,
  isAdmin,
  onAssign,
  renderAddCompanyDialog,
}: CompaniesViewProps) {
  return (
    <div>
      <PageHeader
        title="Companies"
        description="View and manage all companies."
      >
        {renderAddCompanyDialog()}
      </PageHeader>
      <div className="rounded-md border bg-card">
        {isPlaceholderData && <Placeholder />}
        <Accordion
          type="single"
          collapsible
          className={
            isPlaceholderData
              ? 'opacity-50 transition-opacity'
              : 'transition-opacity'
          }
        >
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
    </div>
  );
}
