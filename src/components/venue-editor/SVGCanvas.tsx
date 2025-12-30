'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { VenueObject, CanvasState } from './types';

interface SVGCanvasProps {
  objects: VenueObject[];
  canvasState: CanvasState;
  onUpdateObject: (id: string, updates: Partial<VenueObject>) => void;
  onCanvasStateChange: (state: CanvasState) => void;
}

const SVGCanvas: React.FC<SVGCanvasProps> = ({
  objects,
  canvasState,
  onUpdateObject,
  onCanvasStateChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    dragObjectId: string | null;
    startPos: { x: number; y: number };
    offset: { x: number; y: number };
    resizing: boolean;
    resizeHandle: string | null;
    rotating: boolean;
    startAngle: number;
  }>({
    isDragging: false,
    dragObjectId: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    resizing: false,
    resizeHandle: null,
    rotating: false,
    startAngle: 0,
  });
  
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const getSVGCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = useCallback((event: React.MouseEvent | React.TouchEvent, objectId: string, isResize = false, resizeHandle = '', isRotate = false) => {
    event.preventDefault();
    event.stopPropagation();
    
    const coords = getSVGCoordinates(event);
    const object = objects.find(obj => obj.id === objectId);
    
    if (object) {
      const centerX = object.x + object.width / 2;
      const centerY = object.y + object.height / 2;
      const startAngle = isRotate ? Math.atan2(coords.y - centerY, coords.x - centerX) * (180 / Math.PI) : 0;
      
      setDragState({
        isDragging: !isResize && !isRotate,
        dragObjectId: objectId,
        startPos: coords,
        offset: {
          x: coords.x - object.x,
          y: coords.y - object.y,
        },
        resizing: isResize,
        resizeHandle: isResize ? resizeHandle : null,
        rotating: isRotate,
        startAngle: startAngle,
      });
      
      onCanvasStateChange({
        ...canvasState,
        selectedObjectId: objectId,
      });
    }
  }, [objects, canvasState, onCanvasStateChange]);

  const handleMouseMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if ((!dragState.isDragging && !dragState.resizing && !dragState.rotating) || !dragState.dragObjectId) return;
    
    const coords = getSVGCoordinates(event);
    const object = objects.find(obj => obj.id === dragState.dragObjectId);
    
    if (!object) return;
    
    if (dragState.rotating) {
      const centerX = object.x + object.width / 2;
      const centerY = object.y + object.height / 2;
      const currentAngle = Math.atan2(coords.y - centerY, coords.x - centerX) * (180 / Math.PI);
      const angleDiff = currentAngle - dragState.startAngle;
      const newRotation = ((object.rotation || 0) + angleDiff) % 360;
      
      onUpdateObject(dragState.dragObjectId, {
        rotation: newRotation < 0 ? newRotation + 360 : newRotation,
      });
      
      setDragState(prev => ({ ...prev, startAngle: currentAngle }));
    } else if (dragState.resizing && dragState.resizeHandle) {
      const handle = dragState.resizeHandle;
      let newX = object.x;
      let newY = object.y;
      let newWidth = object.width;
      let newHeight = object.height;
      
      if (handle.includes('left')) {
        const deltaX = coords.x - object.x;
        newX = coords.x;
        newWidth = object.width - deltaX;
      }
      if (handle.includes('right')) {
        newWidth = coords.x - object.x;
      }
      if (handle.includes('top')) {
        const deltaY = coords.y - object.y;
        newY = coords.y;
        newHeight = object.height - deltaY;
      }
      if (handle.includes('bottom')) {
        newHeight = coords.y - object.y;
      }
      
      // Ensure minimum size
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      onUpdateObject(dragState.dragObjectId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    } else if (dragState.isDragging) {
      const newX = coords.x - dragState.offset.x;
      const newY = coords.y - dragState.offset.y;
      
      onUpdateObject(dragState.dragObjectId, {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      });
    }
  }, [dragState, objects, onUpdateObject]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragObjectId: null,
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      resizing: false,
      resizeHandle: null,
      rotating: false,
      startAngle: 0,
    });
  }, []);
  
  // Zoom functionality
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => Math.max(0.1, Math.min(3, prevZoom * zoomFactor)));
  }, []);

  // Touch zoom for mobile
  const [touchStartDistance, setTouchStartDistance] = useState(0);
  
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length !== 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      setTouchStartDistance(getTouchDistance(event.touches));
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 2 && touchStartDistance > 0) {
      event.preventDefault();
      const currentDistance = getTouchDistance(event.touches);
      const zoomFactor = currentDistance / touchStartDistance;
      setZoom(prevZoom => Math.max(0.1, Math.min(3, prevZoom * zoomFactor)));
      setTouchStartDistance(currentDistance);
    } else if (event.touches.length === 1) {
      // Single touch - handle object dragging
      handleMouseMove(event);
    }
  }, [touchStartDistance, handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    setTouchStartDistance(0);
    handleMouseUp();
  }, [handleMouseUp]);

  const handleSVGClick = useCallback((event: React.MouseEvent) => {
    // Check if we clicked on the SVG background (not on any object)
    const target = event.target as SVGElement;
    if (target.tagName === 'svg' || target.tagName === 'rect' && target.getAttribute('fill') === 'transparent') {
      onCanvasStateChange({
        ...canvasState,
        selectedObjectId: null,
      });
    }
  }, [canvasState, onCanvasStateChange]);

  const renderObject = (obj: VenueObject) => {
    const isSelected = obj.id === canvasState.selectedObjectId;
    const { color = '#f0f8ff', shape = 'rectangle' } = obj.properties;
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const rotation = obj.rotation || 0;
    
    return (
      <g key={obj.id} className="cursor-move">
        <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
          {/* Object Shape */}
          {shape === 'circle' ? (
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(obj.width, obj.height) / 2}
              fill={color}
              stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
              strokeWidth={isSelected ? 3 : 1}
              className="touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
              onTouchStart={(e) => handleMouseDown(e, obj.id)}
            />
          ) : (
            <rect
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
              fill={color}
              stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
              strokeWidth={isSelected ? 3 : 1}
              rx={4}
              className="touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
              onTouchStart={(e) => handleMouseDown(e, obj.id)}
            />
          )}
          
          {/* Object Label - larger text on mobile */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={zoom < 0.8 ? "14" : "12"}
            fontFamily="Inter"
            fill="#374151"
            pointerEvents="none"
          >
            {obj.properties.label || obj.type}
          </text>
          
          {/* Seats indicator for tables - hide on small zoom levels for performance */}
          {(obj.type === 'main-table' || obj.type === 'masa') && obj.properties.seats && zoom > 0.5 && (
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              fontSize={zoom < 0.8 ? "12" : "10"}
              fontFamily="Inter"
              fill="#6b7280"
              pointerEvents="none"
            >
              {obj.properties.seats} locuri
            </text>
          )}
        </g>
        
        {/* Resize handles - positioned at object bounds, not rotated */}
        {isSelected && (
          <>
            {/* Corner handles - larger for mobile */}
            <circle 
              cx={obj.x} 
              cy={obj.y} 
              r="8" 
              fill="#3b82f6" 
              className="cursor-nw-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'top-left')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'top-left')}
            />
            <circle 
              cx={obj.x + obj.width} 
              cy={obj.y} 
              r="8" 
              fill="#3b82f6" 
              className="cursor-ne-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'top-right')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'top-right')}
            />
            <circle 
              cx={obj.x} 
              cy={obj.y + obj.height} 
              r="8" 
              fill="#3b82f6" 
              className="cursor-sw-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'bottom-left')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'bottom-left')}
            />
            <circle 
              cx={obj.x + obj.width} 
              cy={obj.y + obj.height} 
              r="8" 
              fill="#3b82f6" 
              className="cursor-se-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'bottom-right')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'bottom-right')}
            />
            
            {/* Edge handles - larger for mobile */}
            <circle 
              cx={centerX} 
              cy={obj.y} 
              r="7" 
              fill="#60a5fa" 
              className="cursor-n-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'top')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'top')}
            />
            <circle 
              cx={centerX} 
              cy={obj.y + obj.height} 
              r="7" 
              fill="#60a5fa" 
              className="cursor-s-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'bottom')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'bottom')}
            />
            <circle 
              cx={obj.x} 
              cy={centerY} 
              r="7" 
              fill="#60a5fa" 
              className="cursor-w-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'left')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'left')}
            />
            <circle 
              cx={obj.x + obj.width} 
              cy={centerY} 
              r="7" 
              fill="#60a5fa" 
              className="cursor-e-resize touch-manipulation"
              onMouseDown={(e) => handleMouseDown(e, obj.id, true, 'right')}
              onTouchStart={(e) => handleMouseDown(e, obj.id, true, 'right')}
            />
            
            {/* Rotation handle - only for rotatable objects */}
            {!(obj.type === 'masa' || obj.properties.shape === 'circle') && (
              <>
                {/* Rotation handle line */}
                <line
                  x1={centerX}
                  y1={obj.y - 15}
                  x2={centerX}
                  y2={obj.y - 30}
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                {/* Rotation handle icon */}
                <g
                  transform={`translate(${centerX}, ${obj.y - 35})`}
                  className="cursor-grab active:cursor-grabbing touch-manipulation"
                  onMouseDown={(e) => handleMouseDown(e, obj.id, false, '', true)}
                  onTouchStart={(e) => handleMouseDown(e, obj.id, false, '', true)}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Rotation icon (circular arrow) */}
                  <path
                    d="M-3,-3 A3,3 0 1,1 3,-3 M3,-3 L1,-1 M3,-3 L5,-1"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </>
            )}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      />


      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="absolute inset-0 touch-manipulation"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSVGClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <g transform={`scale(${zoom}) translate(${panOffset.x / zoom}, ${panOffset.y / zoom})`}>
        {/* Canvas Background */}
        <rect
          x="0"
          y="0"
          width="800"
          height="600"
          fill="transparent"
        />
        
          {/* Render Objects */}
          {objects.map(renderObject)}
        </g>
      </svg>
      
      {/* Canvas Info */}
      <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm font-elegant text-charcoal/70 max-w-[calc(100%-1rem)] lg:max-w-none">
        <div className="lg:hidden">
          Obiecte: {objects.length}
          {dragState.rotating ? ' (Se rotește...)' : 
           canvasState.selectedObjectId ? ' (Selectat)' : ''}
        </div>
        <div className="hidden lg:block">
          Obiecte: {objects.length} | 
          {dragState.rotating ? ' Se rotește...' : 
           canvasState.selectedObjectId ? ' Obiect selectat (Delete pentru a șterge)' : 
           ' Fă clic pentru a selecta'}
        </div>
      </div>
    </div>
  );
};

export default SVGCanvas;