import { User } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useCustomers } from '@/hooks/useCustomers';

interface DashboardCustomersCardProp {
  companiesId?: number[];
}

export default function DashboardCustomersCard({
  companiesId,
}: DashboardCustomersCardProp) {
  const { count } = useCustomers({ companiesId, onlyCount: true });

  return (
    <DashboardCard
      singularLabel="User"
      label="Users"
      icon={<User />}
      count={count}
    />
  );
}
