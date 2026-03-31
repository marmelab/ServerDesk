import { Building2 } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useCompanies } from '@/hooks/useCompanies';

interface DashboardCompanyCardProps {
  initialCount?: number | null;
}

export default function DashboardCompanyCard({
  initialCount,
}: DashboardCompanyCardProps) {
  const { count } = useCompanies();
  const finalCount = initialCount ?? count ?? 0;
  return (
    <DashboardCard
      title="Companies"
      label="Companies"
      icon={<Building2 />}
      count={finalCount}
    />
  );
}
