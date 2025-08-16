
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import ProductPreview from '@/components/ProductPreview';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <ProductPreview />
      <CTABanner />
      <Footer />
    </div>
  );
}
