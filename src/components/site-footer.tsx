import { toSectionId } from "@/lib/content";

type SiteFooterProps = {
  brandName: string;
  contact:
    | {
        title: string;
        lines: string[];
      }
    | null;
};

export function SiteFooter({ brandName, contact }: SiteFooterProps) {
  return (
    <footer
      id={contact ? toSectionId(contact.title) : undefined}
      className="mt-16 border-t border-black/5 bg-[var(--color-surface)]"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-lg font-semibold text-[var(--color-text-main)]">{brandName}</p>
        </div>
        {contact ? (
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-main)]">{contact.title}</h2>
            <div className="mt-4 space-y-2">
              {contact.lines.map((line) => (
                <p key={line} className="text-sm text-[var(--color-text-muted)]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
