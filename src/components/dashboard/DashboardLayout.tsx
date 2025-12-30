'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import Sidebar from './Sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showWeddingInfo?: boolean;
  headerLeft?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  showWeddingInfo = true,
  headerLeft
}) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
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
          <Button
            onClick={handleLogoutClick}
            variant="ghost"
            size="sm"
            className="text-charcoal/70 hover:text-red-600"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side content (e.g., search bar) */}
            <div className="flex items-center">
              {headerLeft}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-charcoal/70">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-charcoal/70 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
                Deconectare
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-ivory via-blush-50/20 to-sage-50/20">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white border-blush-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-charcoal font-serif">
              Confirmare Deconectare
            </AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal/70">
              Ești sigur că vrei să te deconectezi? Vei fi redirecționat către pagina principală.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">
              Nu
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-blush-500 hover:bg-blush-600 text-white"
            >
              Da
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;