import { ArrowRight } from "lucide-react";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function HeroSection({ title, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 p-10 md:p-14">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-8 max-w-xl text-base leading-8 text-[var(--color-text-muted)] md:text-lg">
                {subtitle}
              </p>
            ) : null}
            {(primaryCta || secondaryCta) ? (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {primaryCta ? (
                  <a
                    href={primaryCta.href}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
                {secondaryCta ? (
                  <a
                    href={secondaryCta.href}
                    className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[var(--color-text-main)] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    {secondaryCta.label}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="relative min-h-72 md:min-h-0 md:w-5/12">
            <img
              src="/home remodel.jpg"
              alt="Home remodel project"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
