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
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (isClient && isLoading) {
    const path = window.location.pathname; 
    // A página raiz '/' é agora a página de login.
    if (path.startsWith('/admin') || path === '/' || path === '/signup') {
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
