'use client';

import React from 'react';
import SVGCanvas from './SVGCanvas';
import { VenueObject, CanvasState } from './types';

interface VenueCanvasProps {
  objects: VenueObject[];
  canvasState: CanvasState;
  onUpdateObject: (id: string, updates: Partial<VenueObject>) => void;
  onCanvasStateChange: (state: CanvasState) => void;
}

const VenueCanvas: React.FC<VenueCanvasProps> = ({
  objects,
  canvasState,
  onUpdateObject,
  onCanvasStateChange,
}) => {
  return (
    <SVGCanvas
      objects={objects}
      canvasState={canvasState}
      onUpdateObject={onUpdateObject}
      onCanvasStateChange={onCanvasStateChange}
    />
  );
};

export default VenueCanvas;