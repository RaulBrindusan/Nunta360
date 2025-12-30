'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, TrendingUp } from 'lucide-react';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const BudgetChart = () => {
  // Mock data - this would come from your actual budget state/database
  const mockData: BudgetCategory[] = [
    { name: 'Locație & Catering', allocated: 25000, spent: 18000, color: 'bg-blush-400' },
    { name: 'Decorațiuni & Flori', allocated: 8000, spent: 5500, color: 'bg-sage-400' },
    { name: 'Fotograf & Videograf', allocated: 6000, spent: 4000, color: 'bg-dustyRose-400' },
    { name: 'Muzică & Entertainment', allocated: 4000, spent: 2000, color: 'bg-blush-300' },
    { name: 'Rochie & Costum', allocated: 5000, spent: 3000, color: 'bg-sage-300' },
    { name: 'Altele', allocated: 2000, spent: 0, color: 'bg-charcoal/20' },
  ];

  const totalAllocated = mockData.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = mockData.reduce((sum, cat) => sum + cat.spent, 0);
  const overallProgress = (totalSpent / totalAllocated) * 100;

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-elegant font-medium text-charcoal">
          <span>Buget Nuntă</span>
          <PieChart className="w-6 h-6 text-blush-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Overall Budget Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blush-50 to-sage-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-base text-charcoal/70 font-elegant">Total Buget</p>
              <p className="text-3xl font-bold text-charcoal font-elegant">€{totalAllocated.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-base text-charcoal/70 font-elegant">Cheltuit</p>
              <p className="text-3xl font-bold text-green-600 font-elegant">€{totalSpent.toLocaleString()}</p>
            </div>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-3 bg-gray-200" 
          />
          <p className="text-base text-charcoal/60 mt-2 font-elegant">
            {overallProgress.toFixed(1)}% din buget folosit
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blush-400" />
            <h4 className="text-lg font-elegant font-medium text-charcoal">Categorii</h4>
          </div>
          
          {mockData.map((category) => {
            const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
            const remaining = category.allocated - category.spent;
            
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-base font-elegant text-charcoal">{category.name}</span>
                  </div>
                  <span className="text-base text-charcoal/70 font-elegant">
                    €{category.spent.toLocaleString()} / €{category.allocated.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2 bg-gray-200"
                  style={{
                    '--progress-foreground': progress > 90 ? '#ef4444' : category.color.replace('bg-', 'var(--color-')
                  } as React.CSSProperties}
                />
                <div className="flex justify-between text-sm text-charcoal/60 font-elegant">
                  <span>{progress.toFixed(1)}% folosit</span>
                  <span>Rămas: €{remaining.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;