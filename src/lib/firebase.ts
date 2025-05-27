
import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

if (!dbUrl || !dbUrl.startsWith('https://') || !dbUrl.includes('.firebaseio.com')) {
  const errorMessage = 
    `Firebase Configuration Error: Invalid or missing NEXT_PUBLIC_FIREBASE_DATABASE_URL.
    Received: "${dbUrl}"
    Expected format: Typically 'https://<YOUR_PROJECT_ID>-default-rtdb.firebaseio.com' or 'https://<YOUR_PROJECT_ID>.firebaseio.com'.
    Please verify this value in your .env file and ensure your Firebase project has Realtime Database enabled.`;
  console.error(errorMessage); // Log to server console for more details
  throw new Error(errorMessage); // This error will be displayed by Next.js
}

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: dbUrl, // Use the validated dbUrl
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const database = getDatabase(app);

export { app, database };
