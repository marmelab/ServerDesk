import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateAgentCompanies } from '@/services/Agents';

interface UseUpdateAgentCompaniesOptions {
  onSuccess?: () => void;
}

interface UpdateAgentCompaniesProps {
  agentId: string;
  companyIds: number[];
}

export function useUpdateAgentCompanies(
  options?: UseUpdateAgentCompaniesOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, companyIds }: UpdateAgentCompaniesProps) => {
      return updateAgentCompanies(agentId, companyIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Companies assigned successfully!');
      options?.onSuccess?.();
    },
  });
}
