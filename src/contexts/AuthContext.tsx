import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isDemoMode: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  resetPassword: (e: string) => Promise<void>;
  signOut: () => Promise<void>;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapSupabaseUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: (user.user_metadata?.full_name as string | undefined) ?? null,
    photoURL: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ? mapSupabaseUser(data.session.user) : null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (e: string, p: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: e,
      password: p,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (e: string, p: string) => {
    const { error } = await supabase.auth.signUp({
      email: e,
      password: p,
    });
    if (error) throw error;
  };

  const resetPassword = async (e: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(e, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    setIsDemoMode(false);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    // Mock a user for demo mode
    setUser({
      id: 'demo-user-123',
      email: 'demo@flyer.app',
      displayName: 'Demo User',
      photoURL: 'https://picsum.photos/seed/demo/200/200',
    });
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isDemoMode, loading, 
      signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut, 
      enableDemoMode, disableDemoMode 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
