"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSettings = {
  brand?: string;
  email?: string;
  address?: string;
  copyright?: string;
  instagram?: string;
  description?: string;
  links?: FooterLink[];
};

function normalizeFooterSettings(rawFooter: unknown): FooterSettings {
  if (!rawFooter || typeof rawFooter !== "object") {
    return {};
  }

  const footer = rawFooter as FooterSettings;

  return {
    brand: typeof footer.brand === "string" ? footer.brand : undefined,
    email: typeof footer.email === "string" ? footer.email : undefined,
    address: typeof footer.address === "string" ? footer.address : undefined,
    copyright: typeof footer.copyright === "string" ? footer.copyright : undefined,
    instagram: typeof footer.instagram === "string" ? footer.instagram : undefined,
    description: typeof footer.description === "string" ? footer.description : undefined,
    links: Array.isArray(footer.links) ? footer.links : undefined,
  };
}

export default function FooterRuntime() {
  const [settings, setSettings] = useState<FooterSettings>({});

  useEffect(() => {
    let active = true;

    async function loadFooterSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!active || !json.success) {
          return;
        }

        setSettings(normalizeFooterSettings(json.data?.footer));
      } catch {
        // keep fallback footer
      }
    }

    loadFooterSettings();

    return () => {
      active = false;
    };
  }, []);

  const brand = settings.brand || siteConfig.brandName || "HAZEL APPAREL";
  const description =
    settings.description ||
    "Premium custom jersey and apparel platform for teams, communities, events, and professional sportswear production.";
  const email = settings.email || "officialhazelapparel@gmail.com";
  const address = settings.address || "Indonesia";
  const instagram = settings.instagram || "@officialhazelapparel";
  const copyright =
    settings.copyright || `© 2026 ${brand}. All rights reserved.`;

  const links =
    settings.links && settings.links.length > 0
      ? settings.links
      : [
          { label: "About", href: "/about" },
          { label: "Products", href: "/products" },
          { label: "Hazel Studio", href: "/hazel-studio" },
          { label: "Contact", href: "/contact" },
        ];

  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Hazel Apparel
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            {brand}
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Navigation
          </h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
            {links.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Contact
          </h3>

          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>{email}</p>
            <p>{instagram}</p>
            <p>{address}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {copyright}
      </div>
    </footer>
  );
}
