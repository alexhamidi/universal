"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import CompanyLogosSection from '@/components/sections/CompanyLogosSection';
import WorksOnSection from '@/components/sections/WorksOnSection';
import DemoSection from '@/components/sections/DemoSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Analytics from '@/components/Analytics';
import ClientOnly from '@/components/ClientOnly';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div>
      <ClientOnly>
        <Analytics />
      </ClientOnly>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 z-0 autoInvertException" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}></div>
        {/* Hero Section */}
        <HeroSection isLoaded={isLoaded} />

        {/* Company Logos Section */}
        <CompanyLogosSection isLoaded={isLoaded} />

        {/* Works On Everything Section */}
        <WorksOnSection />

        {/* Proof Section */}
        <DemoSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />
        <Image
            src="/thing.png"
            alt="Panoptica"
            width={200}
            height={200}
          />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Component definitions for NavLink, MenuIcon, MobileMenu, and all sections...
