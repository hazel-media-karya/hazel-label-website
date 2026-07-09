"use client";

import Image from "next/image";
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

function text(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeLinks(value: unknown): FooterLink[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as {
        label?: unknown;
        href?: unknown;
      };

      if (typeof link.label !== "string" || typeof link.href !== "string") {
        return null;
      }

      return {
        label: link.label,
        href: link.href,
      };
    })
    .filter(Boolean) as FooterLink[];

  return links.length > 0 ? links : undefined;
}

function normalizeFooterSettings(rawFooter: unknown): FooterSettings {
  if (!rawFooter || typeof rawFooter !== "object") {
    return {};
  }

  const footer = rawFooter as Record<string, unknown>;

  return {
    brand: typeof footer.brand === "string" ? footer.brand : undefined,
    email: typeof footer.email === "string" ? footer.email : undefined,
    address: typeof footer.address === "string" ? footer.address : undefined,
    copyright: typeof footer.copyright === "string" ? footer.copyright : undefined,
    instagram: typeof footer.instagram === "string" ? footer.instagram : undefined,
    description: typeof footer.description === "string" ? footer.description : undefined,
    links: normalizeLinks(footer.links),
  };
}

export default function FooterRuntime() {
  const [settings, setSettings] = useState<FooterSettings>({});

  useEffect(() => {
    let active = true;

    async function loadFooterSettings() {
      try {
        const response = await fetch("/api/public/site-settings", {
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

  const brand = text(settings.brand, siteConfig.brandName || "HAZEL APPAREL");
  const description = text(
    settings.description,
    "Luxury custom sportswear and premium apparel experiences crafted for modern teams and athletes."
  );
  const email = text(settings.email, "officialhazelapparel@gmail.com");
  const address = text(settings.address, "Indonesia");
  const instagram = text(settings.instagram, "@officialhazelapparel");
  const copyright = text(
    settings.copyright,
    `© 2026 ${brand}. All rights reserved.`
  );

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
    <footer className="border-t border-white/10 bg-black px-6 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="inline-flex">
            <Image
              src={siteConfig.logoPath}
              alt={`${brand} logo`}
              width={150}
              height={54}
              className="h-auto w-[150px] object-contain"
            />
          </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-zinc-400">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-zinc-400">
            <span>{instagram}</span>
            <span>LinkedIn</span>
            <span>WhatsApp</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d8b36d]">
            Navigation
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-zinc-400">
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
          <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d8b36d]">
            Contact
          </h3>

          <div className="mt-5 space-y-3 text-sm text-zinc-400">
            <p>{email}</p>
            <p>{address}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {copyright}
      </div>
    </footer>
  );
}
