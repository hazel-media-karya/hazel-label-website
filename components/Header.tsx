import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type HeaderNavItem = {
  label: string;
  href: string;
};

type HeaderSettings = {
  logoText?: string;
  navItems?: HeaderNavItem[];
  ctaLabel?: string;
  ctaHref?: string;
};

function normalizeHeaderSettings(settings?: unknown): HeaderSettings {
  if (!settings || typeof settings !== "object") {
    return {};
  }

  return settings as HeaderSettings;
}

export function Header({
  settings,
}: {
  settings?: unknown;
}) {
  const header = normalizeHeaderSettings(settings);

  const logoText = header.logoText ?? siteConfig.brandName;
  const navItems = header.navItems ?? siteConfig.navigation;
  const ctaLabel = header.ctaLabel ?? siteConfig.ctaButtonText;
  const ctaHref = header.ctaHref ?? "/hazel-studio";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030303]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white transition group-hover:border-white/30">
            H
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
              {logoText}
            </p>
            <p className="text-xs text-zinc-500">
              Custom Jersey Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
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

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={ctaHref}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white hover:text-black"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
