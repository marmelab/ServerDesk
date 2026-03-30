import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AvatarDropdown } from './components/AvatarDropdown';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './components/ui/navigation-menu';
import { HeadsetIcon } from 'lucide-react';
import { AppNavLink } from './components/AppNavLink';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="border-b px-6 h-14 flex items-center shrink-0">
        <Link
          to="/"
          className="flex-1 flex justify-start items-center hover:opacity-80 transition-opacity"
          aria-label="ServerDesk Home"
        >
          <HeadsetIcon className="mr-2" />
          <span className="font-semibold">ServerDesk</span>
        </Link>
        {user && (
          <>
            <div className="flex-initial">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <AppNavLink to="/" end>
                      Home
                    </AppNavLink>
                  </NavigationMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <NavigationMenuItem>
                        <AppNavLink to="/admin/companies">Companies</AppNavLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <AppNavLink to="/admin/agents">Agents</AppNavLink>
                      </NavigationMenuItem>
                    </>
                  )}
                  {user?.role === 'customer_manager' && (
                    <NavigationMenuItem>
                      <AppNavLink to="/customers">Customers</AppNavLink>
                    </NavigationMenuItem>
                  )}
                  <NavigationMenuItem>
                    <AppNavLink to="/tickets">Tickets</AppNavLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex-1 flex justify-end items-center gap-4">
              <AvatarDropdown />
            </div>
          </>
        )}
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="container mx-auto py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
