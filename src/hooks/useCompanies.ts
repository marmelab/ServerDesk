import { fetchCompanies } from '@/services/Companies';
import { useQuery } from '@tanstack/react-query';

export function useCompanies(
  isEnabled: boolean = true,
  onlyCount: boolean = false,
) {
  const query = useQuery({
    queryKey: ['companies', { onlyCount }],
    queryFn: () => fetchCompanies(onlyCount),
    enabled: isEnabled,
  });

  return {
    companies: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count,
  };
}
