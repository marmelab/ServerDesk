import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AvatarDropdown } from './components/avatar-dropdown';
import { HeadsetIcon } from 'lucide-react';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 h-14 flex items-center justify-between">
        <div className="flex">
          <HeadsetIcon className="mr-2" />
          <Link to="/">ServerDesk</Link>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <AvatarDropdown />
          </div>
        )}
      </header>
      <main className="flex-1 py-10">
        <Outlet />
      </main>
    </div>
  );
}
