
import React from 'react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Nunta<span className="text-blush-300">360</span>
            </h3>
            <p className="text-white/70 leading-relaxed">
              Making wedding planning beautiful, simple, and stress-free for Romanian couples.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-blush-300 hover:bg-white/10">
                RO
              </Button>
              <span className="text-white/40">|</span>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-blush-300 hover:bg-white/10">
                EN
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-white/70 hover:text-blush-300 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-white/70 hover:text-blush-300 transition-colors">Pricing</a></li>
              <li><a href="#vendors" className="text-white/70 hover:text-blush-300 transition-colors">Vendors</a></li>
              <li><a href="#testimonials" className="text-white/70 hover:text-blush-300 transition-colors">Reviews</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">Help Center</a></li>
              <li><a href="#contact" className="text-white/70 hover:text-blush-300 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">Wedding Guide</a></li>
              <li><a href="#blog" className="text-white/70 hover:text-blush-300 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-blush-300 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-white/70 hover:text-blush-300 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-blush-300 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297-.878-.808-1.297-1.78-1.297-2.917 0-1.297.49-2.448 1.297-3.326.808-.878 1.78-1.297 2.917-1.297 1.297 0 2.448.49 3.326 1.297.878.808 1.297 1.78 1.297 2.917 0 1.297-.49 2.448-1.297 3.326-.808.878-1.78 1.297-2.917 1.297z"/>
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-blush-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
            <p className="text-white/60 text-sm">
              © 2024 Nunta360. All rights reserved. Made with ❤️ in Romania.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
