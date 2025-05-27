
// src/app/auth-actions.ts
'use server';

import { cookies } from 'next/headers';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { app } from '@/lib/firebase'; // Ensure your Firebase app is initialized here
import { z } from 'zod';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';

const EmailPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthResult = { success: true; userId?: string } | { success: false; error: string };

export async function signUpWithEmail(credentials: unknown): Promise<AuthResult> {
  const validation = EmailPasswordSchema.safeParse(credentials);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }
  const { email, password } = validation.data;

  try {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set a session cookie (could be an ID token, or just a flag for simple session)
    // For production, use Firebase ID tokens and manage them securely.
    cookies().set(AUTH_COOKIE_NAME, user.uid, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true, userId: user.uid };
  } catch (error: any) {
    console.error("Signup Error:", error);
    return { success: false, error: error.message || "Failed to create account." };
  }
}

export async function loginWithEmail(credentials: unknown): Promise<AuthResult> {
  const validation = EmailPasswordSchema.safeParse(credentials);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }
  const { email, password } = validation.data;

  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    cookies().set(AUTH_COOKIE_NAME, user.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true, userId: user.uid };
  } catch (error: any) {
    console.error("Login Error:", error);
    return { success: false, error: error.message || "Invalid email or password." };
  }
}

export async function signOutUser(): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const auth = getAuth(app);
    await firebaseSignOut(auth);
    cookies().delete(AUTH_COOKIE_NAME);
    return { success: true };
  } catch (error: any) {
    console.error("Signout Error:", error);
    return { success: false, error: error.message || "Failed to sign out." };
  }
}

export async function getCurrentUser(): Promise<{ uid: string | null } | null> {
    const sessionCookie = cookies().get(AUTH_COOKIE_NAME);
    if (sessionCookie?.value) {
        return { uid: sessionCookie.value };
    }
    return null;
}
