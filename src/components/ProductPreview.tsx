'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Heart, Users, Calendar } from 'lucide-react';

const ProductPreview = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blush-100 to-dustyRose-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h3 className="text-xl font-serif font-bold text-charcoal">
                    Dashboard Nuntă
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-blush-400 fill-current" />
                    <span className="text-sm text-charcoal/60">Maria & Alex</span>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-charcoal font-medium">Progres General</span>
                      <span className="text-blush-400 font-bold">75%</span>
                    </div>
                    <div className="w-full bg-blush-100 rounded-full h-2">
                      <div className="bg-blush-400 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-charcoal font-medium">Buget Utilizat</span>
                      <span className="text-sage-500 font-bold">€12,000 / €20,000</span>
                    </div>
                    <div className="w-full bg-sage-100 rounded-full h-2">
                      <div className="bg-sage-500 h-2 rounded-full w-3/5"></div>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blush-50 rounded-lg">
                    <Users className="w-6 h-6 text-blush-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-charcoal">120</div>
                    <div className="text-xs text-charcoal/60">Invitați</div>
                  </div>
                  <div className="text-center p-3 bg-sage-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-sage-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-charcoal">8/12</div>
                    <div className="text-xs text-charcoal/60">Furnizori</div>
                  </div>
                  <div className="text-center p-3 bg-dustyRose-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-dustyRose-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-charcoal">45</div>
                    <div className="text-xs text-charcoal/60">Zile Rămase</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <Heart className="w-6 h-6 text-blush-400 fill-current" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
              <CheckCircle className="w-6 h-6 text-sage-500" />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
              Totul într-un{' '}
              <span className="text-blush-400">singur loc</span>
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
              Dashboard-ul nostru intuitiv îți oferă o vedere completă asupra progresului nunții tale. 
              Monitorizează bugetul, gestionează invitații și coordonează cu furnizorii - totul simplu și organizat.
            </p>

            <div className="space-y-4">
              {[
                'Progres în timp real pentru toate aspectele nunții',
                'Notificări inteligente pentru termene importante',
                'Colaborare ușoară cu partenerul și familia',
                'Backup automat și sincronizare cross-device'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-charcoal/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;