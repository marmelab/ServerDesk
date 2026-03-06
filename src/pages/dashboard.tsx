import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard of {user?.role}</h1>

      {user?.role == 'admin' && (
        <Link
          to="/admin/companies"
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          Companies List
        </Link>
      )}
    </div>
  );
}
