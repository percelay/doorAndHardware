import fs from "node:fs";
import path from "node:path";

export type MarkdownSection = {
  title: string;
  level: number;
  lines: string[];
};

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
  services: {
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

const KEYWORDS = {
  hero: ["hero", "home", "overview", "introduction", "intro"],
  services: ["services", "service", "features", "feature", "offerings"],
  testimonials: ["testimonials", "testimonial", "reviews", "review"],
  contact: ["contact", "get in touch", "reach us"]
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function parseSections(raw: string): MarkdownSection[] {
  const lines = raw.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection = { title: "", level: 0, lines: [] };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*\S)\s*$/);
    if (headingMatch) {
      sections.push(current);
      current = {
        title: headingMatch[2].trim(),
        level: headingMatch[1].length,
        lines: []
      };
      continue;
    }
    current.lines.push(line);
  }

  sections.push(current);
  return sections.filter((section) => section.title || section.lines.some((line) => line.trim()));
}

function getSectionByKeyword(
  sections: MarkdownSection[],
  keywords: string[]
): { section: MarkdownSection; index: number } | null {
  for (let i = 0; i < sections.length; i += 1) {
    const title = sections[i].title.toLowerCase();
    if (keywords.some((keyword) => title.includes(keyword))) {
      return { section: sections[i], index: i };
    }
  }
  return null;
}

function getChildSections(sections: MarkdownSection[], parentIndex: number): MarkdownSection[] {
  const parent = sections[parentIndex];
  const children: MarkdownSection[] = [];

  for (let i = parentIndex + 1; i < sections.length; i += 1) {
    const section = sections[i];
    if (section.level <= parent.level) {
      break;
    }
    if (section.level === parent.level + 1) {
      children.push(section);
    }
  }

  return children;
}

function compactLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function parseLinks(raw: string): CtaLink[] {
  const links: CtaLink[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match = regex.exec(raw);

  while (match) {
    links.push({ label: match[1].trim(), href: match[2].trim() });
    match = regex.exec(raw);
  }

  return links;
}

function parseServiceFallbackItems(lines: string[]): Array<{ title: string; description: string }> {
  const bulletItems = compactLines(lines)
    .map((line) => line.match(/^[-*+]\s+(.+)$/)?.[1])
    .filter((line): line is string => Boolean(line));

  if (bulletItems.length > 0) {
    return bulletItems
      .map((item) => {
        const separatorIndex = item.indexOf(":");
        if (separatorIndex > 0 && separatorIndex < item.length - 1) {
          return {
            title: item.slice(0, separatorIndex).trim(),
            description: item.slice(separatorIndex + 1).trim()
          };
        }

        return {
          title: item,
          description: item
        };
      })
      .filter((item) => item.title && item.description);
  }

  return [];
}

function parseBlockquoteTestimonials(lines: string[]): Array<{ quote: string; attribution?: string }> {
  const quotes: Array<{ quote: string; attribution?: string }> = [];
  let current: string[] = [];

  for (const line of lines) {
    const match = line.match(/^>\s?(.*)$/);
    if (match) {
      current.push(match[1].trim());
      continue;
    }

    if (current.length > 0) {
      const [first, ...rest] = current;
      quotes.push({
        quote: first,
        attribution: rest.length > 0 ? rest.join(" ") : undefined
      });
      current = [];
    }
  }

  if (current.length > 0) {
    const [first, ...rest] = current;
    quotes.push({
      quote: first,
      attribution: rest.length > 0 ? rest.join(" ") : undefined
    });
  }

  return quotes.filter((item) => item.quote);
}

function collectContactLines(sections: MarkdownSection[], sectionIndex: number): string[] {
  const parent = sections[sectionIndex];
  const lines: string[] = [...compactLines(parent.lines)];

  for (const child of getChildSections(sections, sectionIndex)) {
    lines.push(child.title);
    lines.push(...compactLines(child.lines));
  }

  return lines.filter(Boolean);
}

export function loadSiteContent(): SiteContent {
  const sourcePath = path.join(process.cwd(), "sourcematerial.md");
  const raw = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
  const sections = parseSections(raw);
  const links = parseLinks(raw);

  const firstH1 = sections.find((section) => section.level === 1)?.title ?? "";
  const firstNonEmptyLine =
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) ?? "";
  const brandName = firstH1 || firstNonEmptyLine;

  const heroMatch = getSectionByKeyword(sections, KEYWORDS.hero);
  const heroSection = heroMatch?.section ?? sections[0];
  const heroLines = compactLines(heroSection?.lines ?? []);
  const heroTitle = heroSection?.title || heroLines[0] || "";
  const heroSubtitle = heroLines.find((line) => line !== heroTitle) ?? "";

  const servicesMatch = getSectionByKeyword(sections, KEYWORDS.services);
  const servicesChildren = servicesMatch ? getChildSections(sections, servicesMatch.index) : [];
  const servicesFromChildren = servicesChildren
    .map((section) => {
      const description = compactLines(section.lines).join(" ");
      return {
        title: section.title,
        description
      };
    })
    .filter((item) => item.title && item.description);
  const servicesFallback = servicesMatch ? parseServiceFallbackItems(servicesMatch.section.lines) : [];
  const servicesItems = servicesFromChildren.length > 0 ? servicesFromChildren : servicesFallback;

  const testimonialsMatch = getSectionByKeyword(sections, KEYWORDS.testimonials);
  const testimonialChildren = testimonialsMatch
    ? getChildSections(sections, testimonialsMatch.index)
    : [];
  const testimonialsFromChildren = testimonialChildren
    .map((section) => ({
      quote: compactLines(section.lines).join(" "),
      attribution: section.title
    }))
    .filter((item) => item.quote);
  const testimonialsFallback = testimonialsMatch
    ? parseBlockquoteTestimonials(testimonialsMatch.section.lines)
    : [];
  const testimonialItems =
    testimonialsFromChildren.length > 0 ? testimonialsFromChildren : testimonialsFallback;

  const contactMatch = getSectionByKeyword(sections, KEYWORDS.contact);
  const contactLines = contactMatch ? collectContactLines(sections, contactMatch.index) : [];

  const navItems: Array<{ label: string; href: string }> = [];
  if (servicesMatch) {
    navItems.push({
      label: servicesMatch.section.title,
      href: `#${slugify(servicesMatch.section.title)}`
    });
  }
  if (testimonialsMatch && testimonialItems.length > 0) {
    navItems.push({
      label: testimonialsMatch.section.title,
      href: `#${slugify(testimonialsMatch.section.title)}`
    });
  }
  if (contactMatch) {
    navItems.push({
      label: contactMatch.section.title,
      href: `#${slugify(contactMatch.section.title)}`
    });
  }

  return {
    raw,
    brandName,
    hero: {
      title: heroTitle,
      subtitle: heroSubtitle,
      primaryCta: links[0],
      secondaryCta: links[1]
    },
    services:
      servicesMatch && servicesItems.length > 0
        ? {
            sectionTitle: servicesMatch.section.title,
            items: servicesItems
          }
        : null,
    testimonials:
      testimonialsMatch && testimonialItems.length > 0
        ? {
            sectionTitle: testimonialsMatch.section.title,
            items: testimonialItems
          }
        : null,
    contact:
      contactMatch && contactLines.length > 0
        ? {
            title: contactMatch.section.title,
            lines: contactLines
          }
        : null,
    navItems
  };
}

export function toSectionId(label: string): string {
  return slugify(label);
}
