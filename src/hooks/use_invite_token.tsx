import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface InviteData {
  id: string;
  company_id: string;
  token: string;
  companies: {
    name: string;
  };
}

export function useInviteToken(token: string | null) {
  const [inviteValidating, setInviteValidating] = useState(false);
  const [inviteError, setInviteError] = useState<any>(null);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);

  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      setInviteValidating(false);
      try {
        const { data, error } = await supabase
          .from('invite_tokens')
          .select('*, companies(name)')
          .eq('token', token)
          .is('used_at', null)
          .single();

        if (error || !data) {
          setInviteError('Token already used or invalid');
        } else {
          setInviteData(data);
        }
      } catch (err) {
        setInviteError('Error while checking token');
      } finally {
        setInviteValidating(false);
      }
    };

    validateToken();
  }, [token]);

  return { inviteData, inviteValidating, inviteError };
}
