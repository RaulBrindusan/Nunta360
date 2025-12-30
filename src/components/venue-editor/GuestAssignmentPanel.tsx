'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VenueObject } from './types';
import { useTableGuests, TableGuestWithActions } from '@/hooks/useTableGuests';
import { Users, Plus, X, Edit2, Check, Loader2, FileText, Settings, Eye, UserPlus } from 'lucide-react';
import TableSeatingDisplay from './TableSeatingDisplay';
import { useGuests, Guest } from '@/hooks/useGuests';

interface GuestAssignmentPanelProps {
  selectedObject: VenueObject | undefined;
  objects: VenueObject[];
}

const GuestAssignmentPanel: React.FC<GuestAssignmentPanelProps> = ({
  selectedObject,
  objects,
}) => {
  const {
    tableGuests,
    loading: tableGuestsLoading,
    error,
    getGuestsForTable,
    addGuestToTable,
    updateGuest,
    deleteGuest,
    toggleEditMode,
    cancelEdit,
    getGuestCountForTable,
  } = useTableGuests();

  // Fetch main guests list for selection
  const { guests, loading: guestsLoading } = useGuests();

  const [editingName, setEditingName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);


  // Start editing a guest
  const handleStartEdit = (guest: TableGuestWithActions) => {
    setEditingName(guest.name);
    toggleEditMode(guest.id);
  };

  // Save guest edit
  const handleSaveEdit = async (guestId: string) => {
    if (!editingName.trim()) {
      cancelEdit(guestId);
      return;
    }

    const success = await updateGuest(guestId, { name: editingName.trim() });
    if (success) {
      setEditingName('');
    }
  };

  // Cancel guest edit
  const handleCancelEdit = (guestId: string) => {
    cancelEdit(guestId);
    setEditingName('');
  };

  // Add existing guest to table
  const handleAddExistingGuest = async (guest: Guest) => {
    if (!selectedObject) return;
    
    const tableId = selectedObject.id;
    const tableName = selectedObject.properties.label || selectedObject.type;
    const maxSeats = selectedObject.properties.seats || 0;
    const currentCount = getGuestCountForTable(tableId);
    
    if (currentCount >= maxSeats) return;
    
    // Check if guest is already assigned to this table
    const currentGuests = getGuestsForTable(tableId);
    const isAlreadyAssigned = currentGuests.some(tableGuest =>
      tableGuest.guestId === guest.id || tableGuest.name === guest.name
    );
    
    if (isAlreadyAssigned) {
      alert('Acest invitat este deja asignat la această masă!');
      return;
    }
    
    setIsAdding(true);
    const result = await addGuestToTable(guest.name, tableId, tableName, undefined, guest.id);
    
    if (result) {
      setShowGuestSelector(false);
      setSelectedGuest(null);
    }
    setIsAdding(false);
  };

  // Delete guest
  const handleDeleteGuest = async (guestId: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest invitat?')) {
      await deleteGuest(guestId);
    }
  };

  // Get available guests (not already assigned to this table)
  const getAvailableGuests = () => {
    if (!selectedObject) return guests;
    
    const currentGuests = getGuestsForTable(selectedObject.id);
    const assignedGuestIds = currentGuests.map(tg => tg.guestId).filter(Boolean);
    const assignedGuestNames = currentGuests.map(tg => tg.name);
    
    return guests.filter(guest => 
      !assignedGuestIds.includes(guest.id) && 
      !assignedGuestNames.includes(guest.name)
    );
  };

  // Get all tables (main-table and masa)
  const tables = objects.filter(obj => obj.type === 'main-table' || obj.type === 'masa');

  if (tableGuestsLoading) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm h-full lg:h-full">
        <CardHeader className="pb-3 lg:pb-6">
          <CardTitle className="text-lg font-elegant text-charcoal flex items-center gap-2">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blush-400" />
            <span className="text-base lg:text-lg">Atribuire Invitați</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blush-400" />
            <p className="text-charcoal/60 font-elegant">Se încarcă invitații...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedObject || (selectedObject.type !== 'main-table' && selectedObject.type !== 'masa')) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blush-400" />
            <span className="text-base lg:text-lg font-elegant text-charcoal">Atribuire Invitați</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Card className="border-gray-200 bg-white shadow-sm h-full">
            <CardContent className="py-6">
              <div className="text-center py-8">
                <p className="text-charcoal/60 font-elegant">
                  Selectează o masă pentru a gestiona invitații
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentGuests = getGuestsForTable(selectedObject.id);
  const maxSeats = selectedObject.properties.seats || 0;
  const availableSeats = maxSeats - currentGuests.length;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blush-400" />
          <span className="text-base lg:text-lg font-elegant text-charcoal">Atribuire Invitați</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Card className="border-gray-200 bg-white shadow-sm h-full">
          <CardContent className="space-y-4 lg:space-y-6 max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible p-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 font-elegant">{error}</p>
              </div>
            )}

            {/* Table Info */}
            <div>
              <Label className="text-base font-elegant text-charcoal">Masă Selectată</Label>
              <p className="text-sm text-charcoal/70 font-elegant mt-1">
                {selectedObject.properties.label || selectedObject.type}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {currentGuests.length}/{maxSeats} locuri ocupate
                </Badge>
                {availableSeats > 0 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {availableSeats} locuri libere
                  </Badge>
                )}
              </div>
            </div>

            {/* Add Guest */}
            {availableSeats > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-elegant text-charcoal">
                  Adaugă Invitat din Listă
                </Label>
                
                <Dialog open={showGuestSelector} onOpenChange={setShowGuestSelector}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blush-500 hover:bg-blush-600 text-white w-full"
                      disabled={isAdding || guestsLoading || getAvailableGuests().length === 0}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Selectează Invitat ({getAvailableGuests().length} disponibili)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-elegant text-charcoal">
                        Selectează Invitat Existent
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {guestsLoading ? (
                        <div className="text-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2 text-blush-400" />
                          <p className="text-sm text-charcoal/60">Se încarcă invitații...</p>
                        </div>
                      ) : getAvailableGuests().length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-charcoal/60 mb-2">
                            Nu sunt invitați disponibili pentru această masă
                          </p>
                          <p className="text-xs text-charcoal/40">
                            Adaugă mai întâi invitați în secțiunea "Invitați"
                          </p>
                        </div>
                      ) : (
                        getAvailableGuests().map((guest) => (
                          <div
                            key={guest.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-blush-50 cursor-pointer transition-colors"
                            onClick={() => handleAddExistingGuest(guest)}
                          >
                            <div className="flex-1">
                              <p className="font-elegant text-charcoal font-medium">{guest.name}</p>
                              {guest.phoneNumber && (
                                <p className="text-xs text-charcoal/60">{guest.phoneNumber}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                {guest.isFamily && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    Familie ({guest.familySize})
                                  </span>
                                )}
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                  {guest.status}
                                </span>
                              </div>
                            </div>
                            <Plus className="w-5 h-5 text-blush-400" />
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {getAvailableGuests().length === 0 && (
                  <p className="text-sm text-charcoal/60 text-center italic">
                    Pentru a asigna invitați la mese, adaugă mai întâi invitați în secțiunea "Invitați" din meniul principal.
                  </p>
                )}
              </div>
            )}

            {/* Guest List */}
            <div className="space-y-2">
              <Label className="text-base font-elegant text-charcoal">
                Invitați la această masă ({currentGuests.length})
              </Label>
              {currentGuests.length === 0 ? (
                <p className="text-sm text-charcoal/50 font-elegant italic">
                  Niciun invitat nu a fost atribuit încă
                </p>
              ) : (
                <div className="space-y-2">
                  {currentGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between bg-blush-50 border border-blush-200 rounded-lg p-2"
                    >
                      {guest.isEditing ? (
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="border-blush-200 focus:border-blush-400 font-elegant flex-1 mr-2 h-8"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(guest.id);
                              if (e.key === 'Escape') handleCancelEdit(guest.id);
                            }}
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleSaveEdit(guest.id)}
                              size="sm"
                              variant="outline"
                              className="p-1 h-auto text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleCancelEdit(guest.id)}
                              size="sm"
                              variant="outline"
                              className="p-1 h-auto text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-elegant text-charcoal flex-1">
                            {guest.name}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleStartEdit(guest)}
                              size="sm"
                              variant="outline"
                              className="p-1 h-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50 border-blue-200"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteGuest(guest.id)}
                              size="sm"
                              variant="outline"
                              className="p-1 h-auto text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Tables Summary */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <Label className="text-base font-elegant text-charcoal">
                Rezumat Toate Mesele
              </Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {tables.map(table => {
                  const tableGuestCount = getGuestCountForTable(table.id);
                  const tableSeats = table.properties.seats || 0;
                  return (
                    <div key={table.id} className="flex items-center justify-between text-sm">
                      <span className="font-elegant text-charcoal/70 flex-1 truncate">
                        {table.properties.label || table.type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {tableGuestCount}/{tableSeats}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestAssignmentPanel;