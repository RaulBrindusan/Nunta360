'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showWeddingInfo?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title,
  subtitle,
  showWeddingInfo = true 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-ivory flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-blush-100 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="text-charcoal/70 hover:text-blush-400"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-2xl font-serif font-bold text-charcoal">
            Nunta<span className="text-blush-400">360</span>
          </h1>
          <Button variant="ghost" size="sm" className="text-charcoal/70 hover:text-blush-400">
            <Bell size={20} />
          </Button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-blush-100 p-4">
          <div className="flex flex-col items-center justify-center text-center">
            {showWeddingInfo ? (
              <>
                <p className="font-medium text-2xl text-charcoal mb-1">Maria & Alexandru</p>
                <p className="text-charcoal/70">{t('dashboard.weddingDate')}: 15.08.2024</p>
              </>
            ) : (
              <>
                {title && <h1 className="font-medium text-2xl text-charcoal mb-1">{title}</h1>}
                {subtitle && <p className="text-charcoal/70">{subtitle}</p>}
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-ivory via-blush-50/20 to-sage-50/20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;