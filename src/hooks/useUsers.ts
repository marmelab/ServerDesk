import { fetchUsers } from '@/services/Users';
import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return {
    users: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count,
  };
}
