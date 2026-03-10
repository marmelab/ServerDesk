import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useInviteManager() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const createInvite = async (companyId: number) => {
    setIsGenerating(true);
    setTokenError(null);
    setInviteToken(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('invite_tokens')
        .insert([{ company_id: companyId }])
        .select('token')
        .single();

      if (supabaseError) throw supabaseError;

      const inviteLink = `${import.meta.env.VITE_APP_HOST}:${import.meta.env.VITE_APP_PORT}${import.meta.env.BASE_URL}auth/signup?invite=${data.token}`;
      setInviteToken(inviteLink);
    } catch (err: any) {
      const msg = err.message || 'Failed to generate invite token';
      setTokenError(msg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  const resetInvite = () => {
    setInviteToken(null);
    setTokenError(null);
  };

  return {
    createInvite,
    isGenerating,
    inviteToken,
    tokenError,
    resetInvite,
  };
}
