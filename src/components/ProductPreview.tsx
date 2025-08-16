
'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductPreview = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-6">
            {t('product.title')}
            <span className="text-blush-400"> {t('product.titleAccent')}</span>
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            {t('product.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Screenshots Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blush-100 to-dustyRose-100 rounded-2xl p-6 shadow-lg">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="h-3 bg-blush-200 rounded mb-2"></div>
                  <div className="h-2 bg-blush-100 rounded mb-1"></div>
                  <div className="h-2 bg-blush-100 rounded w-3/4"></div>
                </div>
                <p className="text-sm font-medium text-charcoal text-center">{t('product.guestList')}</p>
              </div>
              
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-lg">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-2 bg-sage-300 rounded w-1/3"></div>
                    <div className="h-2 bg-sage-300 rounded w-1/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-sage-200 rounded"></div>
                    <div className="h-2 bg-sage-200 rounded w-4/5"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-charcoal text-center">{t('product.budgetTracker')}</p>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <div className="bg-gradient-to-br from-dustyRose-100 to-blush-200 rounded-2xl p-6 shadow-lg">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="h-2 bg-dustyRose-200 rounded"></div>
                    <div className="h-2 bg-dustyRose-200 rounded"></div>
                    <div className="h-2 bg-dustyRose-200 rounded"></div>
                  </div>
                  <div className="h-3 bg-dustyRose-300 rounded"></div>
                </div>
                <p className="text-sm font-medium text-charcoal text-center">{t('product.vendorDirectory')}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blush-200 to-sage-200 rounded-2xl p-6 shadow-lg">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex space-x-1 mb-3">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-blush-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-2 bg-blush-300 rounded w-2/3"></div>
                </div>
                <p className="text-sm font-medium text-charcoal text-center">{t('product.timelinePlanner')}</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blush-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-charcoal font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{t('product.feature1.title')}</h3>
                <p className="text-charcoal/70">{t('product.feature1.description')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-dustyRose-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-charcoal font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{t('product.feature2.title')}</h3>
                <p className="text-charcoal/70">{t('product.feature2.description')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-charcoal font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">{t('product.feature3.title')}</h3>
                <p className="text-charcoal/70">{t('product.feature3.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
