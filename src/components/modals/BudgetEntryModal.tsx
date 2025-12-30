'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { formatInputValue, parseInputValue } from '@/lib/formatNumber';

interface BudgetEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: BudgetEntry) => void;
}

interface BudgetEntry {
  category: string;
  amount: number;
}

const budgetCategories = [
  'Locație & Catering',
  'Decorațiuni & Flori',
  'Fotograf & Videograf',
  'Muzică & Entertainment',
  'Rochie & Costum',
  'Transport',
  'Invitații',
  'Altele'
];

const BudgetEntryModal: React.FC<BudgetEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount) {
      alert('Te rog completează toate câmpurile');
      return;
    }

    const numericAmount = parseInputValue(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Te rog introdu o sumă validă');
      return;
    }

    onSave({
      category,
      amount: numericAmount
    });

    // Reset form
    setCategory('');
    setAmount('');
    onClose();
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatInputValue(value);
    setAmount(formatted);
  };

  const handleClose = () => {
    setCategory('');
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-elegant text-charcoal flex items-center gap-2">
            <Plus className="w-5 h-5 text-blush-400" />
            Adaugă Buget Categorie
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-elegant text-charcoal">
              Categorie
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-blush-200 focus:border-blush-400">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {budgetCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-elegant text-charcoal">
              Sumă Alocată (€)
            </Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0,00"
              className="border-blush-200 focus:border-blush-400"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-blush-200 text-charcoal hover:bg-blush-50"
            >
              Anulează
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blush-400 hover:bg-blush-500 text-white"
            >
              Salvează
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetEntryModal;