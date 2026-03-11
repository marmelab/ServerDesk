import { createClient } from '@supabase/supabase-js';
import { describe, beforeAll, test, expect } from 'vitest';
import { clearAllUsers } from '@/lib/utils';

describe('Test trigger of admin automatic assignation', () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.API_URL;
  const supabaseServiceKey =
    import.meta.env.VITE_SUPABASE_SECRET_KEY || process.env.SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  beforeAll(async () => {
    //Clear user
    await clearAllUsers(supabase);
  });

  test('First user is Admin, second one agent, third one customer manager', async () => {
    //First user
    const { data: firstUser, error: err1 } =
      await supabase.auth.admin.createUser({
        email: 'test1@test.fr',
        password: '123456',
        email_confirm: true,
        user_metadata: { name: 'Test1' },
      });
    if (err1) throw err1;

    //Check role
    const { data: profile1 } = await supabase
      .from('app_user')
      .select('role')
      .eq('id', firstUser.user.id)
      .single();

    expect(profile1?.role).toBe('admin');

    //Second user
    const { data: secondUser, error: err2 } =
      await supabase.auth.admin.createUser({
        email: 'test2@test.fr',
        password: '123456',
        email_confirm: true,
        user_metadata: { name: 'Test2' },
      });
    if (err2) throw err2;
    //Check role
    const { data: profile2 } = await supabase
      .from('app_user')
      .select('role')
      .eq('id', secondUser?.user.id)
      .single();

    expect(profile2?.role).toBe('agent');

    //Third user : customer manager

    //Insert token first
    const now = new Date();
    const expiredAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const { data: inviteToken } = await supabase
      .from('invite_tokens')
      .insert([
        {
          company_id: '1',
          expired_at: expiredAt.toISOString(),
        },
      ])
      .select('token')
      .single();

    const { data: thirdUser, error: err3 } =
      await supabase.auth.admin.createUser({
        email: 'test3@test.fr',
        password: '123456',
        email_confirm: true,
        user_metadata: {
          name: 'Test3',
          invite_token: inviteToken?.token,
          company_id: '1',
        },
      });
    if (err3) throw err3;
    //Check role
    const { data: profile3 } = await supabase
      .from('app_user')
      .select('role')
      .eq('id', thirdUser?.user.id)
      .single();

    expect(profile3?.role).toBe('customer_manager');
  });
});
