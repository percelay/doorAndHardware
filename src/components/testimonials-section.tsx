import { Quote } from "lucide-react";
import { toSectionId } from "@/lib/content";

type TestimonialItem = {
  quote: string;
  attribution?: string;
};

type TestimonialsSectionProps = {
  title: string;
  items: TestimonialItem[];
};

export function TestimonialsSection({ title, items }: TestimonialsSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
        {title}
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.attribution}
            className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <Quote className="h-5 w-5 text-[var(--color-text-main)]" />
            <p className="mt-5 text-base leading-8 text-[var(--color-text-main)]">{item.quote}</p>
            {item.attribution ? (
              <p className="mt-5 text-sm text-[var(--color-text-muted)]">{item.attribution}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
