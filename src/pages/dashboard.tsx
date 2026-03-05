import { supabase } from '@/lib/supabase';
import { AppUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

async function fetchAppUser(): Promise<AppUser> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('app_user')
    .select()
    .eq('id', user?.id)
    .single();

  if (error) throw error;
  return data;
}

export default function DashboardPage() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: ['app_user'],
    queryFn: fetchAppUser,
  });

  {
    isPending && <p className="text-muted-foreground">Loading...</p>;
  }
  {
    error && <p className="text-destructive">{error.message}</p>;
  }

  if (!user) {
    return <p>Error while fetching user.</p>;
  }

  return (
    <div>
      <h1>Dashboard of {user.role}</h1>
    </div>
  );
}
