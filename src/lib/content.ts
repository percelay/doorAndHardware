import fs from "node:fs";
import path from "node:path";

export type CtaLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  raw: string;
  brandName: string;
  hero: {
    title: string;
    subtitle: string;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
  };
  about: {
    title: string;
    body: string;
  } | null;
  services: {
    sectionTitle: string;
    items: Array<{ title: string; description: string }>;
  } | null;
  products: {
    sectionTitle: string;
    items: Array<{ title: string; description: string }>;
  } | null;
  testimonials: {
    sectionTitle: string;
    items: Array<{ quote: string; attribution?: string }>;
  } | null;
  contact: {
    title: string;
    lines: string[];
  } | null;
  navItems: Array<{ label: string; href: string }>;
};

const SECTION_LABELS = [
  "Hero",
  "About",
  "Services",
  "Products and Partners",
  "Testimonials",
  "Contact"
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function isArtifactLine(line: string): boolean {
  return /^\+\d+$/.test(line.trim());
}

function compactLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter((line) => line && !isArtifactLine(line));
}

function startsWithCi(line: string, prefix: string): boolean {
  return line.toLowerCase().startsWith(prefix.toLowerCase());
}

function extractBetween(source: string, startLabel: string, endLabel?: string): string {
  const lower = source.toLowerCase();
  const start = lower.indexOf(startLabel.toLowerCase());
  if (start < 0) return "";
  const valueStart = start + startLabel.length;
  if (!endLabel) {
    return source.slice(valueStart).trim();
  }

  const end = lower.indexOf(endLabel.toLowerCase(), valueStart);
  if (end < 0) {
    return source.slice(valueStart).trim();
  }
  return source.slice(valueStart, end).trim();
}

function splitPlainSections(raw: string): {
  brandName: string;
  sections: Record<(typeof SECTION_LABELS)[number], string[]>;
} {
  const lines = raw.split(/\r?\n/);
  const sections = Object.fromEntries(
    SECTION_LABELS.map((label) => [label, [] as string[]])
  ) as Record<(typeof SECTION_LABELS)[number], string[]>;
  const labelByLower = new Map(SECTION_LABELS.map((label) => [label.toLowerCase(), label]));
  const markers: Array<{ index: number; label: (typeof SECTION_LABELS)[number] }> = [];

  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    const canonical = labelByLower.get(trimmed.toLowerCase());
    if (canonical) {
      markers.push({ index: i, label: canonical });
    }
  }

  for (let i = 0; i < markers.length; i += 1) {
    const current = markers[i];
    const next = markers[i + 1];
    const start = current.index + 1;
    const end = next ? next.index : lines.length;
    sections[current.label] = lines.slice(start, end);
  }

  const firstMarkerIndex = markers.length > 0 ? markers[0].index : lines.length;
  const introLines = compactLines(lines.slice(0, firstMarkerIndex));
  const brandName = introLines[0] ?? "";

  return { brandName, sections };
}

function parseHero(
  lines: string[],
  hasServices: boolean,
  hasContact: boolean
): SiteContent["hero"] {
  const normalizedLines = compactLines(lines);
  const joined = normalizedLines.join(" ");

  const title = extractBetween(joined, "Headline:", "Subheadline:") || normalizedLines[0] || "";
  const subtitle = extractBetween(joined, "Subheadline:", "Primary CTA:");
  const primaryLabel = extractBetween(joined, "Primary CTA:", "Secondary CTA:");
  const secondaryLabel = extractBetween(joined, "Secondary CTA:");

  const primaryCta = primaryLabel
    ? {
        label: primaryLabel,
        href: hasContact ? `#${slugify("Contact")}` : "#"
      }
    : undefined;

  const secondaryCta = secondaryLabel
    ? {
        label: secondaryLabel,
        href: hasServices ? `#${slugify("Services")}` : "#"
      }
    : undefined;

  return {
    title,
    subtitle,
    primaryCta,
    secondaryCta
  };
}

function parseServices(lines: string[]): Array<{ title: string; description: string }> {
  const normalizedLines = compactLines(lines);
  const items: Array<{ title: string; description: string }> = [];
  let currentTitle = "";
  let descriptionParts: string[] = [];

  const flush = () => {
    const description = descriptionParts.join(" ").trim();
    if (currentTitle && description) {
      items.push({ title: currentTitle, description });
    }
    currentTitle = "";
    descriptionParts = [];
  };

  for (let i = 0; i < normalizedLines.length; i += 1) {
    const line = normalizedLines[i];
    const nextLine = normalizedLines[i + 1] ?? "";

    if (startsWithCi(line, "Title:")) {
      flush();
      const payload = line.slice("Title:".length).trim();
      const descriptionIndex = payload.toLowerCase().indexOf("description:");
      if (descriptionIndex >= 0) {
        currentTitle = payload.slice(0, descriptionIndex).trim();
        const sameLineDescription = payload.slice(descriptionIndex + "description:".length).trim();
        if (sameLineDescription) {
          descriptionParts.push(sameLineDescription);
        }
      } else {
        currentTitle = payload;
      }
      continue;
    }

    if (startsWithCi(line, "Description:")) {
      const payload = line.slice("Description:".length).trim();
      if (payload) {
        descriptionParts.push(payload);
      }
      continue;
    }

    if (currentTitle && descriptionParts.length > 0) {
      if (!startsWithCi(nextLine, "Title:")) {
        descriptionParts.push(line);
      }
    }
  }

  flush();
  return items;
}

