'use client';

import React, { useState, useEffect } from 'react';
import { VenueObject, CanvasState } from './types';
import { useTableGuests } from '@/hooks/useTableGuests';

interface StaticVenueCanvasProps {
  objects: VenueObject[];
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
}

const StaticVenueCanvas: React.FC<StaticVenueCanvasProps> = ({
  objects,
  canvasState,
  onCanvasStateChange,
}) => {
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [draggedGuest, setDraggedGuest] = useState<{id: string, name: string, originalTableId: string} | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const { getGuestCountForTable, getGuestsForTable, moveGuestToTable } = useTableGuests();

  const handleObjectClick = (objectId: string) => {
    const obj = objects.find(o => o.id === objectId);
    if (obj && (obj.type === 'main-table' || obj.type === 'masa')) {
      onCanvasStateChange({
        ...canvasState,
        selectedObjectId: objectId,
      });
    }
  };

  const handleSVGClick = (event: React.MouseEvent) => {
    const target = event.target as SVGElement;
    if (target.tagName === 'svg' || target.tagName === 'rect' && target.getAttribute('fill') === 'transparent') {
      onCanvasStateChange({
        ...canvasState,
        selectedObjectId: null,
      });
    }
  };

  // Drag and drop handlers
  const handleGuestMouseDown = (event: React.MouseEvent, guest: {id: string, name: string}, tableId: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    const svgRect = (event.currentTarget.closest('svg') as SVGSVGElement)?.getBoundingClientRect();
    if (!svgRect) return;
    
    setDraggedGuest({ id: guest.id, name: guest.name, originalTableId: tableId });
    setDragPosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedGuest) return;
    
    const svgRect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const newPos = { x: event.clientX - svgRect.left, y: event.clientY - svgRect.top };
    setDragPosition(newPos);
    
    // Check which table we're hovering over
    const tableUnderMouse = objects.find(obj => {
      if (obj.type !== 'main-table' && obj.type !== 'masa') return false;
      
      const centerX = obj.x + obj.width / 2;
      const centerY = obj.y + obj.height / 2;
      const distance = Math.sqrt(Math.pow(newPos.x - centerX, 2) + Math.pow(newPos.y - centerY, 2));
      
      if (obj.properties.shape === 'circle') {
        const radius = Math.min(obj.width, obj.height) / 2;
        return distance <= radius + 30; // Add some tolerance
      } else {
        return newPos.x >= obj.x - 30 && newPos.x <= obj.x + obj.width + 30 &&
               newPos.y >= obj.y - 30 && newPos.y <= obj.y + obj.height + 30;
      }
    });
    
    setHoveredTableId(tableUnderMouse?.id || null);
  };

  const handleMouseUp = async () => {
    if (!draggedGuest || !hoveredTableId) {
      setDraggedGuest(null);
      setHoveredTableId(null);
      return;
    }
    
    // Don't move if dropped on the same table
    if (hoveredTableId === draggedGuest.originalTableId) {
      setDraggedGuest(null);
      setHoveredTableId(null);
      return;
    }
    
    // Check if target table has space
    const targetTable = objects.find(obj => obj.id === hoveredTableId);
    if (targetTable) {
      const maxSeats = targetTable.properties.seats || 0;
      const currentGuests = getGuestCountForTable(hoveredTableId);
      
      if (currentGuests >= maxSeats) {
        alert('Această masă este deja completă!');
        setDraggedGuest(null);
        setHoveredTableId(null);
        return;
      }
      
      // Move the guest
      const targetTableName = targetTable.properties.label || targetTable.type;
      const success = await moveGuestToTable(draggedGuest.id, hoveredTableId, targetTableName);
      
      if (success) {
        // Force a refresh by updating the canvas state
        onCanvasStateChange({
          ...canvasState,
          selectedObjectId: hoveredTableId,
        });
      }
    }
    
    setDraggedGuest(null);
    setHoveredTableId(null);
  };

  const renderObject = (obj: VenueObject) => {
    const isSelected = obj.id === canvasState.selectedObjectId;
    const isTable = obj.type === 'main-table' || obj.type === 'masa';
    const isHoveredForDrop = hoveredTableId === obj.id;
    const { color = '#f0f8ff', shape = 'rectangle' } = obj.properties;
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const rotation = obj.rotation || 0;
    
    // Get guest count for tables
    const maxSeats = obj.properties.seats || 0;
    const occupiedSeats = isTable ? getGuestCountForTable(obj.id) : 0;
    const currentGuests = isTable ? getGuestsForTable(obj.id) : [];
    
    // Determine drop zone color
    let dropZoneColor = color;
    if (isHoveredForDrop && draggedGuest) {
      if (occupiedSeats >= maxSeats) {
        dropZoneColor = '#fecaca'; // Red for full table
      } else {
        dropZoneColor = '#bbf7d0'; // Green for available space
      }
    }
    
    return (
      <g key={obj.id} className={isTable ? "cursor-pointer" : ""}>
        <g transform={`rotate(${rotation} ${centerX} ${centerY})`}>
          {/* Object Shape */}
          {shape === 'circle' ? (
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(obj.width, obj.height) / 2}
              fill={dropZoneColor}
              stroke={isSelected ? '#3b82f6' : isHoveredForDrop ? '#10b981' : '#e5e7eb'}
              strokeWidth={isSelected ? 3 : isHoveredForDrop ? 2 : 1}
              className="touch-manipulation"
              onClick={() => handleObjectClick(obj.id)}
            />
          ) : (
            <rect
              x={obj.x}
              y={obj.y}
              width={obj.width}
              height={obj.height}
              fill={dropZoneColor}
              stroke={isSelected ? '#3b82f6' : isHoveredForDrop ? '#10b981' : '#e5e7eb'}
              strokeWidth={isSelected ? 3 : isHoveredForDrop ? 2 : 1}
              rx={4}
              className="touch-manipulation"
              onClick={() => handleObjectClick(obj.id)}
            />
          )}
          
          {/* Object Label */}
          <text
            x={centerX}
            y={centerY - (isTable && occupiedSeats > 0 ? 8 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={zoom < 0.8 ? "14" : "12"}
            fontFamily="Inter"
            fill="#374151"
            pointerEvents="none"
          >
            {obj.properties.label || obj.type}
          </text>
          
          {/* Guest count for tables */}
          {isTable && (
            <text
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={zoom < 0.8 ? "12" : "10"}
              fontFamily="Inter"
              fill={occupiedSeats === maxSeats ? "#059669" : occupiedSeats > 0 ? "#d97706" : "#6b7280"}
              pointerEvents="none"
            >
              {occupiedSeats > 0 ? `${occupiedSeats}/${maxSeats} invitați` : `${maxSeats} locuri`}
            </text>
          )}
        </g>
        
        {/* Guest names in circular fashion - only for circular tables with guests */}
        {isTable && shape === 'circle' && currentGuests.length > 0 && (
          <g>
            {currentGuests.map((guest, index) => {
              // Skip rendering if this guest is being dragged
              if (draggedGuest && draggedGuest.id === guest.id) return null;
              
              const tableRadius = Math.min(obj.width, obj.height) / 2;
              const guestRadius = tableRadius + 25; // Position between table and dotted line
              const angleStep = (2 * Math.PI) / Math.max(currentGuests.length, maxSeats);
              const angle = index * angleStep - Math.PI / 2; // Start from top
              
              const guestX = centerX + Math.cos(angle) * guestRadius;
              const guestY = centerY + Math.sin(angle) * guestRadius;
              
              // Split long names into two lines
              const name = guest.name;
              const maxChars = 8; // Adjust based on desired width
              let line1 = name;
              let line2 = '';
              
              if (name.length > maxChars) {
                const words = name.split(' ');
                if (words.length > 1) {
                  // Split by words
                  const mid = Math.ceil(words.length / 2);
                  line1 = words.slice(0, mid).join(' ');
                  line2 = words.slice(mid).join(' ');
                } else {
                  // Split long single word
                  line1 = name.substring(0, maxChars);
                  line2 = name.substring(maxChars);
                }
              }
              
              return (
                <g key={guest.id}>
                  {/* Guest name background circle */}
                  <circle
                    cx={guestX}
                    cy={guestY}
                    r="18"
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    className="cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => handleGuestMouseDown(e, guest, obj.id)}
                  />
                  
                  {/* Guest name text */}
                  {line2 ? (
                    // Two lines
                    <>
                      <text
                        x={guestX}
                        y={guestY - 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontFamily="Inter"
                        fill="#374151"
                        pointerEvents="none"
                      >
                        {line1}
                      </text>
                      <text
                        x={guestX}
                        y={guestY + 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontFamily="Inter"
                        fill="#374151"
                        pointerEvents="none"
                      >
                        {line2}
                      </text>
                    </>
                  ) : (
                    // Single line
                    <text
                      x={guestX}
                      y={guestY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontFamily="Inter"
                      fill="#374151"
                      pointerEvents="none"
                    >
                      {line1}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
        
        {/* Guest names for rectangular tables */}
        {isTable && shape === 'rectangle' && currentGuests.length > 0 && (
          <g>
            {currentGuests.map((guest, index) => {
              // Skip rendering if this guest is being dragged
              if (draggedGuest && draggedGuest.id === guest.id) return null;
              // For rectangular tables, position guests around the perimeter
              const totalPerimeter = 2 * (obj.width + obj.height);
              const spacing = totalPerimeter / Math.max(currentGuests.length, maxSeats);
              const position = index * spacing;
              
              let guestX, guestY;
              const offset = 30; // Distance from table edge
              
              if (position <= obj.width) {
                // Top edge
                guestX = obj.x + position;
                guestY = obj.y - offset;
              } else if (position <= obj.width + obj.height) {
                // Right edge
                guestX = obj.x + obj.width + offset;
                guestY = obj.y + (position - obj.width);
              } else if (position <= 2 * obj.width + obj.height) {
                // Bottom edge
                guestX = obj.x + obj.width - (position - obj.width - obj.height);
                guestY = obj.y + obj.height + offset;
              } else {
                // Left edge
                guestX = obj.x - offset;
                guestY = obj.y + obj.height - (position - 2 * obj.width - obj.height);
              }
              
              // Split long names into two lines
              const name = guest.name;
              const maxChars = 8;
              let line1 = name;
              let line2 = '';
              
              if (name.length > maxChars) {
                const words = name.split(' ');
                if (words.length > 1) {
                  const mid = Math.ceil(words.length / 2);
                  line1 = words.slice(0, mid).join(' ');
                  line2 = words.slice(mid).join(' ');
                } else {
                  line1 = name.substring(0, maxChars);
                  line2 = name.substring(maxChars);
                }
              }
              
              return (
                <g key={guest.id}>
                  {/* Guest name background */}
                  <rect
                    x={guestX - 20}
                    y={guestY - 12}
                    width="40"
                    height="24"
                    fill="rgba(255, 255, 255, 0.9)"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="4"
                    className="cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => handleGuestMouseDown(e, guest, obj.id)}
                  />
                  
                  {/* Guest name text */}
                  {line2 ? (
                    // Two lines
                    <>
                      <text
                        x={guestX}
                        y={guestY - 4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontFamily="Inter"
                        fill="#374151"
                        pointerEvents="none"
                      >
                        {line1}
                      </text>
                      <text
                        x={guestX}
                        y={guestY + 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontFamily="Inter"
                        fill="#374151"
                        pointerEvents="none"
                      >
                        {line2}
                      </text>
                    </>
                  ) : (
                    // Single line
                    <text
                      x={guestX}
                      y={guestY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontFamily="Inter"
                      fill="#374151"
                      pointerEvents="none"
                    >
                      {line1}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}
        
        {/* Selection indicator for tables */}
        {isSelected && isTable && (
          <circle
            cx={centerX}
            cy={centerY}
            r={Math.max(obj.width, obj.height) / 2 + 10}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.7"
          />
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
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="absolute inset-0 touch-manipulation"
        onClick={handleSVGClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          
          {/* Dragged guest overlay */}
          {draggedGuest && (
            <g>
              <circle
                cx={dragPosition.x}
                cy={dragPosition.y}
                r="18"
                fill="rgba(59, 130, 246, 0.8)"
                stroke="#3b82f6"
                strokeWidth="2"
                className="pointer-events-none"
              />
              <text
                x={dragPosition.x}
                y={dragPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontFamily="Inter"
                fill="white"
                className="pointer-events-none font-medium"
              >
                {draggedGuest.name.length > 8 ? draggedGuest.name.substring(0, 8) + '...' : draggedGuest.name}
              </text>
            </g>
          )}
        </g>
      </svg>
      
      {/* Canvas Info */}
      <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm font-elegant text-charcoal/70 max-w-[calc(100%-1rem)] lg:max-w-none">
        <div className="lg:hidden">
          Mese: {objects.filter(obj => obj.type === 'main-table' || obj.type === 'masa').length}
          {canvasState.selectedObjectId ? ' (Selectată)' : ' (Fă clic pentru a selecta)'}
        </div>
        <div className="hidden lg:block">
          Mese: {objects.filter(obj => obj.type === 'main-table' || obj.type === 'masa').length} | 
          {canvasState.selectedObjectId ? ' Masă selectată pentru atribuire invitați' : ' Fă clic pe o masă pentru a atribui invitați'}
        </div>
      </div>

    </div>
  );
};

export default StaticVenueCanvas;