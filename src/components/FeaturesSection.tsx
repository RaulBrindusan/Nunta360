'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blush-400" />,
      title: t('features.guestManagement'),
      description: t('features.guestDescription'),
    },
    {
      icon: <DollarSign className="w-8 h-8 text-sage-500" />,
      title: t('features.budgetPlanning'),
      description: t('features.budgetDescription'),
    },
    {
      icon: <Calendar className="w-8 h-8 text-dustyRose-400" />,
      title: t('features.vendorDiscovery'),
      description: t('features.vendorDescription'),
    },
    {
      icon: <Clock className="w-8 h-8 text-blush-400" />,
      title: t('features.timelineSync'),
      description: t('features.timelineDescription'),
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white" id="features">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
            {t('features.title')}{' '}
            <span className="text-blush-400">{t('features.titleAccent')}</span>
          </h2>
          <p className="text-lg lg:text-xl text-charcoal/70 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-ivory to-blush-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blush-100"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-serif font-bold text-charcoal mb-4">
                {feature.title}
              </h3>
              <p className="text-charcoal/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;