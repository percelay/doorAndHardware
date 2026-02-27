import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TestimonialsSection } from "@/components/testimonials-section";
import { loadSiteContent } from "@/lib/content";

export default function HomePage() {
  const content = loadSiteContent();

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <SiteHeader
        brandName={content.brandName}
        navItems={content.navItems}
        primaryCta={content.hero.primaryCta}
      />

      <HeroSection
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        primaryCta={content.hero.primaryCta}
        secondaryCta={content.hero.secondaryCta}
      />

      {content.services ? (
        <ServicesSection title={content.services.sectionTitle} items={content.services.items} />
      ) : null}

      {content.testimonials ? (
        <TestimonialsSection
          title={content.testimonials.sectionTitle}
          items={content.testimonials.items}
        />
      ) : null}

      <SiteFooter brandName={content.brandName} contact={content.contact} />
    </main>
  );
}
