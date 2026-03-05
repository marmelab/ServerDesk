import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, appUser } = useAuth();

  if (!user) {
    return <p>Error while fetching user.</p>;
  }

  return (
    <div>
      <h1>Dashboard of {appUser?.role}</h1>
    </div>
  );
}
