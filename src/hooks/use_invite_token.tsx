import { handleSupabaseError } from '@/lib/error_handler';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export function useInviteToken(token: string | null) {
  const query = useQuery({
    queryKey: ['invite-token', token],
    queryFn: async () => {
      if (!token) return null;

      const { data, error } = await supabase
        .from('invite_tokens')
        .select('*, companies(name)')
        .eq('token', token)
        .gt('expired_at', new Date().toISOString())
        .maybeSingle();

      if (error) handleSupabaseError(error);

      if (!data) {
        throw new Error(
          'This invitation link is already used, invalid or has expired.',
        );
      }

      return data;
    },
    enabled: !!token,
    retry: false,
  });
  return {
    inviteData: query.data,
    inviteValidating: query.isLoading,
    inviteError: query.error?.message,
  };
}
