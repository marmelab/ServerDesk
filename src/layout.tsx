import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AvatarDropdown } from './components/avatar-dropdown';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from './components/ui/navigation-menu';

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 h-14 flex items-center relative">
        <div className="flex-1 flex justify-start">
          <Link to="/">ServerDesk</Link>
        </div>
        <div className="flex-initial">
          <NavigationMenu>
            <NavigationMenuList>
              {user?.role == 'admin' && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/admin/companies">Companies</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/admin/agents">Agents</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/tickets">Tickets</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {user && (
          <div className="flex-1 flex justify-end items-center gap-4">
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
