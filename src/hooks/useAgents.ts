import { UseResourceData } from '@/lib/utils';
import { fetchAgents } from '@/services/Agents';
import { AgentDetails } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useAgents(): UseResourceData<AgentDetails[]> {
  const query = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  return {
    data: query.data ?? [],
    isPending: query.isPending,
    error: query.error,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  };
}
