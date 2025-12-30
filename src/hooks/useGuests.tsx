import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Guest {
  id: string;
  userId: string;
  name: string;
  phoneNumber?: string;
  isFamily: boolean;
  familySize: number;
  status: 'in_asteptare' | 'confirmat' | 'refuzat';
  menuPreference: 'normal' | 'vegetarian' | 'vegan' | 'fara_gluten' | 'alte_alergii';
  familyMembers?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useGuests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for guests
  useEffect(() => {
    if (!user) {
      setGuests([]);
      setLoading(false);
      return;
    }

    // Reference to user's guests subcollection
    const guestsRef = collection(db, 'users', user.id, 'guests');
    const q = query(guestsRef);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const guestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Guest[];

        setGuests(guestsData);
        setLoading(false);
        console.log('Fetched guests:', guestsData.length, 'guests');
      },
      (error) => {
        console.error('Error fetching guests:', error);
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca invitații",
          variant: "destructive",
        });
        setGuests([]);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const addGuest = async (
    name: string,
    phoneNumber?: string,
    isFamily: boolean = false,
    familySize: number = 1,
    status: 'in_asteptare' | 'confirmat' | 'refuzat' = 'in_asteptare',
    menuPreference: 'normal' | 'vegetarian' | 'vegan' | 'fara_gluten' | 'alte_alergii' = 'normal',
    familyMembers?: string[]
  ) => {
    if (!user) {
      console.error('No user found when trying to add guest');
      return false;
    }

    try {
      const guestsRef = collection(db, 'users', user.id, 'guests');

      const guestData = {
        userId: user.id,
        name,
        phoneNumber: phoneNumber || null,
        isFamily,
        familySize,
        status,
        menuPreference,
        familyMembers: familyMembers || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(guestsRef, guestData);

      toast({
        title: "Succes",
        description: "Invitatul a fost adăugat cu succes",
      });
      return true;
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga invitatul",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateGuest = async (guestId: string, updates: Partial<Guest>) => {
    if (!user) {
      console.error('No user found when trying to update guest');
      return false;
    }

    try {
      const guestRef = doc(db, 'users', user.id, 'guests', guestId);

      // Remove fields that shouldn't be updated
      const { id, userId, createdAt, ...updateData } = updates;

      await updateDoc(guestRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Succes",
        description: "Invitatul a fost actualizat cu succes",
      });
      return true;
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza invitatul",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!user) {
      console.error('No user found when trying to delete guest');
      return false;
    }

    try {
      const guestRef = doc(db, 'users', user.id, 'guests', guestId);
      await deleteDoc(guestRef);

      toast({
        title: "Succes",
        description: "Invitatul a fost șters cu succes",
      });
      return true;
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge invitatul",
        variant: "destructive",
      });
      return false;
    }
  };

  const refetch = () => {
    // No need for manual refetch with real-time listeners
    // Data updates automatically via onSnapshot
    console.log('Real-time sync active - no manual refetch needed');
  };

  return {
    guests,
    loading,
    addGuest,
    updateGuest,
    deleteGuest,
    refetch,
  };
};
