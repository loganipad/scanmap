import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (e: string, p: string) => {
    await signInWithEmailAndPassword(auth, e, p);
  };

  const signUpWithEmail = async (e: string, p: string) => {
    await createUserWithEmailAndPassword(auth, e, p);
  };

  const resetPassword = async (e: string) => {
    await sendPasswordResetEmail(auth, e);
  };

  const signOut = async () => {
    setIsDemoMode(false);
    await firebaseSignOut(auth);
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    // Mock a user for demo mode
    setUser({
      uid: 'demo-user-123',
      email: 'demo@flyer.app',
      displayName: 'Demo User',
      photoURL: 'https://picsum.photos/seed/demo/200/200',
    } as User);
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
