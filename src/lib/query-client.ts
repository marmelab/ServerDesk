import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      // For global fetch errors
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // For global create/update/delete errors
      toast.error(error.message);
    },
  }),
});
