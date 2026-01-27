import { HeroSection } from "@/components/marketing/hero-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { ProblemsSection } from "@/components/marketing/problems-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { TherapyProcessSection } from "@/components/marketing/therapy-process-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { AboutPreviewSection } from "@/components/marketing/about-preview-section";
import { AIAssessmentCTA } from "@/components/marketing/ai-assessment-cta";
import { ContactSection } from "@/components/marketing/contact-section";
import { getSiteInfo } from "@/lib/site-settings";
import { getContactContent, getHomeContent } from "@/lib/content";
import { getActiveServices } from "@/lib/services";

export default async function HomePage() {
  const [siteInfo, homeContent, contactContent, services] = await Promise.all([
    getSiteInfo(),
    getHomeContent(),
    getContactContent(),
    getActiveServices()
  ]);

  return (
    <main>
      <HeroSection content={homeContent.hero} />
      <StatsSection items={homeContent.stats.items} />
      <ProblemsSection content={homeContent.problems} />
      <ServicesSection content={homeContent.services} services={services} />
      <TherapyProcessSection content={homeContent.therapy} />
      <AboutPreviewSection content={homeContent.aboutPreview} />
      <AIAssessmentCTA content={homeContent.aiCta} />
      <TestimonialsSection content={homeContent.testimonials} />
      <ContactSection siteInfo={siteInfo} content={contactContent} />
    </main>
  );
}
