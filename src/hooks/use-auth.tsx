
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
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

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName });
      
      try {
        await setDoc(doc(db, 'User', newUser.uid), {
          uid: newUser.uid,
          displayName: displayName,
          email: email,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreError) {
          console.error("Firestore Error: Failed to create user document.", firestoreError);
          // Check if it's a permission error and log a helpful message.
          if (firestoreError && typeof firestoreError === 'object' && 'code' in firestoreError && (firestoreError as {code: string}).code === 'permission-denied') {
              console.warn("Heads up: The user was created in Firebase Authentication, but their profile couldn't be saved to Firestore due to security rules. Please update your Firestore rules to allow writes to the 'users' collection. For example: `match /users/{userId} { allow create: if request.auth.uid == userId; }`");
          }
      }

      setUser({ ...newUser, displayName });
      
      toast({
        title: 'Account Created!',
        description: `Welcome to the community, ${displayName}!`,
      });
      return true;
    } catch (error: any) {
      console.error('Error signing up', error);
      toast({
        variant: 'destructive',
        title: 'Sign-up Error',
        description: error.message,
      });
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      toast({
        title: 'Signed In!',
        description: `Welcome back, ${result.user.displayName || 'Artisan'}!`,
      });
      return true;
    } catch (error: any) {
      console.error('Error signing in', error);
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        switch (errorCode) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            errorMessage = 'Invalid email or password. Please check your credentials or sign up.';
            break;
          default:
            errorMessage = `Firebase: Error (${errorCode}).`;
            break;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Sign-in Error',
        description: errorMessage,
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Error signing out', error);
      toast({
        variant: 'destructive',
        title: 'Sign-out Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };

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
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
