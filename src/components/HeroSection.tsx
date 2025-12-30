'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-ivory via-blush-50 to-sage-50 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-charcoal leading-tight mb-6">
              {t('hero.title')}{' '}
              <span className="text-blush-400">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-lg lg:text-xl text-charcoal/80 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  {t('hero.startPlanning')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-blush-200 to-dustyRose-200 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blush-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💕</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{t('hero.planningTitle')}</h3>
                    <p className="text-charcoal/60 text-sm">{t('hero.planningSubtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                    <span className="text-charcoal font-medium">{t('hero.guestList')}</span>
                    <span className="text-sage-600 font-bold">120/150</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blush-50 rounded-lg">
                    <span className="text-charcoal font-medium">{t('hero.budget')}</span>
                    <span className="text-blush-500 font-bold">€15,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-dustyRose-50 rounded-lg">
                    <span className="text-charcoal font-medium">{t('hero.vendors')}</span>
                    <span className="text-dustyRose-500 font-bold">8/12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
