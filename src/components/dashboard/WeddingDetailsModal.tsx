'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';
import { useToast } from '@/components/ui/use-toast';
import { Heart, Calendar } from 'lucide-react';

interface WeddingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WeddingDetailsModal: React.FC<WeddingDetailsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { saveWeddingDetails } = useWeddingDetails();
  const { toast } = useToast();
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await saveWeddingDetails({
        brideName,
        groomName,
        weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      });

      if (success) {
        onSuccess();
        onClose();
        // Reset form
        setBrideName('');
        setGroomName('');
        setWeddingDate('');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save wedding details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-blush-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-serif text-charcoal">
            <Heart className="w-6 h-6 text-blush-400" />
            Detalii Nuntă
          </DialogTitle>
          <DialogDescription className="text-center text-charcoal/70">
            Bun venit! Să începem prin a seta detaliile importante ale nunții tale.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bride Name */}
          <div className="space-y-2">
            <Label htmlFor="brideName" className="text-charcoal font-medium">
              Numele Miresei
            </Label>
            <Input
              id="brideName"
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
              placeholder="Introdu numele miresei"
              required
              disabled={isLoading}
            />
          </div>

          {/* Groom Name */}
          <div className="space-y-2">
            <Label htmlFor="groomName" className="text-charcoal font-medium">
              Numele Mirelui
            </Label>
            <Input
              id="groomName"
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
              placeholder="Introdu numele mirelui"
              required
              disabled={isLoading}
            />
          </div>

          {/* Wedding Date */}
          <div className="space-y-2">
            <Label htmlFor="weddingDate" className="text-charcoal font-medium">
              Data Nunții
            </Label>
            <div className="relative">
              <Input
                id="weddingDate"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pr-10"
                required
                disabled={isLoading}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blush-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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

export default WeddingDetailsModal;