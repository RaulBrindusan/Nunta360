
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGuests } from '@/hooks/useGuests';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Phone } from 'lucide-react';

interface GuestFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useLanguage();
  const { addGuest } = useGuests();
  const { toast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim()) {
      toast({
        title: t('guestForm.nameRequired'),
        description: t('guestForm.enterGuestName'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const success = await addGuest(guestName.trim(), phoneNumber.trim() || undefined);

    if (success) {
      setGuestName('');
      setPhoneNumber('');
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Users className="w-12 h-12 text-blush-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
          {t('guestForm.title')}
        </h2>
        <p className="text-charcoal/70">
          {t('guestForm.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guestName" className="text-charcoal font-medium">
            {t('guestForm.guestName')}
          </Label>
          <Input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
            placeholder={t('guestForm.guestNamePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-charcoal font-medium">
            {t('guestForm.phoneNumber')}
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 w-4 h-4" />
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pl-10"
              placeholder={t('guestForm.phoneNumberPlaceholder')}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal mr-2"></div>
                {t('guestForm.adding')}
              </div>
            ) : (
              t('guestForm.addGuest')
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-blush-200 text-charcoal hover:bg-blush-50 py-3 rounded-full transition-all duration-300"
            >
              {t('guestForm.cancel')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestForm;
