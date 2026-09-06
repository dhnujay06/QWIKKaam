import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import InstantServicesStrip from '@/components/home/InstantServicesStrip';
import PermanentPlacementCTA from '@/components/home/PermanentPlacementCTA';
import HowItWorks from '@/components/home/HowItWorks';
import TrustSection from '@/components/home/TrustSection';
import TopHelpersCarousel from '@/components/home/TopHelpersCarousel';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CitySection from '@/components/home/CitySection';
import DownloadAppCTA from '@/components/home/DownloadAppCTA';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <InstantServicesStrip />
      <HowItWorks />
      <PermanentPlacementCTA />
      <TrustSection />
      <TopHelpersCarousel />
      <TestimonialsSection />
      <CitySection />
      <DownloadAppCTA />
    </div>
  );
}
