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

export function Header({ settings }: { settings?: unknown }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const header = normalizeHeaderSettings(settings);
  const tagline = header.tagline ?? "Premium Custom Jersey & Apparel";
  const navItems = header.navItems ?? siteConfig.navigation;
  const ctaLabel = header.ctaLabel ?? siteConfig.ctaButtonText;
  const ctaHref = header.ctaHref ?? "/hazel-studio";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[92px] max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-5">
          <Image
            src={siteConfig.logoPath}
            alt={`${siteConfig.brandName} logo`}
            width={170}
            height={60}
            priority
            className="h-auto w-[150px] sm:w-[170px]"
          />

          <span className="hidden max-w-[260px] text-sm text-zinc-500 lg:block">
            {tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
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
            className="hidden rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white hover:text-black md:inline-flex"
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/30 hover:bg-white hover:text-black md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl shadow-black/60 backdrop-blur md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-2 border-t border-white/10" />

              <Link
                href={ctaHref}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
