'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import VenueCanvas from './VenueCanvas';
import StaticVenueCanvas from './StaticVenueCanvas';
import VenueToolbar from './VenueToolbar';
import PropertiesPanel from './PropertiesPanel';
import GuestAssignmentPanel from './GuestAssignmentPanel';
import { VenueObject, CanvasState, SavedObjectSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

const VenueEditor = () => {
  const [activeTab, setActiveTab] = useState<'dispunere' | 'invitati'>('dispunere');
  const [objects, setObjects] = useState<VenueObject[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('venue-objects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    selectedObjectId: null,
    isDragging: false,
  });
  
  // Persistent object settings
  const [savedSettings, setSavedSettings] = useState<SavedObjectSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('venue-object-settings');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const addObject = useCallback((type: VenueObject['type']) => {
    // Count objects of the same type for category-based numbering
    const sameTypeObjects = objects.filter(obj => obj.type === type);
    const nextNumber = sameTypeObjects.length + 1;
    
    // Romanian type names for labels
    const typeNames = {
      'main-table': 'Masa Principală',
      'masa': 'Masă',
      'decoration': 'Decorațiune',
      'stage': 'Scenă',
      'bar': 'Bar',
      'dance-floor': 'Ring de dans'
    };
    
    // Default settings for object types
    const defaultSettings = {
      'main-table': { width: 200, height: 80, color: '#ffd700', shape: 'rectangle' as const, seats: 10 },
      'masa': { width: 80, height: 80, color: '#f0f8ff', shape: 'circle' as const, seats: 6 },
      'decoration': { width: 60, height: 60, color: '#e6f3ff', shape: 'circle' as const },
      'stage': { width: 150, height: 100, color: '#ffe4e1', shape: 'rectangle' as const },
      'bar': { width: 120, height: 60, color: '#e0e6ff', shape: 'rectangle' as const },
      'dance-floor': { width: 120, height: 120, color: '#f0fff0', shape: 'rectangle' as const }
    };
    
    // Use saved settings if available, otherwise use defaults
    const savedSetting = savedSettings[type];
    const defaultSetting = defaultSettings[type];
    
    const newObject: VenueObject = {
      id: uuidv4(),
      type,
      x: 100,
      y: 100,
      width: savedSetting?.width || defaultSetting.width,
      height: savedSetting?.height || defaultSetting.height,
      rotation: 0,
      properties: {
        color: savedSetting?.properties.color || defaultSetting.color,
        shape: savedSetting?.properties.shape || defaultSetting.shape,
        seats: savedSetting?.properties.seats || defaultSetting.seats,
        label: `${typeNames[type]} ${nextNumber}`,
      },
    };

    setObjects(prev => {
      const updated = [...prev, newObject];
      if (typeof window !== 'undefined') {
        localStorage.setItem('venue-objects', JSON.stringify(updated));
      }
      return updated;
    });
    setCanvasState(prev => ({ ...prev, selectedObjectId: newObject.id }));
  }, [objects, savedSettings]);

  const updateObject = useCallback((id: string, updates: Partial<VenueObject>) => {
    setObjects(prev => {
      const updated = prev.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      );
      
      // Save settings when object is modified
      const updatedObject = updated.find(obj => obj.id === id);
      if (updatedObject && (updates.width || updates.height || updates.properties)) {
        const newSettings = {
          ...savedSettings,
          [updatedObject.type]: {
            width: updatedObject.width,
            height: updatedObject.height,
            properties: updatedObject.properties,
          }
        };
        setSavedSettings(newSettings);
        if (typeof window !== 'undefined') {
          localStorage.setItem('venue-object-settings', JSON.stringify(newSettings));
        }
      }
      
      // Save venue objects
      if (typeof window !== 'undefined') {
        localStorage.setItem('venue-objects', JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [savedSettings]);

  const deleteObject = useCallback((id: string) => {
    setObjects(prev => {
      const updated = prev.filter(obj => obj.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('venue-objects', JSON.stringify(updated));
      }
      return updated;
    });
    setCanvasState(prev => ({ 
      ...prev, 
      selectedObjectId: prev.selectedObjectId === id ? null : prev.selectedObjectId 
    }));
  }, []);

  // Keyboard event handler for delete functionality
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && canvasState.selectedObjectId) {
        deleteObject(canvasState.selectedObjectId);
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [canvasState.selectedObjectId, deleteObject]);

  const selectedObject = objects.find(obj => obj.id === canvasState.selectedObjectId);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Mobile Toolbar - Horizontal on mobile, sidebar on desktop */}
      <div className="lg:w-64 lg:flex-shrink-0 order-1 lg:order-1">
        <VenueToolbar 
          onAddObject={addObject} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          objects={objects}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 order-3 lg:order-2 min-h-[400px] lg:min-h-0">
        <Card className="h-full border-gray-200 bg-white shadow-sm">
          {activeTab === 'dispunere' ? (
            <VenueCanvas
              objects={objects}
              canvasState={canvasState}
              onUpdateObject={updateObject}
              onCanvasStateChange={setCanvasState}
            />
          ) : (
            <StaticVenueCanvas
              objects={objects}
              canvasState={canvasState}
              onCanvasStateChange={setCanvasState}
            />
          )}
        </Card>
      </div>

      {/* Right Panel - Properties or Guest Assignment based on tab */}
      <div className="lg:w-80 lg:flex-shrink-0 order-2 lg:order-3">
        {activeTab === 'dispunere' ? (
          <PropertiesPanel
            selectedObject={selectedObject}
            onUpdateObject={updateObject}
            onDeleteObject={deleteObject}
          />
        ) : (
          <GuestAssignmentPanel
            selectedObject={selectedObject}
            objects={objects}
          />
        )}
      </div>
    </div>
  );
};

export default VenueEditor;