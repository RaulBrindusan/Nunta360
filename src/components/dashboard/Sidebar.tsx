'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  Heart,
  CreditCard,
  X,
  BarChart3,
  Clock,
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
      path: '/dashboard',
      description: 'Wedding planning overview and progress'
    },
    { 
      icon: Clock, 
      label: t('dashboard.timeline'), 
      path: '/dashboard/timeline',
      description: 'Wedding timeline and calendar events'
    },
    { 
      icon: Users, 
      label: t('dashboard.guests'), 
      path: '/dashboard/guests',
      description: 'Guest list management and RSVPs'
    },
    { 
      icon: CreditCard, 
      label: t('dashboard.budget'), 
      path: '/dashboard/budget',
      description: 'Budget tracking and expense management'
    },
    { 
      icon: Settings, 
      label: t('dashboard.settings'), 
      path: '/dashboard/settings',
      description: 'Account and wedding settings'
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-screen lg:h-auto w-64 bg-white border-r border-blush-100 transition-transform duration-300 ease-in-out z-50 lg:z-auto flex flex-col`}
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
                  {user.email?.split('@')[0] || 'Wedding Planner'}
                </p>
                <p className="text-xs text-charcoal/60">Planning your perfect day</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path || 
                  (item.path === '/dashboard' && pathname === '/dashboard');
                
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className={`group flex flex-col px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blush-100 text-blush-700 shadow-sm' 
                        : 'text-charcoal/70 hover:bg-blush-50 hover:text-blush-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon 
                        size={20} 
                        className={`${isActive ? 'text-blush-600' : 'text-charcoal/50 group-hover:text-blush-500'}`} 
                      />
                      <span className="ml-3">{item.label}</span>
                    </div>
                    <p className={`text-xs mt-1 ml-8 ${
                      isActive ? 'text-blush-600/80' : 'text-charcoal/40 group-hover:text-blush-500/80'
                    }`}>
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer with Logout */}
          <div className="border-t border-blush-100 p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 text-charcoal/70 hover:text-red-600 hover:bg-red-50 py-3 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">{t('dashboard.logout')}</span>
            </Button>
            
            {/* Project Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-charcoal/40">Nunta360 v1.0</p>
              <p className="text-xs text-charcoal/30">Wedding Planning Platform</p>
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