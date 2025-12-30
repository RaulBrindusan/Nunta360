
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [isFamily, setIsFamily] = useState(false);
  const [familySize, setFamilySize] = useState(2);
  const [status, setStatus] = useState<'in_asteptare' | 'confirmat' | 'refuzat'>('in_asteptare');
  const [menuPreference, setMenuPreference] = useState<'normal' | 'vegetarian' | 'vegan' | 'fara_gluten' | 'alte_alergii'>('normal');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Update family members array when family size changes
  useEffect(() => {
    if (isFamily) {
      setFamilyMembers(prev => {
        const newFamilyMembers = Array(familySize).fill('').map((_, index) => 
          prev[index] || ''
        );
        return newFamilyMembers;
      });
    } else {
      setFamilyMembers([]);
    }
  }, [familySize, isFamily]);

  const handleFamilyMemberChange = (index: number, value: string) => {
    const newFamilyMembers = [...familyMembers];
    newFamilyMembers[index] = value;
    setFamilyMembers(newFamilyMembers);
  };

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
    const success = await addGuest(
      guestName.trim(), 
      phoneNumber.trim() || undefined,
      isFamily,
      isFamily ? familySize : 1,
      status,
      menuPreference,
      isFamily ? familyMembers.filter(name => name.trim() !== '') : undefined
    );

    if (success) {
      setGuestName('');
      setPhoneNumber('');
      setIsFamily(false);
      setFamilySize(2);
      setStatus('in_asteptare');
      setMenuPreference('normal');
      setFamilyMembers([]);
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

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFamily"
              checked={isFamily}
              onCheckedChange={(checked) => {
                const isFamilyChecked = checked as boolean;
                setIsFamily(isFamilyChecked);
                // When checking family, ensure minimum size is 2, when unchecking set to 1
                if (isFamilyChecked && familySize < 2) {
                  setFamilySize(2);
                } else if (!isFamilyChecked) {
                  setFamilySize(1);
                }
              }}
              className="border-blush-200 text-blush-400 focus:ring-blush-400/20"
            />
            <Label htmlFor="isFamily" className="text-charcoal font-medium">
              {t('guestForm.isFamily')}
            </Label>
          </div>

          {isFamily && (
            <div className="space-y-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="familySize" className="text-charcoal font-medium">
                  {t('guestForm.familySize')}
                </Label>
                <Input
                  id="familySize"
                  type="number"
                  min="1"
                  max="20"
                  value={familySize}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value) || 1;
                    setFamilySize(Math.max(1, Math.min(20, newSize)));
                  }}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 w-32"
                  placeholder="2"
                />
              </div>
              
              {familySize > 0 && (
                <div className="space-y-3">
                  <Label className="text-charcoal font-medium">
                    Numele membrilor familiei
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array.from({ length: familySize }, (_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-charcoal/70 w-8">
                          {index + 1}.
                        </span>
                        <Input
                          type="text"
                          value={familyMembers[index] || ''}
                          onChange={(e) => handleFamilyMemberChange(index, e.target.value)}
                          className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                          placeholder={`Numele persoanei ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/50 italic">
                    Opțional: Puteți lăsa câmpurile goale dacă nu cunoașteți încă numele
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-charcoal font-medium">
              {t('guestForm.status')}
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_asteptare">{t('guest.status.in_asteptare')}</SelectItem>
                <SelectItem value="confirmat">{t('guest.status.confirmat')}</SelectItem>
                <SelectItem value="refuzat">{t('guest.status.refuzat')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="menuPreference" className="text-charcoal font-medium">
              {t('guestForm.menuPreference')}
            </Label>
            <Select value={menuPreference} onValueChange={setMenuPreference}>
              <SelectTrigger className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('menu.normal')}</SelectItem>
                <SelectItem value="vegetarian">{t('menu.vegetarian')}</SelectItem>
                <SelectItem value="vegan">{t('menu.vegan')}</SelectItem>
                <SelectItem value="fara_gluten">{t('menu.fara_gluten')}</SelectItem>
                <SelectItem value="alte_alergii">{t('menu.alte_alergii')}</SelectItem>
              </SelectContent>
            </Select>
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
