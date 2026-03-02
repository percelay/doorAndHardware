import type { LucideIcon } from "lucide-react";
import { Building2, DoorClosed, HardHat, Wrench } from "lucide-react";
import { toSectionId } from "@/lib/content";

type ServiceItem = {
  title: string;
  description: string;
};

type ServicesSectionProps = {
  title: string;
  items: ServiceItem[];
};

function getServiceIcon(serviceTitle: string): LucideIcon {
  const key = serviceTitle.toLowerCase();
  if (key.includes("door")) return DoorClosed;
  if (key.includes("hardware")) return Wrench;
  if (key.includes("install") || key.includes("construction")) return HardHat;
  return Building2;
}

export function ServicesSection({ title, items }: ServicesSectionProps) {
  return (
    <section id={toSectionId(title)} className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text-main)] md:text-4xl">
        {title}
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = getServiceIcon(item.title);
          return (
            <article
              key={item.title}
              className="rounded-2xl bg-[var(--color-surface)] p-8 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-[var(--color-text-main)]" />
              <h3 className="mt-5 text-xl font-semibold text-[var(--color-text-main)]">{item.title}</h3>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--color-text-muted)]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
