
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-ivory border-b border-blush-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-charcoal">
              Nunta<span className="text-blush-400">360</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              Features
            </a>
            <a href="#vendors" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              Vendors
            </a>
            <a href="#pricing" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              Pricing
            </a>
            <a href="#blog" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              Blog
            </a>
            <a href="#contact" className="text-charcoal hover:text-blush-400 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Button className="bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
              Get Started
            </Button>
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
                Features
              </a>
              <a href="#vendors" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                Vendors
              </a>
              <a href="#pricing" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                Pricing
              </a>
              <a href="#blog" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                Blog
              </a>
              <a href="#contact" className="block text-charcoal hover:text-blush-400 font-medium py-2">
                Contact
              </a>
              <Button className="w-full bg-blush-300 hover:bg-blush-400 text-charcoal font-semibold mt-4">
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
