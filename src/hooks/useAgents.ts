import { fetchAgents } from '@/services/Agents';
import { useQuery } from '@tanstack/react-query';

export function useAgents() {
  const query = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  return {
    agents: query.data ?? [],
    isPending: query.isPending,
    error: query.error,
  };
}
