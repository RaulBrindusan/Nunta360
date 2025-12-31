'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-blush-50/30 to-sage-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Decorative Hearts */}
        <div className="flex justify-center gap-4 mb-8">
          <Heart className="w-8 h-8 text-blush-400 fill-blush-400 animate-pulse" />
          <Heart className="w-6 h-6 text-dustyRose-400 fill-dustyRose-400 animate-pulse delay-100" />
          <Heart className="w-8 h-8 text-blush-400 fill-blush-400 animate-pulse delay-200" />
        </div>

        {/* 404 Number */}
        <div className="space-y-6">
          <h1 className="text-9xl md:text-[14rem] font-serif font-bold text-blush-500 select-none leading-none">
            404
          </h1>
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
              Pagina nu a fost găsită
            </p>
            <p className="text-lg text-charcoal/70 max-w-md mx-auto">
              Se pare că această pagină nu există sau a fost mutată. Poate v-ați pierdut pe drumul către ziua perfectă?
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-12 h-[1px] bg-blush-300"></div>
            <Heart className="w-4 h-4 text-blush-400 fill-blush-400" />
            <div className="w-12 h-[1px] bg-blush-300"></div>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="pt-16">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blush-300 to-transparent"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-blush-400"></div>
              <div className="w-2 h-2 rounded-full bg-dustyRose-400"></div>
              <div className="w-2 h-2 rounded-full bg-sage-400"></div>
            </div>
            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blush-300 to-transparent"></div>
          </div>

          {/* Brand */}
          <div className="mt-8">
            <Link href="/" className="group inline-block">
              <h2 className="text-3xl font-serif font-bold text-charcoal group-hover:text-blush-600 transition-colors">
                Nunta<span className="text-blush-500">360</span>
              </h2>
              <p className="text-sm text-charcoal/40 mt-1">Planifică-ți ziua perfectă</p>
            </Link>
          </div>
        </div>

        {/* Bottom Arrow Indicator */}
        <div className="pt-8 animate-bounce">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blush-600 hover:text-blush-700 transition-colors group"
          >
            <span className="text-sm font-medium">Înapoi acasă</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
