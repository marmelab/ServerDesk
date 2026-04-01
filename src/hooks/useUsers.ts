import { fetchUsers } from '@/services/Users';
import { useQuery } from '@tanstack/react-query';

interface UseUsersProps {
  onlyCount: boolean;
}

export function useUsers({ onlyCount = false }: UseUsersProps) {
  const query = useQuery({
    queryKey: ['users', { onlyCount }],
    queryFn: () => fetchUsers(onlyCount),
  });

  return {
    users: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count,
  };
}
