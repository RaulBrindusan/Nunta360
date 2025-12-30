'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Calendar,
  Globe,
  Bell as BellIcon,
  Lock,
  LogOut,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { weddingDetails, loading, saveWeddingDetails } = useWeddingDetails();
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    email: '',
    phone: '',
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
  });

  // Update form data when wedding details or user loads
  React.useEffect(() => {
    if (weddingDetails || user) {
      // Convert Timestamp to date string for input
      const dateString = weddingDetails?.weddingDate
        ? weddingDetails.weddingDate.toDate().toISOString().split('T')[0]
        : '';

      setFormData(prev => ({
        ...prev,
        brideName: weddingDetails?.brideName || '',
        groomName: weddingDetails?.groomName || '',
        weddingDate: dateString,
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
      }));
    }
  }, [weddingDetails, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationToggle = (type: keyof typeof formData.notifications) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save wedding details
      if (formData.brideName && formData.groomName) {
        await saveWeddingDetails({
          brideName: formData.brideName,
          groomName: formData.groomName,
          weddingDate: formData.weddingDate || undefined,
        });
      }

      // Note: Email and phone updates would need to be handled through Supabase auth
      // which is beyond the scope of wedding details
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
          {loading && (
            <div className="text-center py-8">
              <p className="text-charcoal/70">Se încarcă informațiile...</p>
            </div>
          )}
          {/* Profile Settings */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <User className="h-5 w-5 text-blush-400" />
                Informații Personale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Mireasă</Label>
                  <Input
                    id="brideName"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    placeholder="Nume complet mireasă"
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Mire</Label>
                  <Input
                    id="groomName"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    placeholder="Nume complet mire"
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wedding Details */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blush-400" />
                Detalii Nuntă
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Data Nunții</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <Globe className="h-5 w-5 text-blush-400" />
                Informații Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-blush-400" />
                Notificări
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificări Email</Label>
                  <p className="text-sm text-charcoal/70">Primește actualizări pe email</p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={() => handleNotificationToggle('email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificări Push</Label>
                  <p className="text-sm text-charcoal/70">Primește notificări în browser</p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={() => handleNotificationToggle('push')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Memento-uri</Label>
                  <p className="text-sm text-charcoal/70">Primește memento-uri pentru sarcini importante</p>
                </div>
                <Switch
                  checked={formData.notifications.reminders}
                  onCheckedChange={() => handleNotificationToggle('reminders')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <Globe className="h-5 w-5 text-blush-400" />
                Limbă
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={language === 'ro' ? 'default' : 'outline'}
                  onClick={() => setLanguage('ro')}
                  className={language === 'ro' ? 'bg-blush-400 hover:bg-blush-500' : ''}
                >
                  Română
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-blush-400 hover:bg-blush-500' : ''}
                >
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mb-6">
            <Button 
              onClick={handleSave}
              disabled={isSaving || loading}
              className="w-full bg-blush-400 hover:bg-blush-500 text-white"
            >
              {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
            </Button>
          </div>

          {/* Account Actions */}
          <Card className="border-blush-100">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <Lock className="h-5 w-5 text-blush-400" />
                Cont
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-charcoal hover:text-blush-400">
                <Lock className="h-4 w-4 mr-2" />
                Schimbă Parola
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Deconectare
              </Button>
            </CardContent>
          </Card>
    </DashboardLayout>
  );
};

export default Settings; 