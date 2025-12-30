'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Menu, Bell } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

const Calendar = () => {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const upcomingEvents = [
    {
      id: 1,
      title: 'Întâlnire cu Fotograful',
      date: '15 Iunie 2024',
      time: '14:00',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Degustare Meniu',
      date: '20 Iunie 2024',
      time: '12:00',
      type: 'tasting'
    },
    {
      id: 3,
      title: 'Probă Rochie',
      date: '25 Iunie 2024',
      time: '11:00',
      type: 'fitting'
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card className="border-blush-100">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blush-400" />
                  Calendar Evenimente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-blush-100"
                />
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-blush-100">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-charcoal flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blush-400" />
                  Evenimente Următoare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center p-3 bg-ivory rounded-lg hover:bg-blush-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-charcoal">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-charcoal/70">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{event.date}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar; 