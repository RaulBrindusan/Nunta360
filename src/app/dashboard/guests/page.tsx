'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGuests, Guest } from '@/hooks/useGuests';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GuestFormPopup from '@/components/GuestFormPopup';
import GuestDetailsModal from '@/components/modals/GuestDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, Phone } from 'lucide-react';

const Guests = () => {
  const { t } = useLanguage();
  const { guests, loading, updateGuest, deleteGuest } = useGuests();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showGuestForm, setShowGuestForm] = React.useState(false);
  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null);
  const [showGuestDetails, setShowGuestDetails] = React.useState(false);

  // Calculate guest statistics
  const guestStats = React.useMemo(() => {
    const totalGuests = guests.reduce((sum, guest) => sum + (guest.familySize || 0), 0);
    const confirmed = guests.filter(guest => guest.status === 'confirmat').reduce((sum, guest) => sum + (guest.familySize || 0), 0);
    const pending = guests.filter(guest => guest.status === 'in_asteptare').reduce((sum, guest) => sum + (guest.familySize || 0), 0);
    const declined = guests.filter(guest => guest.status === 'refuzat').reduce((sum, guest) => sum + (guest.familySize || 0), 0);

    return {
      total: totalGuests,
      confirmed,
      pending,
      declined,
      families: guests.filter(guest => guest.isFamily).length,
      individuals: guests.filter(guest => !guest.isFamily).length,
      totalEntries: guests.length
    };
  }, [guests]);

  // Filter guests based on search query
  const filteredGuests = React.useMemo(() => {
    if (!searchQuery.trim()) return guests;
    return guests.filter(guest =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [guests, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmat':
        return 'bg-green-400';
      case 'in_asteptare':
        return 'bg-yellow-400';
      case 'refuzat':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    return t(`guest.status.${status}`);
  };

  const getMenuText = (menuPreference: string) => {
    return t(`menu.${menuPreference}`);
  };

  const handleGuestClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestDetails(true);
  };

  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setSelectedGuest(null);
  };

  const headerSearchBar = (
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40" />
      <Input
        placeholder="Caută invitați..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 border-blush-200 focus:border-blush-400 focus:ring-blush-400/20"
      />
    </div>
  );

  return (
    <DashboardLayout headerLeft={headerSearchBar}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Guest Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blush-100">
              <CardContent className="text-center py-6">
                <div className="text-3xl font-bold text-charcoal">{guestStats.total}</div>
                <div className="text-sm text-charcoal/70 mt-1">Total Persoane</div>
              </CardContent>
            </Card>

            <Card className="border-blush-100">
              <CardContent className="text-center py-6">
                <div className="text-3xl font-bold text-green-600">{guestStats.confirmed}</div>
                <div className="text-sm text-charcoal/70 mt-1">Confirmați</div>
              </CardContent>
            </Card>

            <Card className="border-blush-100">
              <CardContent className="text-center py-6">
                <div className="text-3xl font-bold text-yellow-600">{guestStats.pending}</div>
                <div className="text-sm text-charcoal/70 mt-1">În așteptare</div>
              </CardContent>
            </Card>

            <Card className="border-blush-100">
              <CardContent className="text-center py-6">
                <div className="text-3xl font-bold text-red-600">{guestStats.declined}</div>
                <div className="text-sm text-charcoal/70 mt-1">Refuzați</div>
              </CardContent>
            </Card>
          </div>

          {/* Guest List */}
          <Card className="border-blush-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-charcoal">Lista Invitaților</CardTitle>
              <Button
                className="bg-blush-400 hover:bg-blush-500"
                onClick={() => setShowGuestForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Invitat
              </Button>
            </CardHeader>
            <CardContent>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-charcoal/70">Se încarcă invitații...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-charcoal/70">
                    {searchQuery ? 'Nu au fost găsiți invitați cu acest nume' : 'Nu aveți încă invitați adăugați'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="flex items-center p-4 bg-blush-100/50 rounded-lg border border-blush-200">
                    {/* Status Indicator Space */}
                    <div className="flex items-center pr-3">
                      <div className="w-3 h-3" />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-bold text-charcoal text-sm">Nume</div>
                    </div>

                    {/* Vertical Separator */}
                    <div className="h-6 w-px bg-blush-300 mx-2" />

                    {/* Phone */}
                    <div className="flex items-center gap-1 min-w-[140px] pr-4">
                      <div className="font-bold text-charcoal text-sm">Telefon</div>
                    </div>

                    {/* Family Info */}
                    <div className="flex items-center gap-1 min-w-[140px] pr-4">
                      <div className="font-bold text-charcoal text-sm">Familie</div>
                    </div>

                    {/* Vertical Separator */}
                    <div className="h-6 w-px bg-blush-300 mx-2" />

                    {/* Status */}
                    <div className="min-w-[100px] pr-4">
                      <div className="font-bold text-charcoal text-sm">Status</div>
                    </div>

                    {/* Menu Preference */}
                    <div className="min-w-[100px] pr-4">
                      <div className="font-bold text-charcoal text-sm">Meniu</div>
                    </div>

                    {/* Arrow space - matches ml-auto positioning */}
                    <div className="text-sm ml-auto opacity-0">→</div>
                  </div>

                  {/* Guest Rows */}
                  {filteredGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center py-3 px-4 bg-ivory rounded-lg hover:bg-blush-50 transition-colors cursor-pointer"
                      onClick={() => handleGuestClick(guest)}
                    >
                      {/* Status Indicator */}
                      <div className="flex items-center pr-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(guest.status)}`} />
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="font-medium text-charcoal truncate">{guest.name}</div>
                      </div>

                      {/* Vertical Separator */}
                      <div className="h-10 w-px bg-blush-200 mx-2" />

                      {/* Phone */}
                      <div className="flex items-center gap-1 min-w-[140px] pr-4">
                        {guest.phoneNumber ? (
                          <>
                            <Phone className="h-3 w-3 text-charcoal/60" />
                            <span className="text-sm text-charcoal/70">{guest.phoneNumber}</span>
                          </>
                        ) : (
                          <span className="text-sm text-charcoal/40 italic">Fără telefon</span>
                        )}
                      </div>

                      {/* Family Info */}
                      <div className="flex items-center gap-1 min-w-[140px] pr-4">
                        {guest.isFamily ? (
                          <>
                            <Users className="h-3 w-3 text-sage-600" />
                            <span className="text-sm text-sage-600 font-medium">
                              {guest.familySize} {guest.familySize === 1 ? 'persoană' : 'persoane'}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-dustyRose-600 font-medium">Individual</span>
                        )}
                      </div>

                      {/* Vertical Separator */}
                      <div className="h-10 w-px bg-blush-200 mx-2" />

                      {/* Status */}
                      <div className="min-w-[100px] pr-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium text-charcoal">
                          {getStatusText(guest.status)}
                        </span>
                      </div>

                      {/* Menu Preference */}
                      <div className="min-w-[100px] pr-4">
                        <span className="text-xs bg-blush-100 px-2 py-1 rounded font-medium text-charcoal">
                          {getMenuText(guest.menuPreference)}
                        </span>
                      </div>

                      {/* Family Members (if available) */}
                      {guest.isFamily && guest.familyMembers && guest.familyMembers.length > 0 && (
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-xs text-charcoal/60 truncate">
                            {guest.familyMembers.filter(name => name.trim()).join(', ')}
                          </div>
                        </div>
                      )}

                      {/* Click indicator */}
                      <div className="text-charcoal/40 text-sm ml-auto">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guest Form Modal */}
      <GuestFormPopup
        open={showGuestForm}
        onClose={() => setShowGuestForm(false)}
      />

      {/* Guest Details Modal */}
      <GuestDetailsModal
        guest={selectedGuest}
        isOpen={showGuestDetails}
        onClose={handleCloseGuestDetails}
        onUpdate={updateGuest}
        onDelete={deleteGuest}
      />
    </DashboardLayout>
  );
};

export default Guests; 