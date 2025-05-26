
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, Users, MapPin, Camera, DollarSign, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardCards = [
    {
      title: 'Wedding Date',
      description: 'Set your special day',
      icon: Calendar,
      color: 'bg-blush-100 text-blush-600',
      value: 'Not set',
    },
    {
      title: 'Guest List',
      description: 'Manage your invitations',
      icon: Users,
      color: 'bg-sage-100 text-sage-600',
      value: '0 guests',
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
    {
      title: 'Tasks',
      description: 'Stay organized',
      icon: CheckCircle,
      color: 'bg-orange-100 text-orange-600',
      value: '0 completed',
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
              <span className="text-charcoal/70">
                Welcome, {user?.user_metadata?.first_name || user?.email}!
              </span>
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
                Set Wedding Date
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
      </main>
    </div>
  );
};

export default Dashboard;
