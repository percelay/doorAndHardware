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
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {/* Background image */}
        <img
          src="/home remodel.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Layered gradient: strong dark on left, fades toward right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/15" />
        {/* Bottom vignette for grounding */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative flex min-h-[540px] flex-col justify-center px-10 py-16 md:max-w-[60%] md:px-16 md:py-24">
          {/* Eyebrow badge */}
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-primary)] backdrop-blur-sm">
            Est. 1909
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl md:leading-[1.12]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-7 max-w-md text-base leading-8 text-white/65 md:text-lg">
              {subtitle}
            </p>
          ) : null}

          {(primaryCta || secondaryCta) ? (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {primaryCta ? (
                <a
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryCta.href}
                  className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/20"
                >
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
