
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-r from-blush-200 via-dustyRose-200 to-sage-200">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
            {t('cta.title')}
            <span className="text-white"> {t('cta.titleAccent')}</span>
          </h2>
          <p className="text-lg lg:text-xl text-charcoal/80 mb-8">
            {t('cta.subtitle')}
          </p>
          <Button className="bg-white hover:bg-ivory text-charcoal font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            {t('cta.createAccount')}
          </Button>
          <p className="text-charcoal/60 text-sm mt-4">
            {t('cta.trial')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
