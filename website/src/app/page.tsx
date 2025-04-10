"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HeroSection from '@/components/sections/HeroSection';
import WorksOnSection from '@/components/sections/WorksOnSection';
import ProofSection from '@/components/sections/ProofSection';
import UndetectabilitySection from '@/components/sections/UndetectabilitySection';
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
        {/* Hero Section */}
        <HeroSection isLoaded={isLoaded} />

        {/* Works On Everything Section */}
        <WorksOnSection />

        {/* Proof Section */}
        <ProofSection />

        {/* Undetectability Section */}
        <UndetectabilitySection />

        {/* FAQ Section */}
        <FAQSection />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Component definitions for NavLink, MenuIcon, MobileMenu, and all sections...
