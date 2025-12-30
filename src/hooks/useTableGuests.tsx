'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TableGuest {
  id: string;
  userId: string;
  name: string;
  tableId: string;
  tableName?: string;
  eventId?: string;
  guestId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TableGuestWithActions extends TableGuest {
  isEditing?: boolean;
}

export const useTableGuests = () => {
  const [tableGuests, setTableGuests] = useState<TableGuestWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Real-time listener for table guests
  useEffect(() => {
    if (!user) {
      setTableGuests([]);
      setLoading(false);
      return;
    }

    const tableGuestsRef = collection(db, 'users', user.id, 'tableGuests');
    const q = query(tableGuestsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const guestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TableGuestWithActions[];

        setTableGuests(guestsData);
        setLoading(false);
        setError(null);
        console.log('Fetched table guests:', guestsData.length, 'table guests');
      },
      (err) => {
        console.error('Error fetching table guests:', err);
        setError(err.message || 'Failed to fetch table guests');
        setTableGuests([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Get guests for a specific table
  const getGuestsForTable = (tableId: string): TableGuestWithActions[] => {
    return tableGuests.filter(guest => guest.tableId === tableId);
  };

  // Add a new guest to a table
  const addGuestToTable = async (
    name: string,
    tableId: string,
    tableName?: string,
    eventId?: string,
    guestId?: string
  ): Promise<TableGuest | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);

      const tableGuestsRef = collection(db, 'users', user.id, 'tableGuests');

      const guestData = {
        userId: user.id,
        name: name.trim(),
        tableId,
        tableName: tableName || null,
        eventId: eventId || null,
        guestId: guestId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(tableGuestsRef, guestData);

      console.log('Successfully added table guest:', docRef.id);
      return { id: docRef.id, ...guestData } as TableGuest;
    } catch (err) {
      console.error('Error adding guest:', err);
      setError(err instanceof Error ? err.message : 'Failed to add guest');
      return null;
    }
  };

  // Update a guest
  const updateGuest = async (
    guestId: string,
    updates: Partial<Pick<TableGuest, 'name' | 'tableId' | 'tableName'>>
  ): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);

      const guestRef = doc(db, 'users', user.id, 'tableGuests', guestId);
      await updateDoc(guestRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      console.log('Successfully updated table guest:', guestId);
      return true;
    } catch (err) {
      console.error('Error updating guest:', err);
      setError(err instanceof Error ? err.message : 'Failed to update guest');
      return false;
    }
  };

  // Delete a guest
  const deleteGuest = async (guestId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);

      const guestRef = doc(db, 'users', user.id, 'tableGuests', guestId);
      await deleteDoc(guestRef);

      console.log('Successfully deleted table guest:', guestId);
      return true;
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
      return false;
    }
  };

  // Move guest to different table
  const moveGuestToTable = async (
    guestId: string,
    newTableId: string,
    newTableName?: string
  ): Promise<boolean> => {
    return await updateGuest(guestId, {
      tableId: newTableId,
      tableName: newTableName
    });
  };

  // Toggle edit mode for a guest
  const toggleEditMode = (guestId: string) => {
    setTableGuests(prev => 
      prev.map(guest => 
        guest.id === guestId 
          ? { ...guest, isEditing: !guest.isEditing }
          : { ...guest, isEditing: false } // Close other editing modes
      )
    );
  };

  // Cancel edit mode for a guest
  const cancelEdit = (guestId: string) => {
    setTableGuests(prev => 
      prev.map(guest => 
        guest.id === guestId 
          ? { ...guest, isEditing: false }
          : guest
      )
    );
  };

  // Get guest count for a table
  const getGuestCountForTable = (tableId: string): number => {
    return tableGuests.filter(guest => guest.tableId === tableId).length;
  };

  // Get total guest count
  const getTotalGuestCount = (): number => {
    return tableGuests.length;
  };

  // Clear all guests (for development/testing)
  const clearAllGuests = async (): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);

      const tableGuestsRef = collection(db, 'users', user.id, 'tableGuests');
      const snapshot = await getDocs(query(tableGuestsRef));

      // Delete all documents
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log('Successfully cleared all table guests');
      return true;
    } catch (err) {
      console.error('Error clearing guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear guests');
      return false;
    }
  };

  return {
    tableGuests,
    loading,
    error,
    getGuestsForTable,
    addGuestToTable,
    updateGuest,
    deleteGuest,
    moveGuestToTable,
    toggleEditMode,
    cancelEdit,
    getGuestCountForTable,
    getTotalGuestCount,
    clearAllGuests,
  };
};