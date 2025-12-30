import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface WeddingDetails {
  id: string;
  userId: string;
  brideName: string;
  groomName: string;
  weddingDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useWeddingDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);

  // Real-time listener for wedding event (first event only)
  useEffect(() => {
    if (!user) {
      setWeddingDetails(null);
      setLoading(false);
      return;
    }

    // Reference to user's events subcollection
    const eventsRef = collection(db, 'users', user.id, 'events');
    const q = query(eventsRef, limit(1)); // Get first event only

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const eventDoc = snapshot.docs[0];
          const eventData = {
            id: eventDoc.id,
            ...eventDoc.data(),
          } as WeddingDetails;

          setWeddingDetails(eventData);
          setEventId(eventDoc.id);
        } else {
          setWeddingDetails(null);
          setEventId(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching wedding details:', error);
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca detaliile nunții",
          variant: "destructive",
        });
        setWeddingDetails(null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const saveWeddingDetails = async (details: {
    brideName: string;
    groomName: string;
    weddingDate?: Date | string;
  }) => {
    if (!user) return false;

    try {
      const eventsRef = collection(db, 'users', user.id, 'events');

      // Convert weddingDate to Timestamp if provided
      const weddingTimestamp = details.weddingDate
        ? Timestamp.fromDate(
            typeof details.weddingDate === 'string'
              ? new Date(details.weddingDate)
              : details.weddingDate
          )
        : null;

      if (eventId) {
        // Update existing event
        const eventRef = doc(db, 'users', user.id, 'events', eventId);
        await updateDoc(eventRef, {
          brideName: details.brideName,
          groomName: details.groomName,
          weddingDate: weddingTimestamp,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new event
        await addDoc(eventsRef, {
          userId: user.id,
          brideName: details.brideName,
          groomName: details.groomName,
          weddingDate: weddingTimestamp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      toast({
        title: "Succes",
        description: "Detaliile nunții au fost salvate cu succes",
      });
      return true;
    } catch (error) {
      console.error('Error saving wedding details:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut salva detaliile nunții",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = () => {
    // No need for manual refetch with real-time listeners
    console.log('Real-time sync active - no manual refetch needed');
  };

  return {
    weddingDetails,
    loading,
    saveWeddingDetails,
    refetch,
  };
};
