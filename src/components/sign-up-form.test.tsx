import { createClient } from '@supabase/supabase-js'
import { vitest, describe, beforeAll, test, expect } from 'vitest'
import { clearAllUsers } from '@/lib/utils'

describe('Test trigger of admin automatic assignation', () => {
    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_SECRET_KEY);
    beforeAll(async () => {
        //Clear user        
        await supabase
            .from("app_user")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");

        await clearAllUsers(supabase)
    })

    test('First user is Admin, second one failed', async() => {
        //First user
        const { data: user1, error: err1 } = await supabase.auth.admin.createUser({
            email: 'test1@test.fr',
            password: '123456',
            email_confirm: true,
            user_metadata: { name: 'Test1' }
        })
        if(err1) throw err1

        //Check role
        const { data: profile1 } = await supabase
            .from('app_user')
            .select('role')
            .eq('id', user1.user.id)
            .single()

        expect(profile1?.role).toBe('admin')

        //Second user
        const { data: user2, error: err2 } = await supabase.auth.admin.createUser({
            email: 'test2@test.fr',
            password: '123456',
            email_confirm: true,
            user_metadata: { name: 'Test2' }
        })
        expect(err2).toBeDefined()
        expect(err2?.status).toBe(500);
        expect(err2?.code).toBe('unexpected_failure');
    })
})