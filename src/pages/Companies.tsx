import AddCompanyDialog from '@/components/companies/AddCompanyDialog';
import { Pagination } from '@/components/Pagination';
import { useState } from 'react';
import { PAGE_SIZE } from '@/services/Companies';
import CompaniesView from '@/components/companies/CompaniesView';
import { InviteDialog } from '@/components/InviteDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import ErrorView from '@/components/ErrorView';
import PendingView from '@/components/PendingView';
import { Placeholder } from '@/components/Placeholder';
import { useCompaniesWithTickets } from '@/hooks/useCompaniesWithTickets';

export default function CompaniesPage() {
  const [page, setPage] = useState<number>(0);
  const [inviteCompany, setInviteCompany] = useState<Company | null>(null);
  const {
    data: companies,
    count,
    isPlaceholderData,
    isPending,
    error,
    refetch,
  } = useCompaniesWithTickets({ page });
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const { user } = useAuth();
  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Companies"
        description="View and manage all companies."
      >
        <AddCompanyDialog />
      </PageHeader>
      {error && (
        <ErrorView label="Failed to load companies" refetch={refetch} />
      )}
      {isPending && <PendingView label="Loading companies" />}
      {isPlaceholderData && <Placeholder />}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <CompaniesView
            companies={companies}
            isPlaceholderData={isPlaceholderData}
            isAdmin={user?.role === 'admin'}
            onAssign={setInviteCompany}
          />
          <Pagination
            totalPages={totalPages}
            totalCount={count ?? 0}
            currentCount={companies.length}
            page={page}
            isPlaceholderData={isPlaceholderData}
            pageSize={PAGE_SIZE}
            setPage={setPage}
            label="companies"
          />
          <InviteDialog
            key={inviteCompany?.id ?? 'new'}
            open={inviteCompany != null}
            onOpenChange={(open) => {
              if (!open) setInviteCompany(null);
            }}
            initialCompanyId={inviteCompany?.id ?? null}
            appRole={'customer_manager'}
          />
        </div>
      )}
    </div>
  );
}
