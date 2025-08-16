import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Clock,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const { t } = useLanguage();

  const upcomingTasks = [
    { id: 1, title: 'Contact Photographer', due: '2024-06-15', status: 'pending' },
    { id: 2, title: 'Venue Visit', due: '2024-06-20', status: 'pending' },
    { id: 3, title: 'Menu Tasting', due: '2024-07-01', status: 'completed' },
  ];

  const stats = [
    { title: t('dashboard.daysLeft'), value: '245', icon: Clock },
    { title: t('dashboard.guestList'), value: '120/150', icon: Users },
    { title: t('dashboard.budgetUsed'), value: '€15,000', icon: CreditCard },
    { title: t('dashboard.tasksDone'), value: '24/36', icon: CheckCircle },
  ];

  return (
    <DashboardLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-blush-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-charcoal/70">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-blush-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Planning Progress and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-blush-100">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-charcoal">{t('dashboard.planningProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: t('dashboard.venue'), progress: 80 },
                { label: t('dashboard.decorations'), progress: 60 },
                { label: t('dashboard.guestList'), progress: 90 },
                { label: t('dashboard.music'), progress: 40 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal/70">{item.label}</span>
                    <span className="text-charcoal font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="bg-blush-100" indicatorClassName="bg-blush-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-blush-100">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-charcoal">{t('dashboard.upcomingTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-400' : 'bg-blush-400'
                      }`}
                    />
                    <span className="text-charcoal">{task.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-charcoal/70">{task.due}</span>
                    <ChevronRight size={16} className="text-charcoal/40" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 