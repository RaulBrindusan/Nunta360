'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';

const ShowcaseSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      text: t('showcase.testimonial1'),
      author: 'Maria & Alexandru',
      location: 'București',
    },
    {
      text: 'Am economisit atât de mult timp cu Nunta360! Recomand cu încredere.',
      author: 'Elena & Mihai',
      location: 'Cluj-Napoca',
    },
    {
      text: 'Cea mai bună platformă pentru planificarea nunții. Totul este organizat perfect!',
      author: 'Ioana & Cristian',
      location: 'Timișoara',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-sage-50 to-blush-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
            {t('showcase.title')}{' '}
            <span className="text-blush-400">{t('showcase.titleAccent')}</span>
          </h2>
          <p className="text-lg lg:text-xl text-charcoal/70 max-w-3xl mx-auto">
            {t('showcase.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blush-100"
            >
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-blush-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-charcoal/80 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-charcoal">{testimonial.author}</p>
                <p className="text-charcoal/60 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center items-center space-x-8 text-charcoal/60">
            <div className="text-center">
              <div className="text-3xl font-bold text-blush-400">500+</div>
              <div className="text-sm">Nunți Planificate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-500">98%</div>
              <div className="text-sm">Satisfacție Clienți</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dustyRose-400">1000+</div>
              <div className="text-sm">Furnizori Parteneri</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;