'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetCategories } from '@/hooks/useBudgetCategories';
import { useExpenses } from '@/hooks/useExpenses';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatCurrency, formatNumber } from '@/lib/formatNumber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TotalBudgetModal from '@/components/modals/TotalBudgetModal';
import AddExpenseModal from '@/components/modals/AddExpenseModal';
import type { BudgetCategory as BudgetCategoryType } from '@/components/modals/TotalBudgetModal';
import {
  Plus,
  Euro,
  PieChart,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';

const Budget = () => {
  const { t } = useLanguage();
  const { budget, loading: budgetLoading, saveBudget } = useBudget();
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useBudgetCategories(budget?.id);
  const { expenses, loading: expensesLoading, addExpense } = useExpenses();
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [expensesPage, setExpensesPage] = useState(0);

  const loading = budgetLoading || categoriesLoading || expensesLoading;

  // Calculate total allocated budget from categories
  const totalAllocated = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.allocated, 0);
  }, [categories]);

  // Calculate total spent from expenses
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.price, 0);
  }, [expenses]);

  // Calculate spent per category
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};
    expenses.forEach((exp) => {
      spending[exp.category] = (spending[exp.category] || 0) + exp.price;
    });
    return spending;
  }, [expenses]);

  const handleBudgetSave = async (amount: number, categoryAllocations: { category: BudgetCategoryType; allocated: number }[]) => {
    // Save budget first and get the budget ID
    const savedBudgetId = await saveBudget(amount);

    if (!savedBudgetId) return;

    // Handle category updates
    // Create a map of new allocations for quick lookup
    const newAllocationsMap = new Map(
      categoryAllocations.map(cat => [cat.category, cat.allocated])
    );

    // Update or delete existing categories
    for (const existingCat of categories) {
      const newAllocation = newAllocationsMap.get(existingCat.category);

      if (newAllocation !== undefined && newAllocation > 0) {
        // Update existing category
        await updateCategory(existingCat.id, newAllocation);
        newAllocationsMap.delete(existingCat.category); // Remove from map
      } else {
        // Delete category if it's set to 0 or removed
        await deleteCategory(existingCat.id);
      }
    }

    // Add new categories that don't exist yet
    for (const [category, allocated] of newAllocationsMap.entries()) {
      if (allocated > 0) {
        await addCategory(category as any, allocated, savedBudgetId);
      }
    }
  };

  const handleExpenseSave = async (name: string, category: string, price: number) => {
    const result = await addExpense(name, category as any, price);
    if (result) {
      setSelectedCategory(undefined); // Clear selected category after save
    }
    return result;
  };

  const handleAddExpenseForCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setShowExpenseModal(true);
  };

  const handleCloseExpenseModal = () => {
    setShowExpenseModal(false);
    setSelectedCategory(undefined);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-charcoal/60">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const remainingBudget = (budget?.totalBudget || 0) - totalSpent;
  const budgetProgress = budget?.totalBudget ? (totalSpent / budget.totalBudget) * 100 : 0;

  // Pagination for expenses
  const expensesPerPage = 3;
  const totalExpensesPages = Math.ceil(expenses.length / expensesPerPage);
  const startExpenseIndex = expensesPage * expensesPerPage;
  const endExpenseIndex = startExpenseIndex + expensesPerPage;
  const currentExpenses = expenses.slice(startExpenseIndex, endExpenseIndex);
  const hasMultipleExpensePages = expenses.length > expensesPerPage;

  const handlePreviousExpensesPage = () => {
    setExpensesPage(prev => Math.max(0, prev - 1));
  };

  const handleNextExpensesPage = () => {
    setExpensesPage(prev => Math.min(totalExpensesPages - 1, prev + 1));
  };

  return (
    <DashboardLayout>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-wedding text-charcoal mb-2">
              Managementul Bugetului
            </h1>
            <p className="text-charcoal/60 text-base font-elegant">
              Planifică și urmărește bugetul nunții tale
            </p>
          </div>

        {!budget ? (
          /* No budget - show add button */
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Euro className="w-16 h-16 text-blush-300 mb-4" />
              <h3 className="text-xl font-elegant font-medium text-charcoal mb-2">
                Niciun buget setat
              </h3>
              <p className="text-base text-charcoal/60 mb-6 text-center font-elegant">
                Începe prin a seta bugetul total pentru nunta ta
              </p>
              <Button
                onClick={() => setShowBudgetModal(true)}
                className="bg-blush-400 hover:bg-blush-500 text-white font-elegant"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Buget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Budget Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Euro className="h-5 w-5 text-blush-400" />
                      Buget Total
                    </div>
                    <button
                      onClick={() => setShowBudgetModal(true)}
                      className="text-gray-400 hover:text-blush-400 transition-colors cursor-pointer"
                      title="Editează bugetul"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-charcoal font-elegant">
                    €{formatCurrency(budget.totalBudget)}
                  </div>
                  <Progress value={budgetProgress} className="mt-4 bg-green-100 [&>div]:bg-green-500" />
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center gap-2">
                    <ArrowDownCircle className="h-5 w-5 text-blush-400" />
                    Cheltuieli
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blush-400 font-elegant">
                    €{formatCurrency(totalSpent)}
                  </div>
                  <p className="text-base text-charcoal/70 mt-2 font-elegant">
                    {budgetProgress.toFixed(1)}% din buget folosit
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    Rămas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 font-elegant">
                    €{formatCurrency(remainingBudget)}
                  </div>
                  <p className="text-base text-charcoal/70 mt-2 font-elegant">
                    {(100 - budgetProgress).toFixed(1)}% din buget rămas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Expenses */}
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blush-400" />
                  Cheltuieli Recente
                </CardTitle>
                {hasMultipleExpensePages && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousExpensesPage}
                      disabled={expensesPage === 0}
                      className="h-8 w-8 p-0 border-blush-200 hover:bg-blush-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-charcoal/70 font-elegant">
                      {expensesPage + 1} / {totalExpensesPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextExpensesPage}
                      disabled={expensesPage === totalExpensesPages - 1}
                      className="h-8 w-8 p-0 border-blush-200 hover:bg-blush-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-base text-charcoal/60 mb-4 font-elegant">
                      Nu ai cheltuieli adăugate încă
                    </p>
                    <Button
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-blush-400 hover:bg-blush-500 text-white font-elegant"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adaugă Prima Cheltuială
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-charcoal font-elegant">
                            {expense.name}
                          </div>
                          <div className="text-sm text-charcoal/70 font-elegant">
                            {expense.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium text-red-500 font-elegant">
                            -€{formatCurrency(expense.price)}
                          </div>
                          <div className="text-base text-charcoal/70 font-elegant">
                            {expense.createdAt?.toDate?.()?.toLocaleDateString('ro-RO') || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Categories */}
            {categories.length > 0 && (
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blush-400" />
                    Categorii Buget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const spent = categorySpending[category.category] || 0;
                      const progress = category.allocated > 0 ? (spent / category.allocated) * 100 : 0;
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-charcoal font-elegant">
                              {category.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-base text-charcoal/70 font-elegant">
                                €{formatCurrency(spent)} / €{formatCurrency(category.allocated)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 border-blush-200 hover:bg-blush-50"
                                onClick={() => handleAddExpenseForCategory(category.category)}
                                title={`Adaugă cheltuială pentru ${category.category}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Progress value={progress} className="bg-green-100 [&>div]:bg-green-500" />
                          <div className="flex justify-between text-sm text-charcoal/60 font-elegant">
                            <span>{progress.toFixed(1)}% folosit</span>
                            <span>Rămas: €{formatCurrency(category.allocated - spent)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        </div>
      </div>

      {/* Budget Modal */}
      <TotalBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleBudgetSave}
        currentBudget={budget?.totalBudget}
        existingCategories={categories.map(cat => ({
          category: cat.category,
          allocated: cat.allocated
        }))}
      />

      {/* Expense Modal */}
      <AddExpenseModal
        isOpen={showExpenseModal}
        onClose={handleCloseExpenseModal}
        onSave={handleExpenseSave}
        defaultCategory={selectedCategory as any}
      />
    </DashboardLayout>
  );
};

export default Budget; 