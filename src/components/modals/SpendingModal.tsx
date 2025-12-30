'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard } from 'lucide-react';
import { formatInputValue, parseInputValue } from '@/lib/formatNumber';

interface SpendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spending: SpendingEntry) => void;
  categories: string[];
}

interface SpendingEntry {
  category: string;
  description: string;
  amount: number;
  date: string;
}

const SpendingModal: React.FC<SpendingModalProps> = ({ isOpen, onClose, onSave, categories }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description || !amount) {
      alert('Te rog completează toate câmpurile obligatorii');
      return;
    }

    const numericAmount = parseInputValue(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Te rog introdu o sumă validă');
      return;
    }

    onSave({
      category,
      description,
      amount: numericAmount,
      date
    });

    // Reset form
    setCategory('');
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatInputValue(value);
    setAmount(formatted);
  };

  const handleClose = () => {
    setCategory('');
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-elegant text-charcoal flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blush-400" />
            Adaugă Cheltuială
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base font-elegant text-charcoal">
              Categorie *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-blush-200 focus:border-blush-400">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-elegant text-charcoal">
              Descriere *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="De ex: Avans pentru locație, Decorațiuni pentru sală..."
              className="border-blush-200 focus:border-blush-400 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-elegant text-charcoal">
              Sumă Cheltuită (€) *
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

          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-elegant text-charcoal">
              Data Cheltuielii
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

export default SpendingModal;