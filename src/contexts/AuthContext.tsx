import { createContext, ReactNode, useContext } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SignInWithPasswordCredentials, User } from '@supabase/supabase-js';
import { AppUser } from '@/types';

export type FullUser = Omit<AppUser, 'id'> & {
  id: string;
  email: string | undefined;
};

interface AuthContextType {
  user: FullUser | null;
  login: (credentials: SignInWithPasswordCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fillAuthUserInfos = async (authUser: User): Promise<FullUser | null> => {
    const { data: appUser } = await supabase
      .from('app_user')
      .select()
      .eq('id', authUser.id)
      .maybeSingle<AppUser>();
    return {
      ...appUser,
      id: authUser.id,
      email: authUser.email,
    } as FullUser;
  }

  // First check is user is connected
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser) {
          const fullUser = await fillAuthUserInfos(authUser);
          if (fullUser)
            setUser(fullUser);
        }
      } catch (error) {
        console.error("Erreur d'initialisation auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      const isAuthPage = window.location.pathname.startsWith('/auth/');
      if (!isAuthPage) {
        window.location.href = '/auth/login';
      }
    }
  }, [user, isLoading]);

  const login = async (credentials: SignInWithPasswordCredentials) => {
    const { data, error: authError } =
      await supabase.auth.signInWithPassword(credentials);
    if (authError) throw authError;

    if (data.user) {
      const fullUser = await fillAuthUserInfos(data.user);
      if (fullUser)
        setUser(fullUser);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
