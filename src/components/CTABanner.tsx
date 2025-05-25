
import React from 'react';
import { Button } from '@/components/ui/button';

const CTABanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blush-200 via-dustyRose-200 to-sage-200">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-serif font-bold text-charcoal mb-6">
            Ready to Start Your Journey
            <span className="text-white"> Together?</span>
          </h2>
          <p className="text-lg lg:text-xl text-charcoal/80 mb-8">
            Join thousands of Romanian couples who trusted Nunta360 to plan their perfect wedding day. Start your free account today and begin planning the celebration of a lifetime.
          </p>
          <Button className="bg-white hover:bg-ivory text-charcoal font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Create Your Free Account
          </Button>
          <p className="text-charcoal/60 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
