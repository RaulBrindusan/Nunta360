import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Users, Search, Plus, Check, X as XIcon, Menu, Bell } from 'lucide-react';

const Guests = () => {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const guestStats = {
    total: 150,
    confirmed: 85,
    pending: 45,
    declined: 20
  };

  const guestList = [
    { id: 1, name: 'Ana & Mihai Popescu', status: 'confirmed', type: 'family', plusOne: true },
    { id: 2, name: 'Elena & George Ionescu', status: 'pending', type: 'friends', plusOne: true },
    { id: 3, name: 'Maria Dumitrescu', status: 'declined', type: 'work', plusOne: false },
    { id: 4, name: 'Ioan & Laura Popa', status: 'confirmed', type: 'family', plusOne: true },
    { id: 5, name: 'Alexandru Munteanu', status: 'pending', type: 'friends', plusOne: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'declined':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
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

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 bg-gradient-to-br from-ivory via-blush-50/20 to-sage-50/20">
          {/* Guest Stats */}
          <Card className="border-blush-100 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <Users className="h-5 w-5 text-blush-400" />
                Statistici Invitați
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-charcoal">{guestStats.total}</div>
                  <div className="text-sm text-charcoal/70">Total Invitați</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{guestStats.confirmed}</div>
                  <div className="text-sm text-charcoal/70">Confirmați</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{guestStats.pending}</div>
                  <div className="text-sm text-charcoal/70">În Așteptare</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{guestStats.declined}</div>
                  <div className="text-sm text-charcoal/70">Refuzați</div>
                </div>
              </div>
              <Progress 
                value={(guestStats.confirmed / guestStats.total) * 100} 
                className="mt-4 bg-blush-100" 
                indicatorClassName="bg-blush-400" 
              />
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card className="border-blush-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-charcoal">Lista Invitaților</CardTitle>
              <Button className="bg-blush-400 hover:bg-blush-500">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Invitat
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40" />
                  <Input
                    placeholder="Caută invitați..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {guestList.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(guest.status)}`} />
                      <div>
                        <div className="font-medium text-charcoal">{guest.name}</div>
                        <div className="text-sm text-charcoal/70 flex items-center gap-2">
                          {guest.type}
                          {guest.plusOne && (
                            <span className="flex items-center text-blush-400">
                              <Plus className="h-3 w-3 mr-1" />1
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Guests; 