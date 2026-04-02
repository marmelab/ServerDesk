import { UseResourceData } from '@/lib/utils';
import { fetchUsers } from '@/services/Users';
import { AppUser } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseUsersProps {
  onlyCount: boolean;
}

export type FetchUsersResponse = { data: AppUser[]; count: number };

export function useUsers({
  onlyCount = false,
}: UseUsersProps): UseResourceData<AppUser[], FetchUsersResponse> {
  const query = useQuery({
    queryKey: ['users', { onlyCount }],
    queryFn: () => fetchUsers(onlyCount),
  });

  return {
    data: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    count: query.data?.count,
    refetch: query.refetch,
  };
}
