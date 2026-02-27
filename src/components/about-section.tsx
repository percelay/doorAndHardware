import { toSectionId } from "@/lib/content";

type AboutSectionProps = {
  title: string;
  body: string;
};

export function AboutSection({ title, body }: AboutSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm md:p-10">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
          {title}
        </h2>
        <p className="mt-6 text-base leading-7 text-[var(--color-text-muted)] md:text-lg">{body}</p>
      </div>
    </section>
  );
}
