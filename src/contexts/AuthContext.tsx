import { createContext, ReactNode, useContext } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SignInWithPasswordCredentials, User } from '@supabase/supabase-js';
import { AppUser } from '@/types';
import { handleSupabaseError } from '@/lib/error_handler';

export type FullUser = Omit<AppUser, 'id'> & {
  id: string;
  email: string | undefined;
  company_ids: number[];
};

interface AuthContextType {
  user: FullUser | null;
  isLoading: boolean;
  login: (credentials: SignInWithPasswordCredentials) => Promise<FullUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

  const fillAuthUserInfos = async (
    authUser: User,
  ): Promise<FullUser | null> => {
    const { data: appUser, error: userError } = await supabase
      .from('app_user')
      .select()
      .eq('id', authUser.id)
      .maybeSingle();
    if (userError) handleSupabaseError(userError);
    const { data: userCompanies, error: userCompanyError } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', authUser.id);
    if (userCompanyError) handleSupabaseError(userCompanyError);
    if (!appUser) return null;
    return {
      ...appUser,
      id: authUser.id,
      email: authUser.email,
      company_ids: userCompanies?.map((uc) => uc.company_id) || [],
    } as FullUser;
  };

  // First check is user is connected
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) {
          console.error('Auth init error:', authError);
          return;
        }
        if (authUser) {
          const fullUser = await fillAuthUserInfos(authUser);
          if (fullUser) setUser(fullUser);
        }
      } catch (error) {
        console.error('Initialization auth error:', error);
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
    const baseURL = `${import.meta.env.BASE_URL}auth/`.replace(/\/+/g, '/');
    const isAuthPage = window.location.pathname.startsWith(baseURL);
    if (!user && !isAuthPage) {
      window.location.href = baseURL + 'login';
    } else if (user && isAuthPage) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  const login = async (
    credentials: SignInWithPasswordCredentials,
  ): Promise<FullUser> => {
    const { data, error: authError } =
      await supabase.auth.signInWithPassword(credentials);
    if (authError) {
      handleSupabaseError(authError);
      throw authError;
    }

    if (data.user) {
      const fullUser = await fillAuthUserInfos(data.user);
      if (fullUser) {
        setUser(fullUser);
        return fullUser;
      }
    }
    throw new Error('User profile not found in database.');
  };

  const logout = async () => {
    setIsLogout(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      handleSupabaseError(error);
      setIsLogout(false);
      throw error;
    }
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {isLoading || isLogout ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="animate-pulse text-sm font-medium">
            {isLogout ? 'Signing out' : 'Handling user'}...
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
