import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Menu,
  Bell,
  Plus,
  DollarSign,
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';

const Budget = () => {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const totalBudget = 50000;
  const spentBudget = 32500;
  const remainingBudget = totalBudget - spentBudget;
  const budgetProgress = (spentBudget / totalBudget) * 100;

  const categories = [
    { name: 'Locație & Catering', allocated: 25000, spent: 18000 },
    { name: 'Decorațiuni & Flori', allocated: 8000, spent: 5500 },
    { name: 'Fotograf & Videograf', allocated: 6000, spent: 4000 },
    { name: 'Muzică & Entertainment', allocated: 4000, spent: 2000 },
    { name: 'Rochie & Costum', allocated: 5000, spent: 3000 },
    { name: 'Altele', allocated: 2000, spent: 0 },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: 'Avans Locație',
      amount: -10000,
      date: '2024-03-15',
      category: 'Locație & Catering',
    },
    {
      id: 2,
      description: 'Avans Fotograf',
      amount: -2000,
      date: '2024-03-14',
      category: 'Fotograf & Videograf',
    },
    {
      id: 3,
      description: 'Decorațiuni Sală',
      amount: -1500,
      date: '2024-03-13',
      category: 'Decorațiuni & Flori',
    },
  ];

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
      <div className="flex-1">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-blush-100 p-4">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="font-medium text-2xl text-charcoal mb-1">Maria & Alexandru</p>
            <p className="text-charcoal/70">{t('dashboard.weddingDate')}: 15.08.2024</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 bg-gradient-to-br from-ivory via-blush-50/20 to-sage-50/20">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border-blush-100">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blush-400" />
                  Buget Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal">€{totalBudget.toLocaleString()}</div>
                <Progress value={budgetProgress} className="mt-4 bg-blush-100" indicatorClassName="bg-blush-400" />
              </CardContent>
            </Card>

            <Card className="border-blush-100">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                  <ArrowDownCircle className="h-5 w-5 text-green-500" />
                  Cheltuieli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">€{spentBudget.toLocaleString()}</div>
                <p className="text-sm text-charcoal/70 mt-2">{budgetProgress.toFixed(1)}% din buget folosit</p>
              </CardContent>
            </Card>

            <Card className="border-blush-100">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5 text-blush-400" />
                  Rămas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blush-400">€{remainingBudget.toLocaleString()}</div>
                <p className="text-sm text-charcoal/70 mt-2">{(100 - budgetProgress).toFixed(1)}% din buget rămas</p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Categories */}
          <Card className="border-blush-100 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blush-400" />
                Categorii Buget
              </CardTitle>
              <Button className="bg-blush-400 hover:bg-blush-500">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Categorie
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => {
                  const progress = (category.spent / category.allocated) * 100;
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-charcoal">{category.name}</span>
                        <span className="text-sm text-charcoal/70">
                          €{category.spent.toLocaleString()} / €{category.allocated.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="bg-blush-100"
                        indicatorClassName={progress > 90 ? 'bg-red-400' : 'bg-blush-400'}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-blush-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blush-400" />
                Tranzacții Recente
              </CardTitle>
              <Button className="bg-blush-400 hover:bg-blush-500">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Tranzacție
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-charcoal">{transaction.description}</div>
                      <div className="text-sm text-charcoal/70">{transaction.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-500">
                        €{Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <div className="text-sm text-charcoal/70">
                        {new Date(transaction.date).toLocaleDateString('ro-RO')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Budget; 