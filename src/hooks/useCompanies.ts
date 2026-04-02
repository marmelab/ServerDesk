import { UseResourceData } from '@/lib/utils';
import { fetchCompanies } from '@/services/Companies';
import { Company } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface UseCompaniesProps {
  isEnabled?: boolean;
  onlyCount?: boolean;
  page?: number;
}
export type FetchCompaniesResponse = { data: Company[]; count: number };

export function useCompanies({
  isEnabled = true,
  onlyCount = false,
  page,
}: UseCompaniesProps = {}): UseResourceData<Company[], FetchCompaniesResponse> {
  const query = useQuery({
    queryKey: ['companies', page, { onlyCount }],
    queryFn: () => fetchCompanies(page, onlyCount),
    enabled: isEnabled,
    placeholderData: (previousData) => previousData,
  });

  return {
    data: query.data?.data ?? [],
    isPending: query.isPending,
    error: query.error,
    count: query.data?.count ?? 0,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
