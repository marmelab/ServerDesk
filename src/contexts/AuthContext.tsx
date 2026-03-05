import { createContext, ReactNode, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { AppUser } from '@/types';

interface AuthContextType {
    user: User | null,
    appUser: AppUser | null,
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { user: null, appUser: null };
            }
            const { data: appUser } = await supabase
                .from('app_user')
                .select()
                .eq('id', user.id)
                .maybeSingle();
            console.log("found user");
            return { user, appUser };
        },
        staleTime: Infinity,
    });

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                queryClient.invalidateQueries({ queryKey: ['auth-user'] });
            }

            if (event === 'SIGNED_OUT') {
                queryClient.setQueryData(['auth_user'], { user: null, appUser: null });
                queryClient.clear();
            }
        });
        return () => subscription.unsubscribe();
    }, [queryClient]);

    const value: AuthContextType = {
        user: data?.user ?? null,
        appUser: data?.appUser ?? null,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
}