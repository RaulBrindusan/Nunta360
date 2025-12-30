'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Euro, PieChart } from 'lucide-react';
import { formatCurrency, formatInputValue, parseInputValue } from '@/lib/formatNumber';

export type BudgetCategory = 'Locație' | 'Catering' | 'Decorațiuni & Flori' | 'Fotograf & Videograf' | 'Muzică & Entertainment' | 'Rochie & Costum' | 'Altele';

interface CategoryAllocation {
  category: BudgetCategory;
  allocated: number;
}

interface TotalBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, categories: CategoryAllocation[]) => Promise<void>;
  currentBudget?: number;
  existingCategories?: CategoryAllocation[];
}

const availableCategories: BudgetCategory[] = [
  'Locație',
  'Catering',
  'Decorațiuni & Flori',
  'Fotograf & Videograf',
  'Muzică & Entertainment',
  'Rochie & Costum',
  'Altele',
];

// Budget allocation percentages by priority (totals 100%)
const categoryPercentages: Record<BudgetCategory, number> = {
  'Locație': 25,
  'Catering': 35,
  'Decorațiuni & Flori': 10,
  'Fotograf & Videograf': 15,
  'Muzică & Entertainment': 8,
  'Rochie & Costum': 7,
  'Altele': 0,
};

const TotalBudgetModal: React.FC<TotalBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentBudget,
  existingCategories = []
}) => {
  const [amount, setAmount] = useState(currentBudget?.toString() || '');
  const [categoryAmounts, setCategoryAmounts] = useState<Record<BudgetCategory, string>>({
    'Locație': '',
    'Catering': '',
    'Decorațiuni & Flori': '',
    'Fotograf & Videograf': '',
    'Muzică & Entertainment': '',
    'Rochie & Costum': '',
    'Altele': '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset form and populate with existing data when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount(currentBudget ? formatInputValue(currentBudget.toFixed(2).replace('.', ',')) : '');

      // Populate with existing categories or empty values
      const newCategoryAmounts: Record<BudgetCategory, string> = {
        'Locație': '',
        'Catering': '',
        'Decorațiuni & Flori': '',
        'Fotograf & Videograf': '',
        'Muzică & Entertainment': '',
        'Rochie & Costum': '',
        'Altele': '',
      };

      // Fill in existing category values with formatting
      existingCategories.forEach(cat => {
        newCategoryAmounts[cat.category] = formatInputValue(cat.allocated.toFixed(2).replace('.', ','));
      });

      setCategoryAmounts(newCategoryAmounts);
    }
  }, [isOpen, currentBudget, existingCategories]);

  const handleCategoryAmountChange = (category: BudgetCategory, value: string) => {
    const formatted = formatInputValue(value);
    const updatedAmounts = {
      ...categoryAmounts,
      [category]: formatted,
    };
    setCategoryAmounts(updatedAmounts);

    // Auto-update total budget if category sum exceeds it
    const total = availableCategories.reduce((sum, cat) => {
      const val = updatedAmounts[cat];
      const numVal = parseInputValue(val);
      return sum + (isNaN(numVal) ? 0 : numVal);
    }, 0);

    const currentBudgetNum = parseInputValue(amount);
    if (!isNaN(currentBudgetNum) && total > currentBudgetNum) {
      setAmount(formatInputValue(total.toFixed(2).replace('.', ',')));
    }
  };

  // Auto-allocate budget when amount changes (only on first setup)
  const handleBudgetAmountChange = (value: string) => {
    const formatted = formatInputValue(value);
    setAmount(formatted);

    const numValue = parseInputValue(formatted);
    // Only auto-allocate if this is first time setup (no existing categories)
    if (!isNaN(numValue) && numValue > 0 && existingCategories.length === 0) {
      const allocatedAmounts: Record<BudgetCategory, string> = {} as any;

      availableCategories.forEach(category => {
        const percentage = categoryPercentages[category];
        const allocated = (numValue * percentage) / 100;
        allocatedAmounts[category] = allocated > 0 ? formatInputValue(allocated.toFixed(2).replace('.', ',')) : '';
      });

      setCategoryAmounts(allocatedAmounts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      return;
    }

    const numericAmount = parseInputValue(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    // Build categories array from entered amounts
    const categoryAllocations: CategoryAllocation[] = [];
    availableCategories.forEach(category => {
      const allocatedAmount = categoryAmounts[category];
      const parsedAmount = parseInputValue(allocatedAmount);
      if (allocatedAmount && parsedAmount > 0) {
        categoryAllocations.push({
          category,
          allocated: parsedAmount,
        });
      }
    });

    setIsLoading(true);
    await onSave(numericAmount, categoryAllocations);
    setIsLoading(false);

    // Reset form and close
    setAmount('');
    setCategoryAmounts({
      'Locație': '',
      'Catering': '',
      'Decorațiuni & Flori': '',
      'Fotograf & Videograf': '',
      'Muzică & Entertainment': '',
      'Rochie & Costum': '',
      'Altele': '',
    });
    onClose();
  };

  const handleClose = () => {
    setAmount(currentBudget?.toString() || '');
    setCategoryAmounts({
      'Locație': '',
      'Catering': '',
      'Decorațiuni & Flori': '',
      'Fotograf & Videograf': '',
      'Muzică & Entertainment': '',
      'Rochie & Costum': '',
      'Altele': '',
    });
    onClose();
  };

  const isCategoriesDisabled = !amount || parseInputValue(amount) <= 0 || isNaN(parseInputValue(amount));

  // Calculate total allocated from input fields
  const totalAllocated = availableCategories.reduce((sum, category) => {
    const value = categoryAmounts[category];
    const numValue = parseInputValue(value);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);

  const remainingBudget = amount ? parseInputValue(amount) - totalAllocated : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[85%] sm:w-full sm:max-w-2xl bg-white border-blush-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-elegant text-charcoal flex items-center gap-2">
            <Euro className="w-6 h-6 text-blush-400" />
            {currentBudget ? 'Actualizează Bugetul' : 'Setează Bugetul Total'}
          </DialogTitle>
          <DialogDescription className="text-center text-charcoal/70">
            Introdu bugetul total și distribuie-l pe categorii
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Budget */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-charcoal font-medium">
              Buget Total (€)
            </Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleBudgetAmountChange(e.target.value)}
              placeholder="10.000,00"
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 text-lg"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Budget Categories Section */}
          <div className={`space-y-4 pt-4 border-t border-blush-100 ${isCategoriesDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blush-400" />
                <h3 className="font-elegant font-medium text-charcoal">
                  Categorii Buget {isCategoriesDisabled && '(introdu bugetul mai întâi)'}
                </h3>
              </div>
              {!isCategoriesDisabled && (
                <div className="text-sm font-medium text-charcoal/70">
                  Total alocat: €{formatCurrency(totalAllocated)} / €{amount || '0'}
                  {remainingBudget < 0 && <span className="text-red-500 ml-2">(depășit cu €{formatCurrency(Math.abs(remainingBudget))})</span>}
                </div>
              )}
            </div>

            {/* All Categories with Input Fields */}
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center justify-between gap-3 p-3 bg-blush-50 rounded-lg">
                  <Label className="text-sm font-medium text-charcoal font-elegant min-w-[180px]">
                    {category}
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-charcoal/70">€</span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={categoryAmounts[category]}
                      onChange={(e) => handleCategoryAmountChange(category, e.target.value)}
                      placeholder="0,00"
                      className="w-32 border-blush-200 focus:border-blush-400"
                      disabled={isCategoriesDisabled || isLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-blush-200 text-charcoal hover:bg-blush-50"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blush-400 hover:bg-blush-500 text-white font-semibold"
            >
              {isLoading ? 'Se salvează...' : 'Salvează'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TotalBudgetModal;
