'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTABanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-blush-300 via-dustyRose-300 to-sage-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-12 h-12 text-ivory" />
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-serif font-bold text-ivory mb-6">
            Începe astăzi să-ți planifici{' '}
            <span className="text-charcoal">nunta perfectă</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-ivory/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Alătură-te miilor de cupluri care au ales Nunta360 pentru ziua lor specială. 
            Începe gratuit și descoperă cât de simplu poate fi să planifici o nuntă de neuitat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-ivory text-charcoal hover:bg-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Începe Gratuit
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-ivory bg-white/10 backdrop-blur-sm text-charcoal hover:bg-ivory hover:text-charcoal font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
              >
                Am deja cont
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-ivory/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-ivory mb-2">✓</div>
              <div className="text-sm">Gratuit pentru început</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ivory mb-2">✓</div>
              <div className="text-sm">Fără carduri de credit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-ivory mb-2">✓</div>
              <div className="text-sm">Configurare în 2 minute</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;