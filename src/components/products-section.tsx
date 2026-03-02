import { toSectionId } from "@/lib/content";

type ProductsSectionProps = {
  title: string;
  items: Array<{ title: string; description: string }>;
};

function parseBrands(description: string): { intro: string; brands: string[] } {
  const colonIndex = description.lastIndexOf(":");
  if (colonIndex >= 0) {
    const intro = description.slice(0, colonIndex + 1).trim();
    const brandsStr = description.slice(colonIndex + 1).trim();
    const brands = brandsStr
      .split(",")
      .map((b) => b.trim().replace(/\.$/, ""))
      .filter(Boolean);
    return { intro, brands };
  }
  return {
    intro: "",
    brands: description
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean),
  };
}

export function ProductsSection({ title, items }: ProductsSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
        {title}
      </h2>

      <div className="mt-10 flex flex-col gap-4">
        {items.map((item) => {
          const { intro, brands } = parseBrands(item.description);
          return (
            <div
              key={item.title}
              className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm md:p-10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                {/* Category label */}
                <div className="md:w-44 md:shrink-0">
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)]">
                    {item.title}
                  </h3>
                  {intro ? (
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                      {intro}
                    </p>
                  ) : null}
                </div>

                {/* Brand pills */}
                <div className="flex flex-1 flex-wrap gap-2">
                  {brands.map((brand) => (
                    <span
                      key={brand}
                      className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] shadow-sm"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
