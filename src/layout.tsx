import { Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-lg">ServerDesk</span>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
