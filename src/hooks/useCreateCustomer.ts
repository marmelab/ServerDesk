import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '@/services/Customers';
import { toast } from 'sonner';

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer added succesfully');
    },
  });
}
