import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AppUserRole } from '@/types';

export interface InviteTokenInput {
  company_id: number[];
  app_role: AppUserRole;
}

export function useInviteManager() {
  const {
    mutateAsync: createInviteAction,
    isPending: isGenerating,
    data: inviteLink,
    reset: resetInvite,
  } = useMutation({
    mutationFn: async ({ company_id, app_role }: InviteTokenInput) => {
      const now = new Date();
      const expiredAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { data, error: supabaseError } = await supabase
        .from('invite_tokens')
        .insert([
          {
            datas: {
              company_id: company_id,
              app_role: app_role,
            },
            expired_at: expiredAt.toISOString(),
          },
        ])
        .select('token')
        .single();

      if (supabaseError) throw supabaseError;

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
