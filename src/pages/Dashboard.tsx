
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, Users, MapPin, Camera, DollarSign, CheckCircle, LogOut, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useGuests } from '@/hooks/useGuests';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { guests, loading: guestsLoading } = useGuests();
  const { weddingDetails, loading: weddingLoading } = useWeddingDetails();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const dashboardCards = [
    {
      title: 'Wedding Date',
      description: 'Set your special day',
      icon: Calendar,
      color: 'bg-blush-100 text-blush-600',
      value: weddingLoading ? 'Loading...' : formatDate(weddingDetails?.wedding_date),
    },
    {
      title: 'Guest List',
      description: 'Manage your invitations',
      icon: Users,
      color: 'bg-sage-100 text-sage-600',
      value: guestsLoading ? 'Loading...' : `${guests.length} guests`,
    },
    {
      title: 'Bride & Groom',
      description: 'Wedding couple details',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      value: weddingLoading ? 'Loading...' : 
        (weddingDetails ? `${weddingDetails.bride_name} & ${weddingDetails.groom_name}` : 'Not set'),
    },
    {
      title: 'Venues',
      description: 'Find the perfect location',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600',
      value: 'Explore venues',
    },
    {
      title: 'Photography',
      description: 'Capture every moment',
      icon: Camera,
      color: 'bg-blue-100 text-blue-600',
      value: 'Find photographers',
    },
    {
      title: 'Budget',
      description: 'Track your expenses',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      value: '$0 spent',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50 to-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-blush-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blush-400 mr-3" />
              <h1 className="text-2xl font-serif font-bold text-charcoal">
                Nunta<span className="text-blush-400">360</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {!roleLoading && role === 'admin' && (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                  </div>
                )}
                <span className="text-charcoal/70">
                  Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}!
                </span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-blush-300 text-charcoal hover:bg-blush-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-2">
            Your Wedding Dashboard
          </h2>
          <p className="text-charcoal/70">
            Plan your perfect day with all the tools you need in one place.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="border-blush-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-charcoal/60 group-hover:text-blush-400 transition-colors">
                      View →
                    </span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-charcoal">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-charcoal/60">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-charcoal">
                    {card.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-blush-200">
          <CardHeader>
            <CardTitle className="text-xl font-serif font-bold text-charcoal">
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with these essential wedding planning steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold">
                Set Wedding Details
              </Button>
              <Button variant="outline" className="border-sage-300 text-sage-600 hover:bg-sage-50">
                Add Guests
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                Browse Venues
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                Create Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {guests.length > 0 && (
          <Card className="border-blush-200 mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-serif font-bold text-charcoal">
                Recent Guests
              </CardTitle>
              <CardDescription>
                Your latest guest additions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guests.slice(0, 5).map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-2 bg-blush-50 rounded-lg">
                    <div>
                      <p className="font-medium text-charcoal">{guest.name}</p>
                      {guest.phone_number && (
                        <p className="text-sm text-charcoal/70">{guest.phone_number}</p>
                      )}
                    </div>
                    <span className="text-xs text-charcoal/60">
                      {new Date(guest.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
