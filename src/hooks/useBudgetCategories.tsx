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

export type BudgetCategory = 'Locație' | 'Catering' | 'Decorațiuni & Flori' | 'Fotograf & Videograf' | 'Muzică & Entertainment' | 'Rochie & Costum' | 'Altele';

export interface BudgetCategoryItem {
  id: string;
  userId: string;
  budgetId: string;
  category: BudgetCategory;
  allocated: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useBudgetCategories = (budgetId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<BudgetCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for budget categories
  useEffect(() => {
    if (!user || !budgetId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const categoriesRef = collection(db, 'users', user.id, 'budget', budgetId, 'categories');
    const q = query(categoriesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BudgetCategoryItem[];

        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching budget categories:', error);
        toast({
          title: "Error",
          description: "Failed to fetch budget categories",
          variant: "destructive",
        });
        setCategories([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, budgetId]);

  const addCategory = async (category: BudgetCategory, allocated: number, overrideBudgetId?: string) => {
    const targetBudgetId = overrideBudgetId || budgetId;
    if (!user || !targetBudgetId) return false;

    try {
      const categoriesRef = collection(db, 'users', user.id, 'budget', targetBudgetId, 'categories');

      await addDoc(categoriesRef, {
        userId: user.id,
        budgetId: targetBudgetId,
        category,
        allocated,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Budget category added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding budget category:', error);
      toast({
        title: "Error",
        description: "Failed to add budget category",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCategory = async (categoryId: string, allocated: number) => {
    if (!user || !budgetId) return false;

    try {
      const categoryRef = doc(db, 'users', user.id, 'budget', budgetId, 'categories', categoryId);
      await updateDoc(categoryRef, {
        allocated,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Budget category updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating budget category:', error);
      toast({
        title: "Error",
        description: "Failed to update budget category",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!user || !budgetId) return false;

    try {
      const categoryRef = doc(db, 'users', user.id, 'budget', budgetId, 'categories', categoryId);
      await deleteDoc(categoryRef);

      toast({
        title: "Success",
        description: "Budget category deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting budget category:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget category",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
