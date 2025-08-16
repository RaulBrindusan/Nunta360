<<<<<<< HEAD
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Clock,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const { t } = useLanguage();

  const upcomingTasks = [
    { id: 1, title: 'Contact Photographer', due: '2024-06-15', status: 'pending' },
    { id: 2, title: 'Venue Visit', due: '2024-06-20', status: 'pending' },
    { id: 3, title: 'Menu Tasting', due: '2024-07-01', status: 'completed' },
  ];

  const stats = [
    { title: t('dashboard.daysLeft'), value: '245', icon: Clock },
    { title: t('dashboard.guestList'), value: '120/150', icon: Users },
    { title: t('dashboard.budgetUsed'), value: '€15,000', icon: CreditCard },
    { title: t('dashboard.tasksDone'), value: '24/36', icon: CheckCircle },
  ];

  return (
    <DashboardLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-blush-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-charcoal/70">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-blush-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Planning Progress and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-blush-100">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-charcoal">{t('dashboard.planningProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: t('dashboard.venue'), progress: 80 },
                { label: t('dashboard.decorations'), progress: 60 },
                { label: t('dashboard.guestList'), progress: 90 },
                { label: t('dashboard.music'), progress: 40 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/70">{item.label}</span>
                    <span className="text-charcoal font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="bg-blush-100" indicatorClassName="bg-blush-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-blush-100">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-charcoal">{t('dashboard.upcomingTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-400' : 'bg-blush-400'
                      }`}
                    />
                    <span className="text-charcoal">{task.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-charcoal/70">{task.due}</span>
                    <ChevronRight size={16} className="text-charcoal/40" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 
=======

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';
import { useGuests } from '@/hooks/useGuests';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Calendar, Plus, Crown, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import WelcomePopup from '@/components/WelcomePopup';
import GuestFormPopup from '@/components/GuestFormPopup';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { weddingDetails, loading: weddingLoading } = useWeddingDetails();
  const { guests, loading: guestsLoading } = useGuests();
  const { role, loading: roleLoading } = useUserRole();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Show welcome popup for first-time users (those without wedding details)
  useEffect(() => {
    if (!weddingLoading && user && !weddingDetails) {
      setShowWelcomePopup(true);
    }
  }, [weddingLoading, user, weddingDetails]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (weddingLoading || guestsLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blush-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blush-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blush-400 mr-3" />
              <h1 className="text-2xl font-serif font-bold text-charcoal">
                Nunta<span className="text-blush-400">360</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Role Badge */}
              {role && (
                <Badge 
                  variant={role === 'admin' ? 'default' : 'secondary'}
                  className={role === 'admin' ? 'bg-gold text-charcoal' : 'bg-sage-200 text-charcoal'}
                >
                  {role === 'admin' ? <Crown className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                  {role}
                </Badge>
              )}
              
              {/* User Info */}
              <div className="text-sm text-charcoal/70">
                {user?.email}
              </div>
              
              {/* Sign Out Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-blush-200 text-charcoal hover:bg-blush-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('dashboard.signOut')}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-serif font-bold text-charcoal">
            {t('dashboard.welcome')}, {user?.user_metadata?.first_name || t('dashboard.user')}!
          </h2>
          <p className="text-charcoal/70 mt-2">
            {t('dashboard.welcomeSubtitle')}
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wedding Details Card */}
          <Card className="bg-white border-blush-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-serif font-medium text-charcoal">
                {t('dashboard.weddingDetails')}
              </CardTitle>
              <Heart className="w-5 h-5 text-blush-400" />
            </CardHeader>
            <CardContent className="pt-4">
              {weddingDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-charcoal/70 w-24">Mireasă:</span>
                    <span className="text-charcoal">{weddingDetails.bride_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-charcoal/70 w-24">Mire:</span>
                    <span className="text-charcoal">{weddingDetails.groom_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-charcoal/70 w-24">Data:</span>
                    <span className="text-charcoal">
                      {weddingDetails.wedding_date ? new Date(weddingDetails.wedding_date).toLocaleDateString('ro-RO') : 'Nu este stabilită'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-charcoal/70 mb-3">{t('dashboard.noWeddingDetails')}</p>
                  <Button
                    onClick={() => setShowWelcomePopup(true)}
                    className="bg-blush-300 hover:bg-blush-400 text-charcoal"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> {t('dashboard.addDetails')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Guest Count Card */}
          <Card className="bg-white border-blush-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-serif font-medium text-charcoal">
                {t('dashboard.guests')}
              </CardTitle>
              <Users className="w-5 h-5 text-blush-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-charcoal">
                  {guests.length}
                </div>
                <p className="text-charcoal/70 mt-2">{t('dashboard.totalGuests')}</p>
                <Button 
                  onClick={() => setShowGuestForm(true)}
                  className="mt-4 bg-blush-300 hover:bg-blush-400 text-charcoal" 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> {t('dashboard.addGuest')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Days Remaining Card */}
          <Card className="bg-white border-blush-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-serif font-medium text-charcoal">
                {t('dashboard.countdown')}
              </CardTitle>
              <Calendar className="w-5 h-5 text-blush-400" />
            </CardHeader>
            <CardContent className="pt-4">
              {weddingDetails?.wedding_date ? (
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-charcoal">
                    {Math.max(0, Math.ceil((new Date(weddingDetails.wedding_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </div>
                  <p className="text-charcoal/70 mt-2">{t('dashboard.daysRemaining')}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-charcoal/70">{t('dashboard.noWeddingDate')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Welcome Popup */}
      <WelcomePopup 
        open={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)}
      />

      {/* Guest Form Popup */}
      <GuestFormPopup 
        open={showGuestForm} 
        onClose={() => setShowGuestForm(false)}
      />
    </div>
  );
};

export default Dashboard;
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
