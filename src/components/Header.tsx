
<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
=======
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
<<<<<<< HEAD

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

=======
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
  };

>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
  return (
    <header className="bg-ivory border-b border-blush-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
<<<<<<< HEAD
            <Link href="/">
=======
            <Link to="/">
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
              <h1 className="text-2xl font-serif font-bold text-charcoal">
                Nunta<span className="text-blush-400">360</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              {t('nav.features')}
            </a>
            <a href="#vendors" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              {t('nav.vendors')}
            </a>
            <a href="#pricing" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              {t('nav.pricing')}
            </a>
            <a href="#blog" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              {t('nav.blog')}
            </a>
            <a href="#contact" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              {t('nav.contact')}
            </a>
          </nav>

          {/* Desktop CTA */}
<<<<<<< HEAD
          <div className="hidden md:flex">
            <Link href="/login">
              <Button className="bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                {t('nav.getStarted')}
              </Button>
            </Link>
=======
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="border-blush-300 text-charcoal hover:bg-blush-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-charcoal hover:text-blush-400"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            )}
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-charcoal hover:text-blush-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-ivory border-t border-blush-200 animate-fade-in">
            <nav className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                {t('nav.features')}
              </a>
              <a href="#vendors" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                {t('nav.vendors')}
              </a>
              <a href="#pricing" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                {t('nav.pricing')}
              </a>
              <a href="#blog" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                {t('nav.blog')}
              </a>
              <a href="#contact" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                {t('nav.contact')}
              </a>
<<<<<<< HEAD
              <Link href="/login">
                <Button className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold mt-4">
                  {t('nav.getStarted')}
                </Button>
              </Link>
=======
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full text-left justify-start text-charcoal hover:text-blush-400"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold mt-4">
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              )}
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
