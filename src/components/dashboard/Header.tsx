'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar, title }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-blush-100 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSidebar}
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

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white border-b border-blush-100 p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-medium text-2xl text-charcoal mb-1">{title}</h1>
          <p className="text-charcoal/70">{t('dashboard.weddingDate')}: 15.08.2024</p>
        </div>
      </header>
    </>
  );
};

export default Header; 