function isLikelySubheading(line: string): boolean {
  if (!line) return false;
  if (line.length > 64) return false;
  if (line.includes(":")) return false;
  if (/[.!?]$/.test(line)) return false;
  return /^[A-Za-z0-9&(),\-/'\s]+$/.test(line);
}

function parseProducts(lines: string[]): Array<{ title: string; description: string }> {
  const normalizedLines = compactLines(lines);
  const items: Array<{ title: string; description: string }> = [];
  let currentTitle = "";
  let currentDescription: string[] = [];

  const flush = () => {
    const description = currentDescription.join(" ").trim();
    if (currentTitle && description) {
      items.push({ title: currentTitle, description });
    }
    currentTitle = "";
    currentDescription = [];
  };

  for (const line of normalizedLines) {
    if (isLikelySubheading(line)) {
      flush();
      currentTitle = line;
      continue;
    }

    if (currentTitle) {
      currentDescription.push(line);
    }
  }

  flush();
  return items;
}

function parseTestimonials(lines: string[]): Array<{ quote: string; attribution?: string }> {
  const normalizedLines = compactLines(lines);
  const items: Array<{ quote: string; attribution?: string }> = [];
  let currentQuote = "";

  for (const line of normalizedLines) {
    if (line.startsWith("-")) {
      if (currentQuote) {
        items.push({ quote: currentQuote });
      }
      currentQuote = line.replace(/^-+\s*/, "").trim();
      continue;
    }

    if (line.startsWith(">")) {
      if (currentQuote) {
        items.push({ quote: currentQuote });
      }
      currentQuote = line.replace(/^>\s*/, "").trim();
      continue;
    }

    if (!currentQuote) {
      currentQuote = line;
    } else {
      currentQuote = `${currentQuote} ${line}`.trim();
    }
  }

  if (currentQuote) {
    items.push({ quote: currentQuote });
  }

  return items.filter((item) => item.quote);
}

export function loadSiteContent(): SiteContent {
  const sourcePath = path.join(process.cwd(), "sourcematerial.md");
  const raw = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
  const { brandName, sections } = splitPlainSections(raw);

  const hasServices = compactLines(sections.Services).length > 0;
  const hasContact = compactLines(sections.Contact).length > 0;
  const hero = parseHero(sections.Hero, hasServices, hasContact);

  const aboutBody = compactLines(sections.About).join(" ");
  const servicesItems = parseServices(sections.Services);
  const productsItems = parseProducts(sections["Products and Partners"]);
  const testimonialItems = parseTestimonials(sections.Testimonials);
  const contactLines = compactLines(sections.Contact);

  const navItems: Array<{ label: string; href: string }> = [];
  if (aboutBody) {
    navItems.push({ label: "About", href: `#${slugify("About")}` });
  }
  if (servicesItems.length > 0) {
    navItems.push({ label: "Services", href: `#${slugify("Services")}` });
  }
  if (productsItems.length > 0) {
    navItems.push({
      label: "Products and Partners",
      href: `#${slugify("Products and Partners")}`
    });
  }
  if (testimonialItems.length > 0) {
    navItems.push({ label: "Testimonials", href: `#${slugify("Testimonials")}` });
  }
  if (contactLines.length > 0) {
    navItems.push({ label: "Contact", href: `#${slugify("Contact")}` });
  }

  return {
    raw,
    brandName,
    hero,
    about: aboutBody
      ? {
          title: "About",
          body: aboutBody
        }
      : null,
    services:
      servicesItems.length > 0
        ? {
            sectionTitle: "Services",
            items: servicesItems
          }
        : null,
    products:
      productsItems.length > 0
        ? {
            sectionTitle: "Products and Partners",
            items: productsItems
          }
        : null,
    testimonials:
      testimonialItems.length > 0
        ? {
            sectionTitle: "Testimonials",
            items: testimonialItems
          }
        : null,
    contact:
      contactLines.length > 0
        ? {
            title: "Contact",
            lines: contactLines
          }
        : null,
    navItems
  };
}

export function toSectionId(label: string): string {
  return slugify(label);
}
