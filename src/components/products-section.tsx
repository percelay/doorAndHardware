import { toSectionId } from "@/lib/content";

type ProductsSectionProps = {
  title: string;
  items: Array<{ title: string; description: string }>;
};

export function ProductsSection({ title, items }: ProductsSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
        {title}
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-[var(--color-text-main)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
