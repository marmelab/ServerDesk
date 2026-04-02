import AddCompanyDialog from '@/components/companies/AddCompanyDialog';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { PAGE_SIZE } from '@/services/Companies';
import CompaniesView from '@/components/companies/CompaniesView';
import { InviteDialog } from '@/components/InviteDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/types';

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
  } = useCompanies({ page });
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const { user } = useAuth();
  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold italic">
            Failed to load companies
          </h3>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}
      {!isPending && !error && (
        <div className="mx-auto max-w-7xl">
          <CompaniesView
            companies={companies}
            isPlaceholderData={isPlaceholderData}
            isAdmin={user?.role === 'admin'}
            onAssign={setInviteCompany}
            renderAddCompanyDialog={() => <AddCompanyDialog />}
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
