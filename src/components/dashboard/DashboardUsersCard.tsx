import { User } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useUsers } from '@/hooks/useUsers';
import { useCustomers } from '@/hooks/useCustomers';

export default function DashboardUsersCard() {
  const { count: userCount } = useUsers({ onlyCount: true });
  const { totalCount: customerCount } = useCustomers({ onlyCount: true });

  const totalCount = (userCount ?? 0) + (customerCount ?? 0);
  return (
    <DashboardCard
      title="Users"
      label="Users"
      icon={<User />}
      count={totalCount}
    />
  );
}
