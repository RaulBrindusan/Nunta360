'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VenueObject } from './types';
import { Trash2, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedObject: VenueObject | undefined;
  onUpdateObject: (id: string, updates: Partial<VenueObject>) => void;
  onDeleteObject: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onUpdateObject,
  onDeleteObject,
}) => {
  if (!selectedObject) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-lg font-elegant text-charcoal flex items-center gap-2">
            <Settings className="w-5 h-5 text-blush-400" />
            Proprietăți
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-charcoal/60 font-elegant">
              Selectează un obiect pentru a edita proprietățile
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateObject(selectedObject.id, {
      properties: {
        ...selectedObject.properties,
        [property]: value,
      },
    });
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateObject(selectedObject.id, { [dimension]: numValue });
    }
  };

  const handleRotationChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdateObject(selectedObject.id, { rotation: numValue });
    }
  };


  return (
    <Card className="border-gray-200 bg-white shadow-sm h-full lg:h-full">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-lg font-elegant text-charcoal flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blush-400" />
            <span className="text-base lg:text-lg">Proprietăți</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteObject(selectedObject.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 lg:p-2"
          >
            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
        {/* Object Info */}
        <div>
          <Label className="text-base font-elegant text-charcoal">Tip Obiect</Label>
          <p className="text-sm text-charcoal/70 font-elegant capitalize mt-1">
            {selectedObject.type.replace('-', ' ')}
          </p>
        </div>

        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label" className="text-base font-elegant text-charcoal">
            Etichetă
          </Label>
          <Input
            id="label"
            value={selectedObject.properties.label || ''}
            onChange={(e) => handlePropertyChange('label', e.target.value)}
            className="border-blush-200 focus:border-blush-400 font-elegant"
          />
        </div>


        {/* Dimensions */}
        <div className="space-y-2 lg:space-y-3">
          <Label className="text-sm lg:text-base font-elegant text-charcoal">Dimensiuni</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs lg:text-sm font-elegant text-charcoal/70">Lățime</Label>
              <Input
                id="width"
                type="number"
                value={selectedObject.width.toFixed(0)}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="border-blush-200 focus:border-blush-400 font-elegant h-8 lg:h-10 text-sm lg:text-base"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs lg:text-sm font-elegant text-charcoal/70">Înălțime</Label>
              <Input
                id="height"
                type="number"
                value={selectedObject.height.toFixed(0)}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="border-blush-200 focus:border-blush-400 font-elegant h-8 lg:h-10 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* Shape (for tables, decorations, and dance floor) */}
        {(selectedObject.type === 'main-table' || selectedObject.type === 'masa' || selectedObject.type === 'decoration' || selectedObject.type === 'dance-floor') && (
          <div className="space-y-2">
            <Label className="text-base font-elegant text-charcoal">Forma</Label>
            <Select
              value={selectedObject.properties.shape || 'rectangle'}
              onValueChange={(value) => handlePropertyChange('shape', value)}
            >
              <SelectTrigger className="border-blush-200 focus:border-blush-400 font-elegant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangle">Dreptunghi</SelectItem>
                <SelectItem value="circle">Cerc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Seats (for tables only) */}
        {(selectedObject.type === 'main-table' || selectedObject.type === 'masa') && (
          <div className="space-y-2">
            <Label htmlFor="seats" className="text-base font-elegant text-charcoal">
              Număr Locuri
            </Label>
            <Input
              id="seats"
              type="number"
              min="2"
              max="12"
              value={selectedObject.properties.seats || 6}
              onChange={(e) => handlePropertyChange('seats', parseInt(e.target.value))}
              className="border-blush-200 focus:border-blush-400 font-elegant"
            />
          </div>
        )}

        {/* Rotation (exclude masa invitati and round objects) */}
        {!(selectedObject.type === 'masa' || selectedObject.properties.shape === 'circle') && (
          <div className="space-y-2">
            <Label htmlFor="rotation" className="text-base font-elegant text-charcoal">
              Rotație (grade)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="rotation"
                type="number"
                min="0"
                max="360"
                step="15"
                value={selectedObject.rotation || 0}
                onChange={(e) => handleRotationChange(e.target.value)}
                className="border-blush-200 focus:border-blush-400 font-elegant flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRotationChange('0')}
                className="border-blush-200 hover:bg-blush-50 px-2"
                title="Resetează rotația"
              >
                0°
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRotationChange('90')}
                className="border-blush-200 hover:bg-blush-50 px-2"
                title="Rotește 90°"
              >
                90°
              </Button>
            </div>
          </div>
        )}

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color" className="text-base font-elegant text-charcoal">
            Culoare
          </Label>
          <Input
            id="color"
            type="color"
            value={selectedObject.properties.color || '#f0f8ff'}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            className="border-blush-200 focus:border-blush-400 h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;