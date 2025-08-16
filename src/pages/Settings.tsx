import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Menu,
  Bell,
  Settings as SettingsIcon,
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const [formData, setFormData] = React.useState({
    brideFirstName: 'Maria',
    brideLastName: 'Popescu',
    groomFirstName: 'Alexandru',
    groomLastName: 'Ionescu',
    weddingDate: '2024-08-15',
    email: 'maria.popescu@example.com',
    phone: '+40 722 123 456',
    notifications: {
      email: true,
      push: true,
      reminders: true,
    },
  });

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

  return (
    <div className="min-h-screen bg-ivory flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-blush-100 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="text-charcoal/70 hover:text-blush-400"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Nunta<span className="text-blush-400">360</span>
          </h1>
          <Button variant="ghost" size="sm" className="text-charcoal/70 hover:text-blush-400">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-blush-100 p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="font-medium text-2xl text-charcoal mb-1">Maria & Alexandru</p>
            <p className="text-charcoal/70">{t('dashboard.weddingDate')}: 15.08.2024</p>
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-4 lg:p-6 bg-gradient-to-br from-ivory via-blush-50/20 to-sage-50/20">
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
                  <Label htmlFor="brideFirstName">Prenume Mireasă</Label>
                  <Input
                    id="brideFirstName"
                    name="brideFirstName"
                    value={formData.brideFirstName}
                    onChange={handleInputChange}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brideLastName">Nume Mireasă</Label>
                  <Input
                    id="brideLastName"
                    name="brideLastName"
                    value={formData.brideLastName}
                    onChange={handleInputChange}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomFirstName">Prenume Mire</Label>
                  <Input
                    id="groomFirstName"
                    name="groomFirstName"
                    value={formData.groomFirstName}
                    onChange={handleInputChange}
                    className="border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomLastName">Nume Mire</Label>
                  <Input
                    id="groomLastName"
                    name="groomLastName"
                    value={formData.groomLastName}
                    onChange={handleInputChange}
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
        </main>
      </div>
    </div>
  );
};

export default Settings; 