import { Company } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import CcompanySummary from './CompanySummary';

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
        {isPlaceholderData && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
              Updating...
            </span>
          </div>
        )}
        <Table
          className={
            isPlaceholderData
              ? 'opacity-50 transition-opacity'
              : 'transition-opacity'
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <CcompanySummary
                key={company.id}
                company={company}
                isAdmin={isAdmin}
                onAssign={onAssign}
              />
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-lg font-medium text-tertiary">
                      No companies found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
