import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EventDetails {
  id: string;
  userId: string;
  brideName: string;
  groomName: string;
  weddingDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  useEffect(() => {
    if (!user) {
      setUserDetails(null);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserDetails({
            id: userSnap.id,
            ...userSnap.data(),
          } as UserDetails);
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Real-time listener for event details
  useEffect(() => {
    if (!user) {
      setEventDetails(null);
      setLoading(false);
      return;
    }

    const eventsRef = collection(db, 'users', user.id, 'events');
    const q = query(eventsRef, limit(1));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const eventDoc = snapshot.docs[0];
          setEventDetails({
            id: eventDoc.id,
            ...eventDoc.data(),
          } as EventDetails);
        } else {
          setEventDetails(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching event details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch event details",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const updateUserDetails = async (details: {
    fullName?: string;
    email?: string;
  }) => {
    if (!user) return false;

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...details,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "User details updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating user details:', error);
      toast({
        title: "Error",
        description: "Failed to update user details",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = () => {
    // Real-time sync active - no manual refetch needed
    console.log('Real-time sync active for events');
  };

  return {
    eventDetails,
    userDetails,
    loading,
    updateUserDetails,
    refetch,
  };
};