'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { ExpenseCategory } from '@/hooks/useExpenses';
import { formatInputValue, parseInputValue } from '@/lib/formatNumber';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: ExpenseCategory, price: number) => Promise<boolean>;
  defaultCategory?: ExpenseCategory;
}

const expenseCategories: ExpenseCategory[] = [
  'Locație',
  'Catering',
  'Decorațiuni & Flori',
  'Fotograf & Videograf',
  'Muzică & Entertainment',
  'Rochie & Costum',
  'Altele',
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, defaultCategory }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>(defaultCategory || '');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update category when defaultCategory changes
  React.useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !price) {
      return;
    }

    const numericPrice = parseInputValue(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return;
    }

    setIsLoading(true);
    const success = await onSave(name, category, numericPrice);
    setIsLoading(false);

    if (success) {
      // Reset form and close
      setName('');
      setCategory('');
      setPrice('');
      onClose();
    }
  };

  const handlePriceChange = (value: string) => {
    const formatted = formatInputValue(value);
    setPrice(formatted);
  };

  const handleClose = () => {
    setName('');
    setCategory('');
    setPrice('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-blush-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-elegant text-charcoal flex items-center gap-2">
            <Plus className="w-6 h-6 text-blush-400" />
            Adaugă Cheltuială
          </DialogTitle>
          <DialogDescription className="text-center text-charcoal/70">
            Completează detaliile cheltuielii
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-charcoal font-medium">
              Nume Cheltuială
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Avans Locație"
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-charcoal font-medium">
              Categorie
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
              disabled={isLoading}
            >
              <SelectTrigger className="border-blush-200 focus:border-blush-400">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-charcoal font-medium">
              Preț (€)
            </Label>
            <Input
              id="price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0,00"
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
              required
              disabled={isLoading}
            />
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

export default AddExpenseModal;
