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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Budget {
  id: string;
  userId: string;
  totalBudget: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useBudget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [budgetId, setBudgetId] = useState<string | null>(null);

  // Real-time listener for budget (first budget only)
  useEffect(() => {
    if (!user) {
      setBudget(null);
      setLoading(false);
      return;
    }

    // Reference to user's budget subcollection
    const budgetRef = collection(db, 'users', user.id, 'budget');
    const q = query(budgetRef, limit(1)); // Get first budget only

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const budgetDoc = snapshot.docs[0];
          const budgetData = {
            id: budgetDoc.id,
            ...budgetDoc.data(),
          } as Budget;

          setBudget(budgetData);
          setBudgetId(budgetDoc.id);
        } else {
          setBudget(null);
          setBudgetId(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching budget:', error);
        toast({
          title: "Error",
          description: "Failed to fetch budget",
          variant: "destructive",
        });
        setBudget(null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const saveBudget = async (totalBudget: number): Promise<string | null> => {
    if (!user) return null;

    try {
      const budgetRef = collection(db, 'users', user.id, 'budget');

      let resultBudgetId: string;

      if (budgetId) {
        // Update existing budget
        const docRef = doc(db, 'users', user.id, 'budget', budgetId);
        await updateDoc(docRef, {
          totalBudget,
          updatedAt: serverTimestamp(),
        });
        resultBudgetId = budgetId;
      } else {
        // Create new budget
        const docRef = await addDoc(budgetRef, {
          userId: user.id,
          totalBudget,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        resultBudgetId = docRef.id;
      }

      toast({
        title: "Success",
        description: "Budget saved successfully",
      });
      return resultBudgetId;
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive",
      });
      return null;
    }
  };

  const refetch = () => {
    // No need for manual refetch with real-time listeners
    console.log('Real-time sync active - no manual refetch needed');
  };

  return {
    budget,
    loading,
    saveBudget,
    refetch,
  };
};
