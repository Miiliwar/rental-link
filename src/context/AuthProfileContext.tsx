import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { isProfileComplete, type ProfileMetadata } from '../utils/profile';

type AuthProfileContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileComplete: boolean;
  metadata: ProfileMetadata;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthProfileContext = createContext<AuthProfileContextValue | null>(null);

export function AuthProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const metadata = useMemo(
    () => (user?.user_metadata ?? {}) as ProfileMetadata,
    [user],
  );

  const profileComplete = useMemo(() => isProfileComplete(metadata), [metadata]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      profileComplete,
      metadata,
      refreshSession,
      signOut,
    }),
    [user, session, loading, profileComplete, metadata, refreshSession, signOut],
  );

  return <AuthProfileContext.Provider value={value}>{children}</AuthProfileContext.Provider>;
}

export function useAuthProfile() {
  const ctx = useContext(AuthProfileContext);
  if (!ctx) {
    throw new Error('useAuthProfile must be used within AuthProfileProvider');
  }
  return ctx;
}
