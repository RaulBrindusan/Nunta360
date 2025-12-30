'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGuests } from '@/hooks/useGuests';
import { useWeddingDetails } from '@/hooks/useWeddingDetails';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { Timestamp } from 'firebase/firestore';
import { formatCurrency } from '@/lib/formatNumber';
import {
  Heart,
  Users,
  Calendar,
  Plus,
  Euro,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WeddingDetailsModal from '@/components/dashboard/WeddingDetailsModal';
import TotalBudgetModal from '@/components/modals/TotalBudgetModal';

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { guests, loading: guestsLoading } = useGuests();
  const { weddingDetails, loading: weddingLoading } = useWeddingDetails();
  const { budget, loading: budgetLoading, saveBudget } = useBudget();
  const { expenses, loading: expensesLoading } = useExpenses();
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get cached names from localStorage for instant display
  const [cachedNames, setCachedNames] = useState<{ groom: string; bride: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('weddingNames');
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });

  // Update localStorage when wedding details are loaded
  useEffect(() => {
    if (weddingDetails?.groomName && weddingDetails?.brideName) {
      const names = {
        groom: weddingDetails.groomName,
        bride: weddingDetails.brideName
      };
      localStorage.setItem('weddingNames', JSON.stringify(names));
      setCachedNames(names);
    }
  }, [weddingDetails]);

  // Generate welcome names
  const getWelcomeNames = () => {
    if (weddingDetails?.groomName && weddingDetails?.brideName) {
      return `${weddingDetails.groomName} & ${weddingDetails.brideName}`;
    } else if (cachedNames?.groom && cachedNames?.bride) {
      return `${cachedNames.groom} & ${cachedNames.bride}`;
    }
    return user?.email?.split('@')[0] || 'utilizator';
  };

  const welcomeNames = getWelcomeNames();

  // Show wedding modal if no wedding details
  useEffect(() => {
    if (!weddingLoading && !weddingDetails) {
      setShowWeddingModal(true);
    }
  }, [weddingLoading, weddingDetails]);

  // Calculate days remaining until wedding
  const calculateDaysRemaining = (weddingDate: Timestamp) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const wedding = weddingDate.toDate();
    wedding.setHours(0, 0, 0, 0);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate total number of people (guests + family members)
  const calculateTotalGuests = () => {
    return guests.reduce((total, guest) => total + guest.familySize, 0);
  };

  // Format date as "12 Iulie, 2026"
  const formatWeddingDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // Update current date at midnight to refresh countdown
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
      // Set up daily updates
      const dailyInterval = setInterval(() => {
        setCurrentDate(new Date());
      }, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const handleWeddingDetailsSuccess = () => {
    setShowWeddingModal(false);
  };

  const handleBudgetSave = async (amount: number, categories: any[]) => {
    await saveBudget(amount);
    // Categories are not saved from dashboard, only from budget page
    setShowBudgetModal(false);
  };

  if (weddingLoading || budgetLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-charcoal/60">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const daysRemaining = weddingDetails?.weddingDate
    ? calculateDaysRemaining(weddingDetails.weddingDate)
    : 0;
  const totalGuests = calculateTotalGuests();

  // Calculate budget summary
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.price, 0);
  const remainingBudget = budget ? budget.totalBudget - totalSpent : 0;
  const spentPercentage = budget && budget.totalBudget > 0
    ? (totalSpent / budget.totalBudget) * 100
    : 0;

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-wedding text-charcoal mb-2">
          Bun venit, {welcomeNames}!
        </h1>
        <p className="text-charcoal/60 text-base font-elegant">
          Gestionează și planifică fiecare detaliu al nunții tale perfecte
        </p>
      </div>

      {/* Main Dashboard Cards */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-2xl w-full">
          {/* Wedding Details Card */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="flex items-center justify-between text-lg font-elegant font-medium text-charcoal">
                <span>Detalii Nuntă</span>
                <Heart className="w-5 h-5 text-blush-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              {weddingDetails ? (
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-lg text-charcoal/70 w-24 font-elegant">Mireasă:</span>
                    <span className="text-lg font-medium text-charcoal font-elegant">{weddingDetails.brideName}</span>
                  </div>
                  <div className="flex">
                    <span className="text-lg text-charcoal/70 w-24 font-elegant">Mire:</span>
                    <span className="text-lg font-medium text-charcoal font-elegant">{weddingDetails.groomName}</span>
                  </div>
                  <div className="flex">
                    <span className="text-lg text-charcoal/70 w-24 font-elegant">Data:</span>
                    <span className="text-lg font-medium text-charcoal font-elegant">
                      {weddingDetails.weddingDate
                        ? formatWeddingDate(weddingDetails.weddingDate)
                        : 'Nicio dată setată'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-base text-charcoal/60 mb-4 font-elegant">Nu ai setat încă detaliile nunții</p>
                  <Button
                    onClick={() => setShowWeddingModal(true)}
                    size="default"
                    className="bg-blush-400 hover:bg-blush-500 text-white text-sm px-4 py-2 font-elegant"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adaugă Detalii
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guests Card */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="flex items-center justify-between text-lg font-elegant font-medium text-charcoal">
                <span>Invitați</span>
                <Users className="w-5 h-5 text-blush-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0 pb-6">
              <div className="text-6xl font-bold text-charcoal mb-2 font-elegant">
                {guestsLoading ? '--' : totalGuests}
              </div>
              <p className="text-base text-charcoal/60 font-elegant">Total Invitați</p>
            </CardContent>
          </Card>

          {/* Countdown Card */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="flex items-center justify-between text-lg font-elegant font-medium text-charcoal">
                <span>Numărătoare Inversă</span>
                <Calendar className="w-5 h-5 text-blush-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0 pb-6">
              <div className="text-6xl font-bold text-charcoal mb-2 font-elegant">
                {weddingDetails?.weddingDate ? Math.abs(daysRemaining) : '--'}
              </div>
              <p className="text-base text-charcoal/60 font-elegant">
                {!weddingDetails?.weddingDate
                  ? 'Setează data nunții'
                  : daysRemaining > 0
                    ? 'Zile Rămase'
                    : daysRemaining === 0
                      ? 'Astăzi este ziua!'
                      : 'Zile de la nuntă'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Section */}
      <div className="flex justify-center mt-8">
        <div className="max-w-screen-2xl w-full">
          {!budget ? (
            /* No budget - show add button */
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Euro className="w-16 h-16 text-blush-300 mb-4" />
                <h3 className="text-xl font-elegant font-medium text-charcoal mb-2">
                  Niciun buget setat
                </h3>
                <p className="text-base text-charcoal/60 mb-6 text-center font-elegant">
                  Începe prin a seta bugetul total pentru nunta ta
                </p>
                <Button
                  onClick={() => setShowBudgetModal(true)}
                  className="bg-blush-400 hover:bg-blush-500 text-white font-elegant"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă Buget
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Budget exists - show budget summary */
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-elegant font-medium text-charcoal flex items-center gap-2">
                  <Euro className="h-5 w-5 text-blush-400" />
                  Rezumat Buget
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-blush-400 hover:bg-blush-500 text-white"
                  onClick={() => window.location.href = '/dashboard/budget'}
                >
                  <Euro className="h-4 w-4 mr-2" />
                  Vezi Bugetul
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Budget */}
                  <div className="space-y-2">
                    <p className="text-sm text-charcoal/60 font-elegant">Buget Total</p>
                    <div className="text-3xl font-bold text-charcoal font-elegant">
                      €{formatCurrency(budget.totalBudget)}
                    </div>
                  </div>

                  {/* Total Spent */}
                  <div className="space-y-2">
                    <p className="text-sm text-charcoal/60 font-elegant">Total Cheltuit</p>
                    <div className="text-3xl font-bold text-blush-500 font-elegant">
                      €{formatCurrency(totalSpent)}
                    </div>
                  </div>

                  {/* Remaining Budget */}
                  <div className="space-y-2">
                    <p className="text-sm text-charcoal/60 font-elegant">Buget Rămas</p>
                    <div className={`text-3xl font-bold font-elegant ${
                      remainingBudget >= 0 ? 'text-sage-600' : 'text-red-500'
                    }`}>
                      €{formatCurrency(Math.abs(remainingBudget))}
                      {remainingBudget < 0 && <span className="text-sm ml-1">(depășit)</span>}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-charcoal/60 font-elegant">
                    <span>Progres cheltuieli</span>
                    <span>{spentPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        spentPercentage > 100
                          ? 'bg-red-500'
                          : spentPercentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-sage-500'
                      }`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Wedding Details Modal */}
      <WeddingDetailsModal
        isOpen={showWeddingModal}
        onClose={() => setShowWeddingModal(false)}
        onSuccess={handleWeddingDetailsSuccess}
      />

      {/* Budget Modal */}
      <TotalBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleBudgetSave}
        currentBudget={budget?.totalBudget}
        existingCategories={[]}
      />
    </DashboardLayout>
  );
};

export default Dashboard; 