import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface InviteData {
  id: string;
  company_id: number;
  token: string | null;
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
          .gt('expired_at', new Date().toISOString())
          .single();

        if (error || !data) {
          setInviteError('Token already used, expired or invalid');
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
