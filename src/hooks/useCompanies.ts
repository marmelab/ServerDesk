import { fetchCompanies } from '@/services/Companies';
import { useQuery } from '@tanstack/react-query';

interface UseCompaniesProps {
  isEnabled?: boolean;
  onlyCount?: boolean;
  page?: number;
}

export function useCompanies({
  isEnabled = true,
  onlyCount = false,
  page,
}: UseCompaniesProps = {}) {
  const query = useQuery({
    queryKey: ['companies', page, { onlyCount }],
    queryFn: () => fetchCompanies(page, onlyCount),
    enabled: isEnabled,
    placeholderData: (previousData) => previousData,
  });

  return {
    companies: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count ?? 0,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
