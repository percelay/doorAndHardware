import { toSectionId } from "@/lib/content";

type AboutSectionProps = {
  title: string;
  body: string;
};

export function AboutSection({ title, body }: AboutSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 p-10 md:p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
              {title}
            </h2>
            <p className="mt-8 text-base leading-8 text-[var(--color-text-muted)] md:text-lg">{body}</p>
          </div>
          <div className="relative min-h-64 md:min-h-0 md:w-2/5">
            <img
              src="/image/doorknob.webp"
              alt="Door hardware"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
