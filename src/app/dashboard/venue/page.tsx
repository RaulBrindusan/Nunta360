'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import VenueEditor from '@/components/venue-editor/VenueEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone } from 'lucide-react';

const VenuePage = () => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet', 'phone'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth < 1024; // lg breakpoint
      
      setIsMobile(isMobileUA || isSmallScreen);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6">
          <h1 className="text-2xl lg:text-3xl font-wedding text-charcoal mb-1 lg:mb-2">
            Editor Locație
          </h1>
          <p className="text-charcoal/60 text-sm lg:text-base font-elegant">
            Creează și gestionează amplasarea meselor și decorațiunilor pentru nunta ta
          </p>
        </div>

        {/* Mobile Message or Venue Editor */}
        <div className="flex-1">
          {isMobile ? (
            <Card className="h-full border-gray-200 bg-white shadow-sm">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6">
                  <Monitor className="w-16 h-16 text-blush-400 mx-auto mb-4" />
                  <Smartphone className="w-8 h-8 text-charcoal/40 mx-auto" />
                </div>
                
                <h2 className="text-xl font-wedding text-charcoal mb-4">
                  Editor disponibil doar pe desktop
                </h2>
                
                <p className="text-charcoal/70 font-elegant mb-6 max-w-md leading-relaxed">
                  Pentru o experiență optimă de editare a amplasării locației, te rugăm să accesezi 
                  această funcționalitate de pe un computer sau laptop.
                </p>
                
                <div className="bg-blush-50 border border-blush-200 rounded-lg p-4 max-w-sm">
                  <p className="text-sm text-blush-700 font-elegant">
                    💡 <strong>Sfat:</strong> Folosește un ecran mai mare pentru a plasa cu ușurință 
                    mesele și decorațiunile pentru ziua ta specială.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <VenueEditor />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VenuePage;