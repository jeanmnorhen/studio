
// src/hooks/use-auth.tsx
"use client";

import type React from 'react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Your Firebase app initialization
import { Spinner } from '@/components/loader';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // While Firebase SDK initializes and checks auth state, show a loader.
  // This prevents flashing unauthenticated content.
  if (isLoading && typeof window !== 'undefined') {
     // A simple full-page loader for initial auth check
     // You might want to refine this for better UX (e.g. only if on protected routes)
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path === '/login' || path === '/signup') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Spinner size={48} />
            </div>
        );
    }
  }


  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
