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
    await supabase
      .from('app_user')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    await clearAllUsers(supabase);
  });

  test('First user is Admin, second one failed', async () => {
    //First user
    const { data: firstUser, error: err1 } = await supabase.auth.admin.createUser({
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
    const { data: secondUser, error: err2 } = await supabase.auth.admin.createUser({
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
  });
});
