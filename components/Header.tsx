"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src={siteConfig.logoPath} alt={`${siteConfig.brandName} logo`} width={144} height={44} priority />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-[#d8b36d] hover:text-white"
          >
            {siteConfig.loginButtonText}
          </Link>
          <Link
            href="/hazel-studio"
            className="rounded-full bg-[#d8b36d] px-4 py-2 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]"
          >
            {siteConfig.ctaButtonText}
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/15 px-3 py-2 text-sm text-zinc-200 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[#030303] px-6 py-4 sm:px-8 md:hidden">
          <nav className="flex flex-col gap-3 text-sm text-zinc-300">
            {siteConfig.navigation.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200">
              {siteConfig.loginButtonText}
            </Link>
            <Link href="/hazel-studio" className="rounded-full bg-[#d8b36d] px-4 py-2 text-sm font-semibold text-[#140f09]">
              {siteConfig.ctaButtonText}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
