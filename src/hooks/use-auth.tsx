'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
  User,
  getRedirectResult,
  inMemoryPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Use redirect-based sign-in to avoid popup blockers
      await setPersistence(auth, inMemoryPersistence);
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      if (error.code === 'auth/unauthorized-domain') {
        toast({
            variant: 'destructive',
            title: 'Unauthorized Domain',
            description: 'This domain is not authorized for sign-in. Please contact support.',
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Sign-in Error',
            description: 'An unexpected error occurred during sign-in. Please try again.',
        });
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      toast({
        variant: 'destructive',
        title: 'Sign-out Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };
  
  // Handle the redirect result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in.
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex items-center">
              <Skeleton className="h-6 w-6 mr-2" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
