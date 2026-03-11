import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Dashboard of{' '}
            <span className="font-medium text-foreground">{user?.email}</span>
            with role{' '}
            <span className="font-medium text-foreground">{user?.role}</span>
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role == 'admin' && (
          <Card className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/admin/companies"
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
        )}
        <Card className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              to="/tickets/"
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
      </div>
    </div>
  );
}
