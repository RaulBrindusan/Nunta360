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
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type ExpenseCategory = 'Locație' | 'Catering' | 'Decorațiuni & Flori' | 'Fotograf & Videograf' | 'Muzică & Entertainment' | 'Rochie & Costum' | 'Altele';

export interface Expense {
  id: string;
  userId: string;
  name: string;
  category: ExpenseCategory;
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const useExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for expenses
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const expensesRef = collection(db, 'users', user.id, 'expenses');
    const q = query(expensesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expensesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "Failed to fetch expenses",
          variant: "destructive",
        });
        setExpenses([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addExpense = async (name: string, category: ExpenseCategory, price: number) => {
    if (!user) return false;

    try {
      const expensesRef = collection(db, 'users', user.id, 'expenses');

      await addDoc(expensesRef, {
        userId: user.id,
        name,
        category,
        price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateExpense = async (expenseId: string, name: string, category: ExpenseCategory, price: number) => {
    if (!user) return false;

    try {
      const expenseRef = doc(db, 'users', user.id, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        name,
        category,
        price,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!user) return false;

    try {
      const expenseRef = doc(db, 'users', user.id, 'expenses', expenseId);
      await deleteDoc(expenseRef);

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
