"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

type HeaderNavItem = {
  label: string;
  href: string;
};

type HeaderSettings = {
  logoText?: string;
  tagline?: string;
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

  const tagline = header.tagline ?? "Custom Jersey Platform";
  const navItems = header.navItems ?? siteConfig.navigation;
  const ctaLabel = header.ctaLabel ?? siteConfig.ctaButtonText;
  const ctaHref = header.ctaHref ?? "/hazel-studio";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030303]/85 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-12 w-40 items-center">
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.brandName} logo`}
              width={160}
              height={48}
              priority
              className="h-auto w-40 object-contain"
            />
          </div>

          <span className="sr-only">
            {siteConfig.brandName}
          </span>

          <p className="hidden text-xs text-zinc-500 sm:block">
            {tagline}
          </p>
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

        <div className="relative flex items-center gap-3">
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
