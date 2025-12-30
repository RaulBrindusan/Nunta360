'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <h3 className="text-2xl font-serif font-bold">
                Nunta<span className="text-blush-400">360</span>
              </h3>
              <Heart className="w-6 h-6 text-blush-400 ml-2 fill-current" />
            </div>
            <p className="text-ivory/70 leading-relaxed mb-6">
              Platforma românească de planificare a nunții care face din visul tău realitate. 
              Simplu, elegant, perfect.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ivory/70 hover:text-blush-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-ivory/70 hover:text-blush-400 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-ivory/70 hover:text-blush-400 transition-colors">
                Pinterest
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Funcționalități</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Gestionare Invitați</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Planificare Buget</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Furnizori Parteneri</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Cronologie Nuntă</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Checklist Complet</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Suport</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Centru de Ajutor</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Ghiduri Planificare</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Întrebări Frecvente</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Contact</a></li>
              <li><a href="#" className="text-ivory/70 hover:text-ivory transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blush-400 mr-3 flex-shrink-0" />
                <a href="mailto:hello@nunta360.ro" className="text-ivory/70 hover:text-ivory transition-colors">
                  hello@nunta360.ro
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blush-400 mr-3 flex-shrink-0" />
                <a href="tel:+40721234567" className="text-ivory/70 hover:text-ivory transition-colors">
                  +40 721 234 567
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blush-400 mr-3 flex-shrink-0 mt-1" />
                <span className="text-ivory/70">
                  București, România
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-ivory/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-ivory/60 text-sm mb-4 md:mb-0">
              © 2024 Nunta360. Toate drepturile rezervate. Făcut cu ❤️ în România.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
                Termeni și Condiții
              </a>
              <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
                Politica de Confidențialitate
              </a>
              <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;