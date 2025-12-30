'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Users,
  Settings,
  Heart,
  CreditCard,
  X,
  BarChart3,
  MapPin,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      icon: Heart,
      label: t('dashboard.overview'),
      path: '/dashboard'
    },
    {
      icon: Users,
      label: t('dashboard.guests'),
      path: '/dashboard/guests'
    },
    {
      icon: MapPin,
      label: t('dashboard.venue'),
      path: '/dashboard/venue'
    },
    {
      icon: CreditCard,
      label: t('dashboard.budget'),
      path: '/dashboard/budget'
    },
    {
      icon: Settings,
      label: t('dashboard.settings'),
      path: '/dashboard/settings'
    },
  ];

  return (
    <>
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-screen lg:h-auto w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-50 lg:z-auto flex flex-col shadow-lg lg:shadow-none`}
      >
        <div className="flex flex-col h-full lg:min-h-screen">
          {/* Header */}
          <div className="p-4 flex items-center justify-between lg:justify-center border-b border-blush-100">
            <h1 className="text-2xl font-serif font-bold text-charcoal">
              Nunta<span className="text-blush-400">360</span>
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-charcoal/70 hover:text-blush-400"
            >
              <X size={20} />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-blush-50 to-sage-50 border-b border-blush-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-blush-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6 text-blush-600" />
                </div>
                <p className="text-sm font-medium text-charcoal">
                  Planning your perfect day
                </p>
                <p className="text-xs text-charcoal/60">Wedding Planner</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path || 
                  (item.path === '/dashboard' && pathname === '/dashboard');
                
                return (
                  <Link
                    key={item.label}
                    href={item.path}
                    onClick={onClose}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-blush-100 text-blush-700 shadow-sm border border-blush-200' 
                        : 'text-charcoal/70 hover:bg-gray-50 hover:text-blush-600'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      className={`${isActive ? 'text-blush-600' : 'text-charcoal/50 group-hover:text-blush-500'}`} 
                    />
                    <span className="ml-3 font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-blush-100 p-4">
            {/* Project Info */}
            <div className="text-center">
              <p className="text-xs text-charcoal/40">Nunta360 v1.0</p>
              <p className="text-xs text-charcoal/30 flex items-center justify-center gap-1">
                Made by Codemint
                <Heart className="w-3 h-3 text-blush-400 fill-blush-400" />
                @2025
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar; 