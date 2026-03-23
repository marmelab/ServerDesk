import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  function DashboardCard({ title, to }: { title: string; to: string }) {
    return (
      <Card className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            to={to}
            className={buttonVariants({
              variant: 'default',
              size: 'sm',
              className: 'w-full group',
            })}
          >
            View List
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    );
  }

  const Header = (
    <header className="flex w-full items-center justify-between mb-12">
      <div className="flex flex-col gap-1 text-left">
        <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          {user?.role === 'admin'
            ? 'Central administration hub for managing the platform.'
            : 'Quick access to your workspace and active tasks.'}
        </p>
      </div>
    </header>
  );

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
        {Header}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {user?.role == 'admin' && (
            <>
              {DashboardCard({ title: 'Companies', to: '/admin/companies' })}

              {DashboardCard({ title: 'Agents', to: '/admin/agents' })}
            </>
          )}
          {DashboardCard({ title: 'Tickets', to: '/tickets' })}
        </div>
      </div>
    </div>
  );
}
