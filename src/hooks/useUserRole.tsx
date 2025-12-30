import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time listener for user role
  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.id);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData?.role || 'user');
        } else {
          setRole('user'); // Default to user role
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user role:', error);
        setRole('user'); // Default to user role
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { role, loading };
};
