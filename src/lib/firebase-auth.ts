import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string
): Promise<void> {
  const userRef = doc(db, 'users', userId);

  await setDoc(userRef, {
    id: userId,
    fullName,
    email,
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  return null;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  try {
    // Create auth user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Create full name
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];

    // Update display name
    await updateProfile(user, { displayName: fullName });

    // Create user profile in Firestore
    await createUserProfile(user.uid, email, fullName);

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);

    // Clean up Firebase auth state from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('firebase:') || key.includes('firebase')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}

/**
 * Auth state observer
 */
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
