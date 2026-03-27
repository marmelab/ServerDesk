import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '@/services/Companies';
import AddCompanyDialog from '@/components/companies/AddCompanyDialog';
import CompanyCard from '@/components/companies/CompanyCard';
import { PageHeader } from '@/components/PageHeader';

export default function CompaniesPage() {
  const {
    data: companies = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          <PageHeader title="Companies" description="Manage and add companies.">
            <AddCompanyDialog />
          </PageHeader>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
            {companies.length === 0 && <h2>No companies found.</h2>}
          </div>
        </div>
      )}
    </div>
  );
}
