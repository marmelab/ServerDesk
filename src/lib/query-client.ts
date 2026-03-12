import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { handleSupabaseError } from './error_handler';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      // For global fetch errors
      handleSupabaseError(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // For global create/update/delete errors
      handleSupabaseError(error.message);
    },
  }),
});
