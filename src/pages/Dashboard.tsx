
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

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { weddingDetails, loading: weddingLoading } = useWeddingDetails();
  const { guests, loading: guestsLoading } = useGuests();
  const { role, loading: roleLoading } = useUserRole();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

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
                    <span className="font-medium text-sm text-charcoal/70 w-24">Bride:</span>
                    <span className="text-charcoal">{weddingDetails.bride_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-charcoal/70 w-24">Groom:</span>
                    <span className="text-charcoal">{weddingDetails.groom_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-charcoal/70 w-24">Date:</span>
                    <span className="text-charcoal">
                      {weddingDetails.wedding_date ? new Date(weddingDetails.wedding_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-charcoal/70 mb-3">No wedding details yet</p>
                  <Button
                    onClick={() => setShowWelcomePopup(true)}
                    className="bg-blush-300 hover:bg-blush-400 text-charcoal"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Details
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
                <p className="text-charcoal/70 mt-2">Total Guests</p>
                <Button className="mt-4 bg-blush-300 hover:bg-blush-400 text-charcoal" size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Guest
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
                  <p className="text-charcoal/70 mt-2">Days Remaining</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-charcoal/70">No wedding date set</p>
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
    </div>
  );
};

export default Dashboard;
