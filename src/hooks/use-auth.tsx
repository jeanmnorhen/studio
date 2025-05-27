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
  const [isLoading, setIsLoading] = useState(true); // True until Firebase auth resolves
  const [isClient, setIsClient] = useState(false); // State to track if we are on the client

  useEffect(() => {
    // This effect runs only on the client, after the component mounts
    setIsClient(true);

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Firebase auth state resolved
    });

    return () => unsubscribe();
  }, []);

  // Logic for showing a spinner on specific pages while auth is loading on the client
  if (isClient && isLoading) {
    // This block now only runs on the client (isClient is true)
    // and only if Firebase auth is still determining its state (isLoading is true)
    const path = window.location.pathname; // Safe to use window object here
    if (path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/signup')) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Spinner size={48} />
        </div>
      );
    }
  }

  // On the server (`isClient` is false), or if `isLoading` is false,
  // or if `isClient` is true, `isLoading` is true but path doesn't match the spinner paths,
  // render the children wrapped in the provider.
  // During the initial client render (before useEffect runs), `isClient` will be `false`,
  // so this path will be taken, matching the server render.
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
