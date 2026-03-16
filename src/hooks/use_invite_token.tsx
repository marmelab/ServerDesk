import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { InviteTokenInput } from './use_create_token';

export function useInviteToken(token: string | null) {
  const query = useQuery({
    queryKey: ['invite-token', token],
    queryFn: async () => {
      if (!token) return null;

      const { data: invite, error: inviteError } = await supabase
        .from('invite_tokens')
        .select('*')
        .eq('token', token)
        .gt('expired_at', new Date().toISOString())
        .maybeSingle();

      if (inviteError) throw inviteError;

      if (!invite) {
        throw new Error(
          'This invitation link is already used, invalid or has expired.',
        );
      }

      const metadata = invite.datas as unknown as InviteTokenInput;

      const { data: company, error } = await supabase
        .from('companies')
        .select('name')
        .in('id', metadata.company_id);

      if (error) throw error;
      return { ...invite, companies: company };
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
