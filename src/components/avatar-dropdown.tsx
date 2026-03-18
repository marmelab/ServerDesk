import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';

export function AvatarDropdown() {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer"
          aria-label="User menu"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-30 max-w-70 mx-8">
        <div className="flex flex-col space-y-1 p-2">
          <p
            className="text-sm font-medium leading-none truncate"
            title={user?.name}
          >
            {user?.name}
          </p>
          <p className="text-xs text-muted-foreground leading-none truncate pt-2">
            {user?.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onSelect={handleSignOut}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
