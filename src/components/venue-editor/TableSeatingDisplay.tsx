'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VenueObject } from './types';
import { useTableGuests } from '@/hooks/useTableGuests';
import { useEvents } from '@/hooks/useEvents';
import { Download, FileText, Loader2, Code } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TableSeatingDisplayProps {
  objects: VenueObject[];
}

const TableSeatingDisplay: React.FC<TableSeatingDisplayProps> = ({ objects }) => {
  const { tableGuests, getGuestsForTable, loading } = useTableGuests();
  const { eventDetails, loading: eventsLoading } = useEvents();
  const seatingRef = useRef<HTMLDivElement>(null);
  const [selectedDesign, setSelectedDesign] = useState<string>('botanical');

  // Get all tables (main-table and masa)
  const tables = objects.filter(obj => obj.type === 'main-table' || obj.type === 'masa');

  // Get wedding details
  const brideName = eventDetails?.brideName || 'Mireasa';
  const groomName = eventDetails?.groomName || 'Mirele';
  const weddingDate = eventDetails?.weddingDate
    ? eventDetails.weddingDate.toDate().toLocaleDateString('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Data nunții';

  // Generate PDF function
  const generatePDF = async () => {
    if (!seatingRef.current) return;

    try {
      // Target dimensions: 7200x10800 pixels at 300 PPI
      // This equals 24" x 36" (609.6mm x 914.4mm)
      const targetWidth = 7200;
      const targetHeight = 10800;
      const scale = 3; // Scale factor to achieve high resolution

      // Create canvas from HTML content with exact dimensions
      const canvas = await html2canvas(seatingRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: targetWidth / scale, // 2400px base width
        height: targetHeight / scale, // 3600px base height
        x: 0,
        y: 0,
      });

      // Resize canvas to exact target dimensions if needed
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext('2d');
      
      if (ctx) {
        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // Draw the captured content, scaled to fit exactly
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
      }

      // Create PDF with exact dimensions for 300 PPI
      // 7200px ÷ 300 PPI = 24 inches = 609.6mm
      // 10800px ÷ 300 PPI = 36 inches = 914.4mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [609.6, 914.4], // Exact size for 300 PPI
        compress: true,
      });

      // Get high-quality image data
      const imgData = finalCanvas.toDataURL('image/png', 1.0);
      
      // Add image to PDF with exact dimensions
      pdf.addImage(imgData, 'PNG', 0, 0, 609.6, 914.4, '', 'FAST');
      
      // Save the PDF
      const now = new Date();
      const filename = `aranjament_mese_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Eroare la generarea PDF-ului. Te rugăm să încerci din nou.');
    }
  };

  // Generate HTML function
  const generateHTML = () => {
    if (!seatingRef.current) return;

    try {
      // Get the HTML content
      const htmlContent = seatingRef.current.outerHTML;
      
      // Create a complete HTML document
      const fullHTML = `
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aranjament Mese - Nunta360</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
        }
        
        @media print {
            body {
                width: 7200px;
                height: 10800px;
            }
            
            @page {
                size: 24in 36in;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

      // Create and download the HTML file
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      const now = new Date();
      const filename = `aranjament_mese_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}.html`;
      
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating HTML:', error);
      alert('Eroare la generarea HTML-ului. Te rugăm să încerci din nou.');
    }
  };

  if (loading || eventsLoading) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-elegant text-charcoal flex items-center gap-2">
            <FileText className="w-4 h-4 text-blush-400" />
            <span>Aranjament Mese</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blush-400" />
            <p className="text-charcoal/60 font-elegant">Se încarcă aranjamentul meselor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tables.length === 0) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-elegant text-charcoal flex items-center gap-2">
            <FileText className="w-4 h-4 text-blush-400" />
            <span>Aranjament Mese</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-charcoal/60 font-elegant">
              Nu ai adăugat încă nicio masă în editorul de locație.
            </p>
            <p className="text-charcoal/40 font-elegant text-sm mt-2">
              Mergi la tab-ul "Dispunere" pentru a adăuga mese.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Design components
  const BotanicalDesign = () => (
    <div ref={selectedDesign === 'botanical' ? seatingRef : null} className="relative" style={{ 
      background: 'linear-gradient(135deg, #fefcf8 0%, #faf8f3 100%)',
      minHeight: '600px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Botanical decorations - SVG overlays */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Top left botanical decoration */}
        <div className="absolute top-8 left-8">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <path d="M20 40C30 30, 50 35, 60 40C70 45, 90 40, 100 50" stroke="#7c8471" strokeWidth="2" fill="none" opacity="0.6"/>
            <ellipse cx="25" cy="35" rx="8" ry="3" fill="#8b9472" opacity="0.5" transform="rotate(-30 25 35)"/>
            <ellipse cx="35" cy="32" rx="10" ry="4" fill="#7c8471" opacity="0.6" transform="rotate(-45 35 32)"/>
            <ellipse cx="45" cy="38" rx="12" ry="5" fill="#8b9472" opacity="0.5" transform="rotate(-20 45 38)"/>
            <ellipse cx="55" cy="42" rx="9" ry="3" fill="#7c8471" opacity="0.6" transform="rotate(-60 55 42)"/>
            <ellipse cx="65" cy="45" rx="11" ry="4" fill="#8b9472" opacity="0.5" transform="rotate(-10 65 45)"/>
          </svg>
        </div>

        {/* Top right botanical decoration */}
        <div className="absolute top-8 right-8">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <path d="M100 40C90 30, 70 35, 60 40C50 45, 30 40, 20 50" stroke="#7c8471" strokeWidth="2" fill="none" opacity="0.6"/>
            <ellipse cx="95" cy="35" rx="8" ry="3" fill="#8b9472" opacity="0.5" transform="rotate(30 95 35)"/>
            <ellipse cx="85" cy="32" rx="10" ry="4" fill="#7c8471" opacity="0.6" transform="rotate(45 85 32)"/>
            <ellipse cx="75" cy="38" rx="12" ry="5" fill="#8b9472" opacity="0.5" transform="rotate(20 75 38)"/>
            <ellipse cx="65" cy="42" rx="9" ry="3" fill="#7c8471" opacity="0.6" transform="rotate(60 65 42)"/>
            <ellipse cx="55" cy="45" rx="11" ry="4" fill="#8b9472" opacity="0.5" transform="rotate(10 55 45)"/>
          </svg>
        </div>

        {/* Gold border frame */}
        <div className="absolute inset-8 border-4 border-yellow-500 rounded-lg pointer-events-none opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-charcoal/60 font-elegant text-sm tracking-widest uppercase mb-2">
            ARANJAMENT OFICIAL MESE
          </p>
          <h1 className="text-4xl font-script text-charcoal mb-2" style={{ fontFamily: 'Great Vibes, cursive' }}>
            {brideName} & {groomName}
          </h1>
          <p className="text-charcoal/60 font-elegant text-lg mb-4">
            {weddingDate}
          </p>
          <p className="text-charcoal/70 font-elegant">
            Ne bucurăm să petrecem seara cu voi!
          </p>
        </div>

        {/* Tables Grid - 3 columns like the image */}
        <div className="grid grid-cols-3 gap-12 max-w-4xl mx-auto">
          {tables.map((table, index) => {
            const guests = getGuestsForTable(table.id);
            const tableNumber = table.properties.label || `Masa ${index + 1}`;
            
            return (
              <div key={table.id} className="text-center">
                <h2 className="text-xl font-serif text-charcoal mb-4 font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {tableNumber}
                </h2>
                {guests.length > 0 ? (
                  <div className="space-y-2">
                    {guests.map((guest) => (
                      <div key={guest.id} className="text-charcoal/70 text-sm" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {guest.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-charcoal/40 font-elegant text-sm italic">
                    Fără invitați
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const LuxeDesign = () => (
    <div ref={selectedDesign === 'luxe' ? seatingRef : null} className="relative" style={{ 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      minHeight: '600px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Luxurious gold accents and patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Gold corner flourishes */}
        <div className="absolute top-8 left-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M20 20L60 20M20 20L20 60M20 20L35 35" stroke="#d4af37" strokeWidth="2" opacity="0.7"/>
            <circle cx="22" cy="22" r="3" fill="#d4af37" opacity="0.6"/>
            <circle cx="58" cy="22" r="2" fill="#d4af37" opacity="0.4"/>
            <circle cx="22" cy="58" r="2" fill="#d4af37" opacity="0.4"/>
          </svg>
        </div>
        
        <div className="absolute top-8 right-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M60 20L20 20M60 20L60 60M60 20L45 35" stroke="#d4af37" strokeWidth="2" opacity="0.7"/>
            <circle cx="58" cy="22" r="3" fill="#d4af37" opacity="0.6"/>
            <circle cx="22" cy="22" r="2" fill="#d4af37" opacity="0.4"/>
            <circle cx="58" cy="58" r="2" fill="#d4af37" opacity="0.4"/>
          </svg>
        </div>

        <div className="absolute bottom-8 left-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M20 60L60 60M20 60L20 20M20 60L35 45" stroke="#d4af37" strokeWidth="2" opacity="0.7"/>
            <circle cx="22" cy="58" r="3" fill="#d4af37" opacity="0.6"/>
            <circle cx="58" cy="58" r="2" fill="#d4af37" opacity="0.4"/>
            <circle cx="22" cy="22" r="2" fill="#d4af37" opacity="0.4"/>
          </svg>
        </div>

        <div className="absolute bottom-8 right-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M60 60L20 60M60 60L60 20M60 60L45 45" stroke="#d4af37" strokeWidth="2" opacity="0.7"/>
            <circle cx="58" cy="58" r="3" fill="#d4af37" opacity="0.6"/>
            <circle cx="22" cy="58" r="2" fill="#d4af37" opacity="0.4"/>
            <circle cx="58" cy="22" r="2" fill="#d4af37" opacity="0.4"/>
          </svg>
        </div>

        {/* Subtle gold pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #d4af37 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #d4af37 1px, transparent 1px)`,
          backgroundSize: '50px 50px, 50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}></div>

        {/* Central gold border frame */}
        <div className="absolute inset-16 border border-yellow-500/30 rounded-lg"></div>
      </div>

      <div className="relative z-10 p-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8">
            {/* Gold decorative element */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <div className="mx-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#d4af37" strokeWidth="1" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="#d4af37" opacity="0.6"/>
                </svg>
              </div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-yellow-400/80 text-xs tracking-[0.3em] uppercase font-medium mb-6">
              Seating Arrangement
            </p>
            
            <h1 className="text-6xl font-light text-white mb-6" style={{ 
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.02em',
              lineHeight: '1.1'
            }}>
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                {brideName}
              </span>
              <span className="block text-white/60 text-2xl mt-3 font-thin tracking-widest">&</span>
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                {groomName}
              </span>
            </h1>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
              <div className="mx-4 w-2 h-2 rotate-45 bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            </div>
            
            <p className="text-white/70 text-lg font-light tracking-wide">
              {weddingDate}
            </p>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {tables.map((table, index) => {
            const guests = getGuestsForTable(table.id);
            const tableNumber = table.properties.label || `Masa ${index + 1}`;
            
            return (
              <div key={table.id} className="group relative">
                {/* Gold glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative border border-yellow-500/30 p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl shadow-2xl">
                  {/* Table number with gold accent */}
                  <div className="text-center mb-6">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-4"></div>
                    
                    <div className="relative inline-block">
                      <h2 className="text-2xl font-light text-white tracking-wide relative z-10" style={{
                        fontFamily: 'Playfair Display, serif'
                      }}>
                        {tableNumber}
                      </h2>
                      {/* Gold underline */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent"></div>
                    </div>
                    
                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4"></div>
                  </div>
                  
                  {/* Guest list */}
                  {guests.length > 0 ? (
                    <div className="space-y-3">
                      {guests.map((guest, guestIndex) => (
                        <div key={guest.id}>
                          <div className="text-white/80 text-sm font-light tracking-wide text-center py-1" style={{
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {guest.name}
                          </div>
                          {guestIndex < guests.length - 1 && (
                            <div className="w-6 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent mx-auto mt-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm font-light text-center italic tracking-wide">
                      Fără invitați
                    </p>
                  )}
                  
                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-yellow-500/40"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-yellow-500/40"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-yellow-500/40"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-yellow-500/40"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
            <div className="mx-4 w-2 h-2 rotate-45 bg-gradient-to-br from-yellow-400/50 to-yellow-600/50"></div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const VintageDesign = () => (
    <div ref={selectedDesign === 'vintage' ? seatingRef : null} className="relative" style={{ 
      background: 'linear-gradient(135deg, #f7f3e9 0%, #f0e6d2 50%, #e8dcc6 100%)',
      minHeight: '600px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Ornate vintage decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Elaborate corner flourishes */}
        <div className="absolute top-8 left-8">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M20 20C30 10, 50 15, 60 20C70 25, 90 20, 100 30L85 45C75 35, 55 40, 45 45C35 50, 25 45, 20 55Z" fill="#8b4513" opacity="0.3"/>
            <path d="M20 20L100 20M20 20L20 100" stroke="#8b4513" strokeWidth="3" opacity="0.6"/>
            <circle cx="25" cy="25" r="8" fill="#8b4513" opacity="0.4"/>
            <circle cx="95" cy="25" r="5" fill="#8b4513" opacity="0.3"/>
            <circle cx="25" cy="95" r="5" fill="#8b4513" opacity="0.3"/>
            {/* Ornate swirls */}
            <path d="M40 40C50 30, 60 35, 65 45C60 55, 50 50, 40 40Z" stroke="#8b4513" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M70 30C80 25, 85 35, 80 45C75 40, 70 35, 70 30Z" stroke="#8b4513" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>
        
        <div className="absolute top-8 right-8 transform scale-x-[-1]">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M20 20C30 10, 50 15, 60 20C70 25, 90 20, 100 30L85 45C75 35, 55 40, 45 45C35 50, 25 45, 20 55Z" fill="#8b4513" opacity="0.3"/>
            <path d="M20 20L100 20M20 20L20 100" stroke="#8b4513" strokeWidth="3" opacity="0.6"/>
            <circle cx="25" cy="25" r="8" fill="#8b4513" opacity="0.4"/>
            <circle cx="95" cy="25" r="5" fill="#8b4513" opacity="0.3"/>
            <circle cx="25" cy="95" r="5" fill="#8b4513" opacity="0.3"/>
            <path d="M40 40C50 30, 60 35, 65 45C60 55, 50 50, 40 40Z" stroke="#8b4513" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M70 30C80 25, 85 35, 80 45C75 40, 70 35, 70 30Z" stroke="#8b4513" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>

        <div className="absolute bottom-8 left-8 transform scale-y-[-1]">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M20 20C30 10, 50 15, 60 20C70 25, 90 20, 100 30L85 45C75 35, 55 40, 45 45C35 50, 25 45, 20 55Z" fill="#8b4513" opacity="0.3"/>
            <path d="M20 20L100 20M20 20L20 100" stroke="#8b4513" strokeWidth="3" opacity="0.6"/>
            <circle cx="25" cy="25" r="8" fill="#8b4513" opacity="0.4"/>
            <circle cx="95" cy="25" r="5" fill="#8b4513" opacity="0.3"/>
            <circle cx="25" cy="95" r="5" fill="#8b4513" opacity="0.3"/>
            <path d="M40 40C50 30, 60 35, 65 45C60 55, 50 50, 40 40Z" stroke="#8b4513" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M70 30C80 25, 85 35, 80 45C75 40, 70 35, 70 30Z" stroke="#8b4513" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>

        <div className="absolute bottom-8 right-8 transform scale-[-1]">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M20 20C30 10, 50 15, 60 20C70 25, 90 20, 100 30L85 45C75 35, 55 40, 45 45C35 50, 25 45, 20 55Z" fill="#8b4513" opacity="0.3"/>
            <path d="M20 20L100 20M20 20L20 100" stroke="#8b4513" strokeWidth="3" opacity="0.6"/>
            <circle cx="25" cy="25" r="8" fill="#8b4513" opacity="0.4"/>
            <circle cx="95" cy="25" r="5" fill="#8b4513" opacity="0.3"/>
            <circle cx="25" cy="95" r="5" fill="#8b4513" opacity="0.3"/>
            <path d="M40 40C50 30, 60 35, 65 45C60 55, 50 50, 40 40Z" stroke="#8b4513" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M70 30C80 25, 85 35, 80 45C75 40, 70 35, 70 30Z" stroke="#8b4513" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>

        {/* Vintage wallpaper pattern */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b4513' fill-opacity='0.15'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12-12c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Ornate center frame */}
        <div className="absolute inset-20 border-4 border-amber-800/20 rounded-lg shadow-inner"></div>
        <div className="absolute inset-24 border border-amber-700/30 rounded-lg"></div>
      </div>

      <div className="relative z-10 p-20">
        {/* Header with vintage typography */}
        <div className="text-center mb-16">
          {/* Ornate header decoration */}
          <div className="flex items-center justify-center mb-8">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <path d="M10 20C20 10, 30 15, 40 20C50 15, 60 10, 70 20" stroke="#8b4513" strokeWidth="2" fill="none" opacity="0.6"/>
              <circle cx="15" cy="18" r="3" fill="#8b4513" opacity="0.4"/>
              <circle cx="40" cy="15" r="4" fill="#8b4513" opacity="0.5"/>
              <circle cx="65" cy="18" r="3" fill="#8b4513" opacity="0.4"/>
            </svg>
          </div>

          <div className="mb-6">
            <p className="text-amber-800/80 text-xs tracking-[0.4em] uppercase font-semibold mb-4 font-serif">
              Aranjament Oficial
            </p>
          </div>
          
          <h1 className="text-6xl text-amber-900 mb-8" style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(139, 69, 19, 0.1)',
            lineHeight: '1.1'
          }}>
            <span className="block">{brideName}</span>
            <span className="block text-amber-700/70 text-3xl my-3 font-normal tracking-widest">&</span>
            <span className="block">{groomName}</span>
          </h1>

          {/* Decorative date element */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-px bg-amber-700/50"></div>
            <div className="mx-6 px-4 py-2 border-2 border-amber-700/30 bg-white/40 rounded-lg backdrop-blur-sm">
              <p className="text-amber-800 text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
                {weddingDate}
              </p>
            </div>
            <div className="w-12 h-px bg-amber-700/50"></div>
          </div>
        </div>

        {/* Enhanced Tables Grid */}
        <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {tables.map((table, index) => {
            const guests = getGuestsForTable(table.id);
            const tableNumber = table.properties.label || `Masa ${index + 1}`;
            
            return (
              <div key={table.id} className="group relative">
                {/* Ornate card design */}
                <div className="relative bg-gradient-to-br from-amber-50/90 to-amber-100/70 border-3 border-amber-700/25 rounded-xl p-8 shadow-lg backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-4 h-4">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 2M2 2L2 14" stroke="#8b4513" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="3" cy="3" r="2" fill="#8b4513" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 w-4 h-4 transform scale-x-[-1]">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 2M2 2L2 14" stroke="#8b4513" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="3" cy="3" r="2" fill="#8b4513" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 transform scale-y-[-1]">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 2M2 2L2 14" stroke="#8b4513" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="3" cy="3" r="2" fill="#8b4513" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 transform scale-[-1]">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 2M2 2L2 14" stroke="#8b4513" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="3" cy="3" r="2" fill="#8b4513" opacity="0.3"/>
                    </svg>
                  </div>

                  {/* Table header */}
                  <div className="text-center mb-6">
                    <div className="w-8 h-px bg-amber-700/40 mx-auto mb-3"></div>
                    <h2 className="text-2xl text-amber-900 font-bold mb-2" style={{ 
                      fontFamily: 'Playfair Display, serif',
                      textShadow: '1px 1px 2px rgba(139, 69, 19, 0.1)'
                    }}>
                      {tableNumber}
                    </h2>
                    <div className="w-8 h-px bg-amber-700/40 mx-auto"></div>
                  </div>

                  {/* Guest list with vintage styling */}
                  {guests.length > 0 ? (
                    <div className="space-y-3">
                      {guests.map((guest, guestIndex) => (
                        <div key={guest.id} className="text-center">
                          <div className="text-amber-800 text-sm font-medium tracking-wide" style={{ 
                            fontFamily: 'Cormorant Garamond, serif'
                          }}>
                            {guest.name}
                          </div>
                          {guestIndex < guests.length - 1 && (
                            <div className="flex justify-center mt-2">
                              <div className="w-6 h-px bg-amber-700/30"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-700/50 text-sm italic text-center font-light">
                      Fără invitați
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ModernDesign = () => (
    <div ref={selectedDesign === 'modern' ? seatingRef : null} className="relative" style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      minHeight: '600px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Modern geometric patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Geometric grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Modern corner accents */}
        <div className="absolute top-8 left-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M20 20L80 20L80 25L25 25L25 80L20 80Z" fill="url(#modernGradient1)" opacity="0.6"/>
            <rect x="15" y="15" width="15" height="15" fill="rgba(6, 182, 212, 0.4)" rx="2"/>
            <defs>
              <linearGradient id="modernGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }}/>
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }}/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute top-8 right-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M80 20L20 20L20 25L75 25L75 80L80 80Z" fill="url(#modernGradient2)" opacity="0.6"/>
            <rect x="70" y="15" width="15" height="15" fill="rgba(168, 85, 247, 0.4)" rx="2"/>
            <defs>
              <linearGradient id="modernGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.6 }}/>
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }}/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute bottom-8 left-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M20 80L80 80L80 75L25 75L25 20L20 20Z" fill="url(#modernGradient3)" opacity="0.6"/>
            <rect x="15" y="70" width="15" height="15" fill="rgba(236, 72, 153, 0.4)" rx="2"/>
            <defs>
              <linearGradient id="modernGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 0.6 }}/>
                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }}/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute bottom-8 right-8">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M80 80L20 80L20 75L75 75L75 20L80 20Z" fill="url(#modernGradient4)" opacity="0.6"/>
            <rect x="70" y="70" width="15" height="15" fill="rgba(34, 197, 94, 0.4)" rx="2"/>
            <defs>
              <linearGradient id="modernGradient4" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 0.6 }}/>
                <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.2 }}/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Central glass frame */}
        <div className="absolute inset-16 border border-white/20 rounded-2xl backdrop-blur-sm bg-white/5"></div>
      </div>

      <div className="relative z-10 p-20">
        {/* Futuristic Header */}
        <div className="text-center mb-20">
          {/* Tech-inspired top accent */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <div className="mx-6 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <div className="w-3 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>

          <div className="mb-8">
            <p className="text-slate-300/80 text-xs tracking-[0.5em] uppercase font-medium mb-8 font-mono">
              SEATING ARRANGEMENT
            </p>
          </div>
          
          <h1 className="text-7xl font-extralight text-white mb-8" style={{ 
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.02em',
            lineHeight: '0.9',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <span className="block">{brideName}</span>
            <div className="flex items-center justify-center my-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              <span className="mx-6 text-white/60 text-3xl font-thin">&</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
            <span className="block">{groomName}</span>
          </h1>

          {/* Futuristic date display */}
          <div className="flex items-center justify-center">
            <div className="px-6 py-3 bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 border border-white/20 rounded-xl backdrop-blur-md">
              <p className="text-slate-200 text-lg font-light tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                {weddingDate}
              </p>
            </div>
          </div>
        </div>

        {/* Modern Tables Grid */}
        <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">
          {tables.map((table, index) => {
            const guests = getGuestsForTable(table.id);
            const tableNumber = table.properties.label || `${index + 1}`;
            
            return (
              <div key={table.id} className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 via-slate-800/30 to-slate-900/40 border border-white/20 p-8 rounded-2xl backdrop-blur-md shadow-2xl group-hover:border-cyan-400/30 transition-all duration-300">
                  {/* Modern table header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                      <div className="mx-3 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                    </div>
                    
                    <h2 className="text-2xl font-light text-white tracking-wider mb-4" style={{
                      fontFamily: 'Inter, sans-serif',
                      background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {tableNumber}
                    </h2>
                    
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      <div className="mx-3 w-1 h-1 bg-white/40 rounded-full"></div>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Guest list with modern styling */}
                  {guests.length > 0 ? (
                    <div className="space-y-3">
                      {guests.map((guest, guestIndex) => (
                        <div key={guest.id} className="text-center">
                          <div className="text-slate-200/90 text-sm font-light tracking-wide py-2" style={{
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {guest.name}
                          </div>
                          {guestIndex < guests.length - 1 && (
                            <div className="flex items-center justify-center">
                              <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400/60 text-sm font-light text-center italic tracking-wide">
                      Fără invitați
                    </p>
                  )}

                  {/* Tech corner indicators */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-cyan-400/40 rounded-tl-sm"></div>
                  <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-blue-400/40 rounded-tr-sm"></div>
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-purple-400/40 rounded-bl-sm"></div>
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-pink-400/40 rounded-br-sm"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tech accent */}
        <div className="flex items-center justify-center mt-20">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
          <div className="mx-6 flex items-center space-x-2">
            <div className="w-1 h-1 rounded-full bg-slate-400/40"></div>
            <div className="w-2 h-px bg-slate-400/30"></div>
            <div className="w-1 h-1 rounded-full bg-slate-400/40"></div>
          </div>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );

  const FloralDesign = () => (
    <div ref={selectedDesign === 'floral' ? seatingRef : null} className="relative" style={{ 
      background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 30%, #fae8ff 70%, #f5f3ff 100%)',
      minHeight: '600px',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Enhanced floral decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large watercolor blooms */}
        <div className="absolute top-12 left-12">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            {/* Large central flower */}
            <ellipse cx="100" cy="100" rx="40" ry="15" fill="#f472b6" opacity="0.3" transform="rotate(0 100 100)"/>
            <ellipse cx="100" cy="100" rx="40" ry="15" fill="#ec4899" opacity="0.25" transform="rotate(45 100 100)"/>
            <ellipse cx="100" cy="100" rx="40" ry="15" fill="#be185d" opacity="0.2" transform="rotate(90 100 100)"/>
            <ellipse cx="100" cy="100" rx="40" ry="15" fill="#f472b6" opacity="0.25" transform="rotate(135 100 100)"/>
            <ellipse cx="100" cy="100" rx="40" ry="15" fill="#ec4899" opacity="0.3" transform="rotate(180 100 100)"/>
            <circle cx="100" cy="100" r="8" fill="#fbbf24" opacity="0.6"/>
            
            {/* Surrounding smaller flowers */}
            <ellipse cx="60" cy="60" rx="20" ry="8" fill="#a855f7" opacity="0.25" transform="rotate(30 60 60)"/>
            <ellipse cx="60" cy="60" rx="20" ry="8" fill="#7c3aed" opacity="0.2" transform="rotate(120 60 60)"/>
            <circle cx="60" cy="60" r="4" fill="#fbbf24" opacity="0.5"/>
            
            <ellipse cx="140" cy="140" rx="25" ry="10" fill="#f97316" opacity="0.3" transform="rotate(60 140 140)"/>
            <ellipse cx="140" cy="140" rx="25" ry="10" fill="#ea580c" opacity="0.25" transform="rotate(150 140 140)"/>
            <circle cx="140" cy="140" r="5" fill="#fbbf24" opacity="0.6"/>
            
            {/* Leaves and stems */}
            <ellipse cx="80" cy="130" rx="30" ry="8" fill="#22c55e" opacity="0.2" transform="rotate(-30 80 130)"/>
            <ellipse cx="120" cy="70" rx="35" ry="6" fill="#16a34a" opacity="0.25" transform="rotate(45 120 70)"/>
            <ellipse cx="150" cy="110" rx="28" ry="7" fill="#15803d" opacity="0.2" transform="rotate(-60 150 110)"/>
          </svg>
        </div>

        <div className="absolute top-16 right-16">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            {/* Roses cluster */}
            <ellipse cx="90" cy="90" rx="35" ry="35" fill="#fda4af" opacity="0.2" transform="rotate(15 90 90)"/>
            <ellipse cx="90" cy="90" rx="25" ry="25" fill="#fb7185" opacity="0.25" transform="rotate(45 90 90)"/>
            <ellipse cx="90" cy="90" rx="15" ry="15" fill="#e11d48" opacity="0.3" transform="rotate(75 90 90)"/>
            <circle cx="90" cy="90" r="6" fill="#be123c" opacity="0.4"/>
            
            {/* Side blooms */}
            <ellipse cx="50" cy="50" rx="20" ry="20" fill="#ddd6fe" opacity="0.3"/>
            <ellipse cx="50" cy="50" rx="12" ry="12" fill="#c4b5fd" opacity="0.4"/>
            <circle cx="50" cy="50" r="5" fill="#8b5cf6" opacity="0.5"/>
            
            <ellipse cx="130" cy="130" rx="18" ry="18" fill="#fed7d7" opacity="0.3"/>
            <ellipse cx="130" cy="130" rx="10" ry="10" fill="#f6ad55" opacity="0.4"/>
            <circle cx="130" cy="130" r="4" fill="#ed8936" opacity="0.5"/>
            
            {/* Botanical elements */}
            <path d="M60 100C70 85, 80 90, 90 100" stroke="#16a34a" strokeWidth="3" fill="none" opacity="0.3"/>
            <path d="M100 60C115 70, 110 80, 100 90" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.25"/>
            <ellipse cx="75" cy="92" rx="15" ry="5" fill="#15803d" opacity="0.2" transform="rotate(-45 75 92)"/>
          </svg>
        </div>

        <div className="absolute bottom-16 left-20">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            {/* Wildflowers */}
            <ellipse cx="80" cy="80" rx="30" ry="12" fill="#a78bfa" opacity="0.3" transform="rotate(0 80 80)"/>
            <ellipse cx="80" cy="80" rx="30" ry="12" fill="#8b5cf6" opacity="0.25" transform="rotate(60 80 80)"/>
            <ellipse cx="80" cy="80" rx="30" ry="12" fill="#7c3aed" opacity="0.2" transform="rotate(120 80 80)"/>
            <circle cx="80" cy="80" r="6" fill="#fbbf24" opacity="0.6"/>
            
            <ellipse cx="40" cy="120" rx="15" ry="15" fill="#fca5a5" opacity="0.35"/>
            <circle cx="40" cy="120" r="5" fill="#dc2626" opacity="0.4"/>
            
            <ellipse cx="120" cy="40" rx="20" ry="8" fill="#fde68a" opacity="0.4" transform="rotate(30 120 40)"/>
            <ellipse cx="120" cy="40" rx="20" ry="8" fill="#f59e0b" opacity="0.3" transform="rotate(150 120 40)"/>
            <circle cx="120" cy="40" r="4" fill="#d97706" opacity="0.5"/>
            
            {/* Grass and stems */}
            <path d="M20 140C25 120, 30 125, 35 140" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M140 120C135 100, 130 105, 125 120" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.25"/>
            <path d="M100 20C105 40, 110 35, 115 20" stroke="#15803d" strokeWidth="2" fill="none" opacity="0.2"/>
          </svg>
        </div>

        <div className="absolute bottom-12 right-12">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            {/* Cherry blossoms */}
            <ellipse cx="70" cy="70" rx="25" ry="8" fill="#fce7f3" opacity="0.4" transform="rotate(0 70 70)"/>
            <ellipse cx="70" cy="70" rx="25" ry="8" fill="#fbcfe8" opacity="0.35" transform="rotate(72 70 70)"/>
            <ellipse cx="70" cy="70" rx="25" ry="8" fill="#f9a8d4" opacity="0.3" transform="rotate(144 70 70)"/>
            <ellipse cx="70" cy="70" rx="25" ry="8" fill="#f472b6" opacity="0.25" transform="rotate(216 70 70)"/>
            <ellipse cx="70" cy="70" rx="25" ry="8" fill="#ec4899" opacity="0.2" transform="rotate(288 70 70)"/>
            <circle cx="70" cy="70" r="5" fill="#fbbf24" opacity="0.6"/>
            
            {/* Branch */}
            <path d="M20 120C40 100, 60 80, 80 60" stroke="#92400e" strokeWidth="4" fill="none" opacity="0.4"/>
            <ellipse cx="50" cy="95" rx="12" ry="4" fill="#16a34a" opacity="0.3" transform="rotate(-45 50 95)"/>
            <ellipse cx="65" cy="75" rx="10" ry="3" fill="#15803d" opacity="0.25" transform="rotate(-45 65 75)"/>
          </svg>
        </div>

        {/* Subtle floral pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-8.837-7.163-16-16-16s-16 7.163-16 16 7.163 16 16 16 16-7.163 16-16zm16-16c0-8.837-7.163-16-16-16s-16 7.163-16 16 7.163 16 16 16 16-7.163 16-16z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Flowing border frame */}
        <div className="absolute inset-16 border-2 border-pink-300/30 rounded-3xl shadow-inner"></div>
      </div>

      <div className="relative z-10 p-20">
        {/* Elegant floral header */}
        <div className="text-center mb-18">
          {/* Floral crown decoration */}
          <div className="flex items-center justify-center mb-10">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
              <ellipse cx="30" cy="30" rx="15" ry="6" fill="#f472b6" opacity="0.4" transform="rotate(-20 30 30)"/>
              <ellipse cx="30" cy="30" rx="15" ry="6" fill="#ec4899" opacity="0.3" transform="rotate(20 30 30)"/>
              <circle cx="30" cy="30" r="3" fill="#fbbf24" opacity="0.6"/>
              
              <ellipse cx="60" cy="20" rx="20" ry="8" fill="#a855f7" opacity="0.4" transform="rotate(0 60 20)"/>
              <ellipse cx="60" cy="20" rx="20" ry="8" fill="#8b5cf6" opacity="0.3" transform="rotate(60 60 20)"/>
              <ellipse cx="60" cy="20" rx="20" ry="8" fill="#7c3aed" opacity="0.25" transform="rotate(120 60 20)"/>
              <circle cx="60" cy="20" r="4" fill="#fbbf24" opacity="0.7"/>
              
              <ellipse cx="90" cy="30" rx="15" ry="6" fill="#f97316" opacity="0.4" transform="rotate(20 90 30)"/>
              <ellipse cx="90" cy="30" rx="15" ry="6" fill="#ea580c" opacity="0.3" transform="rotate(-20 90 30)"/>
              <circle cx="90" cy="30" r="3" fill="#fbbf24" opacity="0.6"/>
              
              {/* Connecting vine */}
              <path d="M20 35C35 25, 45 35, 60 30C75 25, 85 35, 100 35" stroke="#22c55e" strokeWidth="2" fill="none" opacity="0.4"/>
              <ellipse cx="40" cy="38" rx="8" ry="3" fill="#16a34a" opacity="0.3" transform="rotate(-30 40 38)"/>
              <ellipse cx="80" cy="38" rx="8" ry="3" fill="#15803d" opacity="0.3" transform="rotate(30 80 38)"/>
            </svg>
          </div>

          <div className="mb-8">
            <p className="text-pink-700/80 text-xs tracking-[0.4em] uppercase font-medium mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Aranjament cu Dragoste
            </p>
          </div>
          
          <h1 className="text-6xl text-rose-800 mb-8" style={{ 
            fontFamily: 'Great Vibes, cursive',
            textShadow: '2px 2px 4px rgba(190, 24, 93, 0.1)',
            lineHeight: '1.2'
          }}>
            <span className="block">{brideName}</span>
            <div className="flex items-center justify-center my-4">
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                <ellipse cx="20" cy="10" rx="8" ry="3" fill="#f472b6" opacity="0.5" transform="rotate(0 20 10)"/>
                <ellipse cx="20" cy="10" rx="8" ry="3" fill="#ec4899" opacity="0.4" transform="rotate(45 20 10)"/>
                <circle cx="20" cy="10" r="2" fill="#be185d" opacity="0.6"/>
              </svg>
            </div>
            <span className="block">{groomName}</span>
          </h1>

          {/* Garden-style date display */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-50/90 via-purple-50/80 to-pink-50/90 border-2 border-pink-200/40 rounded-2xl backdrop-blur-sm shadow-lg">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-3">
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#f472b6" opacity="0.5" transform="rotate(0 10 10)"/>
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#ec4899" opacity="0.4" transform="rotate(60 10 10)"/>
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#be185d" opacity="0.3" transform="rotate(120 10 10)"/>
                <circle cx="10" cy="10" r="2" fill="#fbbf24" opacity="0.7"/>
              </svg>
              <p className="text-rose-800 text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
                {weddingDate}
              </p>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-3">
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#a855f7" opacity="0.5" transform="rotate(0 10 10)"/>
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#8b5cf6" opacity="0.4" transform="rotate(60 10 10)"/>
                <ellipse cx="10" cy="10" rx="6" ry="2" fill="#7c3aed" opacity="0.3" transform="rotate(120 10 10)"/>
                <circle cx="10" cy="10" r="2" fill="#fbbf24" opacity="0.7"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Garden-style tables grid */}
        <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {tables.map((table, index) => {
            const guests = getGuestsForTable(table.id);
            const tableNumber = table.properties.label || `Masa ${index + 1}`;
            
            return (
              <div key={table.id} className="group relative">
                {/* Floating flower decoration */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <ellipse cx="16" cy="16" rx="10" ry="4" fill="#f472b6" opacity="0.6" transform="rotate(0 16 16)"/>
                    <ellipse cx="16" cy="16" rx="10" ry="4" fill="#ec4899" opacity="0.5" transform="rotate(45 16 16)"/>
                    <ellipse cx="16" cy="16" rx="10" ry="4" fill="#be185d" opacity="0.4" transform="rotate(90 16 16)"/>
                    <ellipse cx="16" cy="16" rx="10" ry="4" fill="#f472b6" opacity="0.5" transform="rotate(135 16 16)"/>
                    <circle cx="16" cy="16" r="3" fill="#fbbf24" opacity="0.8"/>
                  </svg>
                </div>

                {/* Enchanted table card */}
                <div className="relative bg-gradient-to-br from-white/90 via-pink-50/80 to-purple-50/70 border-3 border-pink-200/40 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                  {/* Floral corner accents */}
                  <div className="absolute top-3 left-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#f472b6" opacity="0.4" transform="rotate(45 8 8)"/>
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#ec4899" opacity="0.3" transform="rotate(-45 8 8)"/>
                      <circle cx="8" cy="8" r="1.5" fill="#fbbf24" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#a855f7" opacity="0.4" transform="rotate(45 8 8)"/>
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#8b5cf6" opacity="0.3" transform="rotate(-45 8 8)"/>
                      <circle cx="8" cy="8" r="1.5" fill="#fbbf24" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#f97316" opacity="0.4" transform="rotate(45 8 8)"/>
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#ea580c" opacity="0.3" transform="rotate(-45 8 8)"/>
                      <circle cx="8" cy="8" r="1.5" fill="#fbbf24" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#22c55e" opacity="0.4" transform="rotate(45 8 8)"/>
                      <ellipse cx="8" cy="8" rx="5" ry="2" fill="#16a34a" opacity="0.3" transform="rotate(-45 8 8)"/>
                      <circle cx="8" cy="8" r="1.5" fill="#fbbf24" opacity="0.6"/>
                    </svg>
                  </div>

                  {/* Table header with floral accents */}
                  <div className="text-center mb-6 pt-4">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mx-3">
                        <ellipse cx="8" cy="8" rx="4" ry="1.5" fill="#f472b6" opacity="0.5" transform="rotate(0 8 8)"/>
                        <ellipse cx="8" cy="8" rx="4" ry="1.5" fill="#ec4899" opacity="0.4" transform="rotate(90 8 8)"/>
                        <circle cx="8" cy="8" r="1" fill="#fbbf24" opacity="0.7"/>
                      </svg>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
                    </div>
                    
                    <h2 className="text-2xl text-rose-800 font-semibold mb-3" style={{ 
                      fontFamily: 'Playfair Display, serif',
                      textShadow: '1px 1px 2px rgba(190, 24, 93, 0.1)'
                    }}>
                      {tableNumber}
                    </h2>
                    
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
                      <div className="mx-3 w-2 h-2 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 opacity-60"></div>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
                    </div>
                  </div>

                  {/* Guest list with garden styling */}
                  {guests.length > 0 ? (
                    <div className="space-y-3">
                      {guests.map((guest, guestIndex) => (
                        <div key={guest.id} className="text-center">
                          <div className="text-rose-700 text-sm font-medium tracking-wide py-1" style={{ 
                            fontFamily: 'Cormorant Garamond, serif'
                          }}>
                            {guest.name}
                          </div>
                          {guestIndex < guests.length - 1 && (
                            <div className="flex items-center justify-center mt-2">
                              <div className="w-6 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-2">
                                <ellipse cx="6" cy="6" rx="3" ry="1" fill="#f472b6" opacity="0.4" transform="rotate(0 6 6)"/>
                                <ellipse cx="6" cy="6" rx="3" ry="1" fill="#ec4899" opacity="0.3" transform="rotate(90 6 6)"/>
                                <circle cx="6" cy="6" r="0.5" fill="#fbbf24" opacity="0.6"/>
                              </svg>
                              <div className="w-6 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-rose-500/60 text-sm italic text-center font-light">
                      Fără invitați
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Garden footer */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
              <ellipse cx="15" cy="15" rx="8" ry="3" fill="#f472b6" opacity="0.3" transform="rotate(-20 15 15)"/>
              <ellipse cx="15" cy="15" rx="8" ry="3" fill="#ec4899" opacity="0.25" transform="rotate(20 15 15)"/>
              <circle cx="15" cy="15" r="2" fill="#fbbf24" opacity="0.5"/>
              
              <ellipse cx="30" cy="12" rx="10" ry="4" fill="#a855f7" opacity="0.3" transform="rotate(0 30 12)"/>
              <ellipse cx="30" cy="12" rx="10" ry="4" fill="#8b5cf6" opacity="0.25" transform="rotate(60 30 12)"/>
              <circle cx="30" cy="12" r="2.5" fill="#fbbf24" opacity="0.6"/>
              
              <ellipse cx="45" cy="15" rx="8" ry="3" fill="#22c55e" opacity="0.3" transform="rotate(20 45 15)"/>
              <ellipse cx="45" cy="15" rx="8" ry="3" fill="#16a34a" opacity="0.25" transform="rotate(-20 45 15)"/>
              <circle cx="45" cy="15" r="2" fill="#fbbf24" opacity="0.5"/>
              
              <path d="M5 18C15 12, 25 18, 35 15C45 12, 50 18, 55 18" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.4"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Full popup view with design options
  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-elegant text-charcoal flex items-center gap-2">
              <FileText className="w-4 h-4 text-blush-400" />
              <span>Aranjament Mese</span>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={generatePDF}
                className="bg-blush-500 hover:bg-blush-600 text-white font-elegant"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Descarcă PDF
              </Button>
              <Button
                onClick={generateHTML}
                variant="outline"
                className="border-blush-300 text-blush-600 hover:bg-blush-50 font-elegant"
                size="sm"
              >
                <Code className="w-4 h-4 mr-2" />
                Descarcă HTML
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Design Selection Tabs */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <Tabs value={selectedDesign} onValueChange={setSelectedDesign} className="w-full">
            <div className="border-b border-gray-200 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="botanical" className="font-elegant text-xs">
                  Botanical
                </TabsTrigger>
                <TabsTrigger value="luxe" className="font-elegant text-xs">
                  Luxe
                </TabsTrigger>
                <TabsTrigger value="vintage" className="font-elegant text-xs">
                  Vintage
                </TabsTrigger>
                <TabsTrigger value="modern" className="font-elegant text-xs">
                  Modern
                </TabsTrigger>
                <TabsTrigger value="floral" className="font-elegant text-xs">
                  Floral
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="botanical" className="m-0">
              <BotanicalDesign />
            </TabsContent>

            <TabsContent value="luxe" className="m-0">
              <LuxeDesign />
            </TabsContent>

            <TabsContent value="vintage" className="m-0">
              <VintageDesign />
            </TabsContent>

            <TabsContent value="modern" className="m-0">
              <ModernDesign />
            </TabsContent>

            <TabsContent value="floral" className="m-0">
              <FloralDesign />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TableSeatingDisplay;