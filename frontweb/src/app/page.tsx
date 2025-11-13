import HeroSection from '@/components/landing/HeroSection';
import TargetAudienceSection from '@/components/landing/TargetAudienceSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FutureOfWorkSection from '@/components/landing/FutureOfWorkSection';
import AppShowcaseSection from '@/components/landing/AppShowcaseSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TargetAudienceSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FutureOfWorkSection />
      <AppShowcaseSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}

