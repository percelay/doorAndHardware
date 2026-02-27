type SiteHeaderProps = {
  brandName: string;
  navItems: Array<{ label: string; href: string }>;
  primaryCta?: { label: string; href: string };
};

export function SiteHeader({ brandName, navItems, primaryCta }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--color-bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <a href="#" className="text-lg font-semibold tracking-tight text-[var(--color-text-main)]">
          {brandName}
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-text-muted)] transition duration-200 hover:-translate-y-1 hover:text-[var(--color-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {primaryCta ? (
          <a
            href={primaryCta.href}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {primaryCta.label}
          </a>
        ) : null}
      </div>
    </header>
  );
}
