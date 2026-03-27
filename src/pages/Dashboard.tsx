import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';
import { DashboardCard } from '@/components/DashboardCard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Dashboard"
          description={
            user?.role === 'admin'
              ? 'Central administration hub for managing the platform.'
              : 'Quick access to your workspace and active tasks.'
          }
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {user?.role === 'admin' && (
            <>
              <DashboardCard title="Companies" to="/admin/companies" />
              <DashboardCard title="Agents" to="/admin/agents" />
            </>
          )}
          <DashboardCard title="Tickets" to="/tickets" />
        </div>
      </div>
    </div>
  );
}
