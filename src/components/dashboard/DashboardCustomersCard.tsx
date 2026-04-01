import { User } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useCustomers } from '@/hooks/useCustomers';

interface DashboardCustomersCardProp {
  companiesId?: number[];
}

export default function DashboardCustomersCard({
  companiesId,
}: DashboardCustomersCardProp) {
  const { totalCount } = useCustomers({ companiesId, onlyCount: true });

  return (
    <DashboardCard
      title="Users"
      label="Users"
      icon={<User />}
      count={totalCount}
    />
  );
}
