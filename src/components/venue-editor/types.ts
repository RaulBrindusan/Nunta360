export interface VenueObject {
  id: string;
  type: 'main-table' | 'masa' | 'decoration' | 'stage' | 'bar' | 'dance-floor';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: {
    color?: string;
    shape?: 'rectangle' | 'circle' | 'custom';
    seats?: number;
    label?: string;
  };
}

export interface Venue {
  id: string;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  objects: VenueObject[];
}

export interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
  selectedObjectId: string | null;
  isDragging: boolean;
}

export interface ObjectTemplate {
  type: VenueObject['type'];
  name: string;
  icon: string;
  defaultProperties: Partial<VenueObject>;
}

export interface SavedObjectSettings {
  [key: string]: {
    width: number;
    height: number;
    properties: VenueObject['properties'];
  };
}