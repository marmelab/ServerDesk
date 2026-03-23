import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '@/services/companies';
import AddCompanyDialog from '@/components/AddCompanyDialog';
import CompanyCard from '@/components/CompanyCard';

export default function CompaniesPage() {
  const {
    data: companies = [],
    isPending,
    error: queryError,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  const Header = (
    <header className="flex w-full items-center justify-between mb-12">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Companies
        </h2>
        <p className="text-muted-foreground">Manage and add companies.</p>
      </div>
      <AddCompanyDialog />
    </header>
  );

  if (isPending)
    return <p className="text-muted-foreground p-10">Loading...</p>;

  return (
    <div className="container mx-auto py-10">
      {!isPending && !queryError && (
        <div className="mx-auto max-w-7xl">
          {Header}
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
