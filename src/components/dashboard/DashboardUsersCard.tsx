import { User } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { useUsers } from '@/hooks/useUsers';

export default function DashboardUsersCard() {
  const { count } = useUsers();

  return (
    <DashboardCard
      title="Users"
      label="Users"
      to="/admin/agents"
      icon={<User />}
      count={count}
    />
  );
}
