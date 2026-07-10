import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type HeaderSettings = {
  tagline?: string;
  navItems?: Array<{
    label: string;
    href: string;
  }>;
  ctaLabel?: string;
  ctaHref?: string;
};

function normalizeHeaderSettings(settings?: unknown): HeaderSettings {
  if (!settings || typeof settings !== "object") {
    return {};
  }

  const raw = settings as {
    tagline?: unknown;
    navItems?: unknown;
    ctaLabel?: unknown;
    ctaHref?: unknown;
  };

  return {
    tagline: typeof raw.tagline === "string" ? raw.tagline : undefined,
    navItems: Array.isArray(raw.navItems)
      ? raw.navItems.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof (item as { label?: unknown }).label === "string" &&
            typeof (item as { href?: unknown }).href === "string"
        ) as Array<{ label: string; href: string }>
      : undefined,
    ctaLabel: typeof raw.ctaLabel === "string" ? raw.ctaLabel : undefined,
    ctaHref: typeof raw.ctaHref === "string" ? raw.ctaHref : undefined,
  };
}

export function Header({ settings }: { settings?: unknown }) {
  const header = normalizeHeaderSettings(settings);

  const tagline =
    header.tagline ?? "Premium Custom Jersey & Apparel";

  const navItems =
    header.navItems && header.navItems.length > 0
      ? header.navItems
      : siteConfig.navigation;

  const ctaLabel = header.ctaLabel ?? siteConfig.ctaButtonText ?? "Start Custom";
  const ctaHref = header.ctaHref ?? "/custom";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-5">
          <Image
            src={siteConfig.logoPath}
            alt={`${siteConfig.brandName} logo`}
            width={170}
            height={60}
            priority
            className="h-auto w-[150px] sm:w-[170px]"
          />

          <span className="hidden max-w-[280px] text-sm text-zinc-500 lg:block">
            {tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-300 lg:flex">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ctaHref}
          className="hidden rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#d8b36d] hover:text-[#f2d6a1] sm:inline-flex"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}

export default Header;
