import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/error_handler';

export function useInviteManager() {
  const {
    mutateAsync: createInviteAction,
    isPending: isGenerating,
    data: inviteLink,
    reset: resetInvite,
  } = useMutation({
    mutationFn: async (companyId: number) => {
      const now = new Date();
      const expiredAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { data, error: supabaseError } = await supabase
        .from('invite_tokens')
        .insert([
          {
            company_id: companyId,
            expired_at: expiredAt.toISOString(),
          },
        ])
        .select('token')
        .single();

      if (supabaseError) handleSupabaseError(supabaseError);

      return `${window.location.origin}${import.meta.env.BASE_URL}auth/signup?invite=${data?.token}`;
    },
  });

  return {
    createInvite: createInviteAction,
    isGenerating,
    inviteToken: inviteLink || null,
    resetInvite,
  };
}
