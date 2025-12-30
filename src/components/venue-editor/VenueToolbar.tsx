'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VenueObject } from './types';
import TableSeatingDisplay from './TableSeatingDisplay';
import {
  Table,
  Flower,
  Music,
  Wine,
  Plus,
  Crown,
  Eye,
} from 'lucide-react';

interface VenueToolbarProps {
  onAddObject: (type: VenueObject['type']) => void;
  activeTab: 'dispunere' | 'invitati';
  onTabChange: (tab: 'dispunere' | 'invitati') => void;
  objects: VenueObject[];
}

const objectTemplates = [
  {
    type: 'main-table' as const,
    name: 'Masa Principală',
    icon: Crown,
    description: 'Adaugă masa pentru miri',
  },
  {
    type: 'masa' as const,
    name: 'Masă Invitați',
    icon: Table,
    description: 'Adaugă o masă pentru invitați',
  },
  {
    type: 'dance-floor' as const,
    name: 'Ring de Dans',
    icon: Plus,
    description: 'Adaugă ringul de dans',
  },
  {
    type: 'stage' as const,
    name: 'Scenă',
    icon: Music,
    description: 'Adaugă scena pentru muzică',
  },
  {
    type: 'bar' as const,
    name: 'Bar',
    icon: Wine,
    description: 'Adaugă un bar pentru băuturi',
  },
  {
    type: 'decoration' as const,
    name: 'Decorațiune',
    icon: Flower,
    description: 'Adaugă decorațiuni florale',
  },
];

const VenueToolbar: React.FC<VenueToolbarProps> = ({ onAddObject, activeTab, onTabChange, objects }) => {
  return (
    <div className="space-y-4 lg:space-y-4">
      {/* Tab Navigation */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={activeTab === 'dispunere' ? 'default' : 'outline'}
              onClick={() => onTabChange('dispunere')}
              className={`text-sm font-elegant ${
                activeTab === 'dispunere' 
                  ? 'bg-blush-500 hover:bg-blush-600 text-white' 
                  : 'border-blush-200 hover:bg-blush-50'
              }`}
            >
              Dispunere
            </Button>
            <Button
              variant={activeTab === 'invitati' ? 'default' : 'outline'}
              onClick={() => onTabChange('invitati')}
              className={`text-sm font-elegant ${
                activeTab === 'invitati' 
                  ? 'bg-blush-500 hover:bg-blush-600 text-white' 
                  : 'border-blush-200 hover:bg-blush-50'
              }`}
            >
              Invitați
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vezi Aranjament Button - Only show in Invitați tab */}
      {activeTab === 'invitati' && (
        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="border-blush-300 text-blush-600 hover:bg-blush-50 font-elegant"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vezi Aranjament
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-elegant text-charcoal">Aranjament Mese</DialogTitle>
              </DialogHeader>
              <TableSeatingDisplay objects={objects} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Objects Library - Only show in Dispunere tab */}
      {activeTab === 'dispunere' && (
        <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-elegant text-charcoal">
            Biblioteca de Obiecte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Mobile: Horizontal scroll grid, Desktop: Vertical stack */}
          <div className="lg:space-y-2 lg:block">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-2 lg:space-y-0 overflow-x-auto">
              {objectTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Button
                    key={template.type}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 border-blush-200 hover:bg-blush-50 hover:border-blush-300 lg:w-full"
                    onClick={() => onAddObject(template.type)}
                  >
                    <div className="flex items-center gap-2 lg:gap-3 w-full">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5 text-blush-400" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-charcoal font-elegant text-sm lg:text-base truncate">
                          {template.name}
                        </div>
                        <div className="text-xs text-charcoal/60 font-elegant hidden lg:block">
                          {template.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
        </Card>
      )}

    </div>
  );
};

export default VenueToolbar;