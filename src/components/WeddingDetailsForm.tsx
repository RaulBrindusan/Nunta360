
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Calendar } from 'lucide-react';

interface WeddingDetailsFormProps {
  onSuccess: () => void;
  onSkip?: () => void;
}

const WeddingDetailsForm: React.FC<WeddingDetailsFormProps> = ({ onSuccess, onSkip }) => {
  const { t } = useLanguage();
  const { saveWeddingDetails } = useWeddingDetails();
  const { toast } = useToast();
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brideName.trim() || !groomName.trim()) {
      toast({
        title: t('weddingForm.requiredFieldsMissing'),
        description: t('weddingForm.enterBothNames'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const success = await saveWeddingDetails({
      brideName: brideName.trim(),
      groomName: groomName.trim(),
      weddingDate: weddingDate || undefined,
    });

    if (success) {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Heart className="w-12 h-12 text-blush-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
          {t('weddingForm.welcome')}
        </h2>
        <p className="text-charcoal/70">
          {t('weddingForm.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brideName" className="text-charcoal font-medium">
            {t('weddingForm.brideName')}
          </Label>
          <Input
            id="brideName"
            type="text"
            value={brideName}
            onChange={(e) => setBrideName(e.target.value)}
            className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
            placeholder={t('weddingForm.brideNamePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groomName" className="text-charcoal font-medium">
            {t('weddingForm.groomName')}
          </Label>
          <Input
            id="groomName"
            type="text"
            value={groomName}
            onChange={(e) => setGroomName(e.target.value)}
            className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
            placeholder={t('weddingForm.groomNamePlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weddingDate" className="text-charcoal font-medium">
            {t('weddingForm.weddingDate')}
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 w-4 h-4" />
            <Input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pl-10"
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
                {t('weddingForm.saving')}
              </div>
            ) : (
              t('weddingForm.saveDetails')
            )}
          </Button>
          
          {onSkip && (
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="flex-1 border-blush-200 text-charcoal hover:bg-blush-50 py-3 rounded-full transition-all duration-300"
            >
              {t('weddingForm.skipForNow')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WeddingDetailsForm;
