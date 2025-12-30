'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Users, Utensils, CheckCircle, Clock, XCircle, Edit2, Save, X, Trash2 } from 'lucide-react';
import { Guest } from '@/hooks/useGuests';

interface GuestDetailsModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (guestId: string, updates: Partial<Guest>) => Promise<boolean>;
  onDelete: (guestId: string) => Promise<boolean>;
}

const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({
  guest,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Guest>>({});
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        phone_number: guest.phoneNumber || '',
        is_family: guest.isFamily,
        family_size: guest.familySize,
        status: guest.status,
        menu_preference: guest.menuPreference,
      });
      setFamilyMembers(guest.familyMembers || []);
    }
    setIsEditing(false);
  }, [guest]);

  // Update family members array when family size changes
  useEffect(() => {
    if (formData.is_family && formData.family_size) {
      setFamilyMembers(prev => {
        const newFamilyMembers = Array(formData.family_size || 1).fill('').map((_, index) =>
          prev[index] || ''
        );
        return newFamilyMembers;
      });
    } else if (!formData.is_family) {
      setFamilyMembers([]);
    }
  }, [formData.family_size, formData.is_family]);

  const handleFamilyMemberChange = (index: number, value: string) => {
    const newFamilyMembers = [...familyMembers];
    newFamilyMembers[index] = value;
    setFamilyMembers(newFamilyMembers);
  };

  if (!guest) return null;

  const handleSave = async () => {
    if (!guest.id) return;

    setIsSaving(true);
    try {
      const updates: Partial<Guest> = {
        name: formData.name?.trim() || guest.name,
        phoneNumber: formData.phone_number?.trim() || null,
        isFamily: formData.is_family ?? guest.isFamily,
        familySize: formData.family_size ?? guest.familySize,
        status: formData.status || guest.status,
        menuPreference: formData.menu_preference || guest.menuPreference,
        familyMembers: formData.is_family ? familyMembers.filter(name => name.trim() !== '') : [],
      };

      const success = await onUpdate(guest.id, updates);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating guest:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!guest.id) return;

    if (window.confirm(`Ești sigur că vrei să ștergi invitatul "${guest.name}"? Această acțiune nu poate fi anulată.`)) {
      setIsDeleting(true);
      try {
        const success = await onDelete(guest.id);
        if (success) {
          onClose();
        }
      } catch (error) {
        console.error('Error deleting guest:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: guest.name,
      phone_number: guest.phoneNumber || '',
      is_family: guest.isFamily,
      family_size: guest.familySize,
      status: guest.status,
      menu_preference: guest.menuPreference,
    });
    setFamilyMembers(guest.familyMembers || []);
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmat':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_asteptare':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'refuzat':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmat':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_asteptare':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refuzat':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-blush-100 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className={isEditing ? "sr-only" : ""}>
          <DialogTitle className="flex items-center justify-between font-elegant text-charcoal">
            <div className="flex items-center gap-2 mt-4">
              <User className="w-5 h-5 text-blush-400" />
              Detalii Invitat
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editează
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? 'Se șterge...' : 'Șterge'}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-blush-400" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
                Editează Invitat
              </h2>
              <p className="text-charcoal/70">
                Modifică detaliile invitatului
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-charcoal font-medium">
                  Nume complet
                </Label>
                <Input
                  id="guestName"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  placeholder="Numele complet al invitatului"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-charcoal font-medium">
                  Telefon
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/50 w-4 h-4" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 pl-10"
                    placeholder="Numărul de telefon"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFamily"
                    checked={formData.is_family ?? false}
                    onCheckedChange={(checked) => {
                      const isFamilyChecked = checked as boolean;
                      setFormData({
                        ...formData,
                        is_family: isFamilyChecked,
                        family_size: isFamilyChecked ? Math.max(formData.family_size || 2, 2) : 1
                      });
                    }}
                    className="border-blush-200 text-blush-400 focus:ring-blush-400/20"
                  />
                  <Label htmlFor="isFamily" className="text-charcoal font-medium">
                    Vine cu familia
                  </Label>
                </div>

                {formData.is_family && (
                  <div className="space-y-4 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="familySize" className="text-charcoal font-medium">
                        Mărimea familiei
                      </Label>
                      <Input
                        id="familySize"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.family_size || 2}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value) || 1;
                          setFormData({
                            ...formData,
                            family_size: Math.max(1, Math.min(20, newSize))
                          });
                        }}
                        className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20 w-32"
                        placeholder="2"
                      />
                    </div>

                    {(formData.family_size || 0) > 0 && (
                      <div className="space-y-3">
                        <Label className="text-charcoal font-medium">
                          Numele membrilor familiei
                        </Label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Array.from({ length: formData.family_size || 1 }, (_, index) => (
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
                    Status
                  </Label>
                  <Select
                    value={formData.status || guest.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20">
                      <SelectValue placeholder="Selectează statusul" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_asteptare">În așteptare</SelectItem>
                      <SelectItem value="confirmat">Confirmat</SelectItem>
                      <SelectItem value="refuzat">Refuzat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menuPreference" className="text-charcoal font-medium">
                    Preferințe meniu
                  </Label>
                  <Select
                    value={formData.menu_preference || guest.menuPreference}
                    onValueChange={(value) => setFormData({ ...formData, menu_preference: value })}
                  >
                    <SelectTrigger className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20">
                      <SelectValue placeholder="Selectează tipul de meniu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="fara_gluten">Fără gluten</SelectItem>
                      <SelectItem value="alte_alergii">Alte alergii</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal mr-2"></div>
                      Se salvează...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvează
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 border-blush-200 text-charcoal hover:bg-blush-50 py-3 rounded-full transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anulează
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-elegant text-charcoal border-b border-gray-200 pb-2">
                Informații de bază
              </h3>

              {/* Name */}
              <div className="space-y-2">
                <Label className="text-sm font-elegant text-charcoal/60">
                  Nume complet
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="w-4 h-4 text-charcoal/60" />
                  <span className="font-elegant text-charcoal">{guest.name}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-sm font-elegant text-charcoal/60">
                  Telefon
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="w-4 h-4 text-charcoal/60" />
                  <span className="font-elegant text-charcoal">
                    {guest.phoneNumber || 'Nu este specificat'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-elegant text-charcoal/60">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(guest.status)}
                  <Badge className={`${getStatusColor(guest.status)} font-elegant`}>
                    {guest.status === 'in_asteptare' && 'În așteptare'}
                    {guest.status === 'confirmat' && 'Confirmat'}
                    {guest.status === 'refuzat' && 'Refuzat'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Family Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-elegant text-charcoal border-b border-gray-200 pb-2">
                Informații familie
              </h3>

              {/* Is Family */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Label className="text-sm font-elegant text-charcoal/60">
                  Este familie
                </Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-charcoal/60" />
                  <span className="text-sm font-elegant text-charcoal font-medium">
                    {guest.isFamily ? 'Da' : 'Nu'}
                  </span>
                </div>
              </div>

              {/* Family Size */}
              {guest.isFamily && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-elegant text-charcoal/60">
                      Mărimea familiei
                    </Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Users className="w-4 h-4 text-charcoal/60" />
                      <span className="font-elegant text-charcoal">{guest.familySize} persoane</span>
                    </div>
                  </div>

                  {/* Family Members */}
                  {guest.familyMembers && guest.familyMembers.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-elegant text-charcoal/60">
                        Membri familie
                      </Label>
                      <div className="space-y-2">
                        {guest.familyMembers.map((member, index) => (
                          member && (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="text-sm text-charcoal/70 w-6">
                                {index + 1}.
                              </span>
                              <span className="font-elegant text-charcoal">{member}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Menu Preference */}
            <div className="space-y-4">
              <h3 className="text-lg font-elegant text-charcoal border-b border-gray-200 pb-2">
                Preferințe meniu
              </h3>

              <div className="space-y-2">
                <Label className="text-sm font-elegant text-charcoal/60">
                  Tip meniu
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Utensils className="w-4 h-4 text-charcoal/60" />
                  <span className="font-elegant text-charcoal capitalize">
                    {guest.menuPreference?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-elegant text-charcoal border-b border-gray-200 pb-2">
                Istoric
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <Label className="text-charcoal/60">Adăugat la:</Label>
                  <p className="font-elegant text-charcoal">
                    {new Date(guest.created_at).toLocaleDateString('ro-RO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-charcoal/60">Ultima modificare:</Label>
                  <p className="font-elegant text-charcoal">
                    {new Date(guest.updated_at).toLocaleDateString('ro-RO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GuestDetailsModal;
