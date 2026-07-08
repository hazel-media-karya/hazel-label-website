"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type LinkItem = {
  label: string;
  href: string;
};

type HeaderSettings = {
  logoText: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  navItems: LinkItem[];
};

type HeroSlide = {
  title: string;
  description: string;
};

type HeroSettings = {
  title: string;
  slides: HeroSlide[];
};

type FooterSettings = {
  brand: string;
  description: string;
  email: string;
  instagram: string;
  address: string;
  copyright: string;
  links: LinkItem[];
};

const defaultHeader: HeaderSettings = {
  logoText: "HAZEL APPAREL",
  tagline: "Premium Custom Jersey & Apparel",
  ctaLabel: "Start Custom",
  ctaHref: "/hazel-studio",
  navItems: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Hazel Studio", href: "/hazel-studio" },
    { label: "Contact", href: "/contact" },
  ],
};

const defaultHero: HeroSettings = {
  title: "Design Your Custom Jersey with Hazel Apparel",
  slides: [
    {
      title: "Jersey 3D Preview",
      description:
        "Male/female avatar preview, body measurement, and 360 jersey simulation.",
    },
    {
      title: "8 Panel Design Upload",
      description:
        "Upload front, back, sleeves, collar, side, and detail panel design assets.",
    },
  ],
};

const defaultFooter: FooterSettings = {
  brand: "HAZEL APPAREL",
  description:
    "Premium custom jersey and apparel platform for teams, communities, events, and professional sportswear production.",
  email: "officialhazelapparel@gmail.com",
  instagram: "@officialhazelapparel",
  address: "Indonesia",
  copyright: "© 2026 Hazel Apparel. All rights reserved.",
  links: [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Hazel Studio", href: "/hazel-studio" },
    { label: "Contact", href: "/contact" },
  ],
};

function inputClass() {
  return "mt-2 w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30";
}

function labelClass() {
  return "text-sm font-medium text-zinc-300";
}

function cardClass() {
  return "rounded-2xl border border-white/10 bg-white/[0.035] p-6";
}

function normalizeLinks(value: unknown, fallback: LinkItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as Record<string, unknown>;

      if (typeof link.label !== "string" || typeof link.href !== "string") {
        return null;
      }

      return {
        label: link.label,
        href: link.href,
      };
    })
    .filter(Boolean) as LinkItem[];

  return links.length > 0 ? links : fallback;
}

function normalizeSlides(value: unknown, fallback: HeroSlide[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const slides = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const slide = item as Record<string, unknown>;

      return {
        title: typeof slide.title === "string" ? slide.title : "",
        description:
          typeof slide.description === "string" ? slide.description : "",
      };
    })
    .filter(Boolean) as HeroSlide[];

  return slides.length > 0 ? slides : fallback;
}

export function AdminSettingsForm() {
  const [header, setHeader] = useState<HeaderSettings>(defaultHeader);
  const [hero, setHero] = useState<HeroSettings>(defaultHero);
  const [footer, setFooter] = useState<FooterSettings>(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!active || !json.success) {
          return;
        }

        const data = json.data ?? {};

        const rawHeader = data.header ?? {};
        const rawHero = data.hero ?? {};
        const rawFooter = data.footer ?? {};

        setHeader({
          logoText:
            typeof rawHeader.logoText === "string"
              ? rawHeader.logoText
              : defaultHeader.logoText,
          tagline:
            typeof rawHeader.tagline === "string"
              ? rawHeader.tagline
              : defaultHeader.tagline,
          ctaLabel:
            typeof rawHeader.ctaLabel === "string"
              ? rawHeader.ctaLabel
              : defaultHeader.ctaLabel,
          ctaHref:
            typeof rawHeader.ctaHref === "string"
              ? rawHeader.ctaHref
              : defaultHeader.ctaHref,
          navItems: normalizeLinks(rawHeader.navItems, defaultHeader.navItems),
        });

        setHero({
          title:
            typeof rawHero.title === "string" ? rawHero.title : defaultHero.title,
          slides: normalizeSlides(rawHero.slides, defaultHero.slides),
        });

        setFooter({
          brand:
            typeof rawFooter.brand === "string"
              ? rawFooter.brand
              : defaultFooter.brand,
          description:
            typeof rawFooter.description === "string"
              ? rawFooter.description
              : defaultFooter.description,
          email:
            typeof rawFooter.email === "string"
              ? rawFooter.email
              : defaultFooter.email,
          instagram:
            typeof rawFooter.instagram === "string"
              ? rawFooter.instagram
              : defaultFooter.instagram,
          address:
            typeof rawFooter.address === "string"
              ? rawFooter.address
              : defaultFooter.address,
          copyright:
            typeof rawFooter.copyright === "string"
              ? rawFooter.copyright
              : defaultFooter.copyright,
          links: normalizeLinks(rawFooter.links, defaultFooter.links),
        });
      } catch {
        setMessage("Gagal memuat settings. Menggunakan data fallback.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          header,
          hero,
          footer,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error("Save failed");
      }

      setMessage("Settings berhasil disimpan.");
    } catch {
      setMessage("Gagal menyimpan settings.");
    } finally {
      setSaving(false);
    }
  }

  function updateHeaderNav(index: number, key: keyof LinkItem, value: string) {
    setHeader((current) => ({
      ...current,
      navItems: current.navItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateHeroSlide(index: number, key: keyof HeroSlide, value: string) {
    setHero((current) => ({
      ...current,
      slides: current.slides.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateFooterLink(index: number, key: keyof LinkItem, value: string) {
    setFooter((current) => ({
      ...current,
      links: current.links.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-zinc-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm text-zinc-200">
          {message}
        </div>
      ) : null}

      <section className={cardClass()}>
        <h2 className="text-xl font-semibold text-white">Header Settings</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className={labelClass()}>
            Tagline
            <input
              value={header.tagline}
              onChange={(event) =>
                setHeader({ ...header, tagline: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <label className={labelClass()}>
            CTA Label
            <input
              value={header.ctaLabel}
              onChange={(event) =>
                setHeader({ ...header, ctaLabel: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <label className={labelClass()}>
            CTA Link
            <input
              value={header.ctaHref}
              onChange={(event) =>
                setHeader({ ...header, ctaHref: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <div>
            <p className={labelClass()}>Logo Header</p>
            <div className="mt-2 flex min-h-[52px] items-center rounded-xl border border-white/10 bg-black/60 px-4">
              <Image
                src={siteConfig.logoPath}
                alt="Hazel Apparel logo"
                width={150}
                height={52}
                className="h-auto w-[150px] object-contain"
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Logo memakai file resmi Hazel Apparel dan tidak diedit dari form ini.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d8b36d]">
            Navigation Menu
          </h3>

          <div className="mt-4 space-y-4">
            {header.navItems.map((item, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateHeaderNav(index, "label", event.target.value)
                  }
                  className={inputClass()}
                  placeholder="Label"
                />

                <input
                  value={item.href}
                  onChange={(event) =>
                    updateHeaderNav(index, "href", event.target.value)
                  }
                  className={inputClass()}
                  placeholder="Link"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cardClass()}>
        <h2 className="text-xl font-semibold text-white">
          Hero / Slider Settings
        </h2>

        <label className={`${labelClass()} mt-6 block`}>
          Main Title
          <input
            value={hero.title}
            onChange={(event) =>
              setHero({ ...hero, title: event.target.value })
            }
            className={inputClass()}
          />
        </label>

        <div className="mt-8 space-y-6">
          {hero.slides.map((slide, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d8b36d]">
                Slide {index + 1}
              </h3>

              <label className={`${labelClass()} mt-5 block`}>
                Slide Title
                <input
                  value={slide.title}
                  onChange={(event) =>
                    updateHeroSlide(index, "title", event.target.value)
                  }
                  className={inputClass()}
                />
              </label>

              <label className={`${labelClass()} mt-5 block`}>
                Slide Description
                <textarea
                  value={slide.description}
                  onChange={(event) =>
                    updateHeroSlide(index, "description", event.target.value)
                  }
                  className={`${inputClass()} min-h-[110px]`}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className={cardClass()}>
        <h2 className="text-xl font-semibold text-white">Footer Settings</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className={labelClass()}>
            Brand
            <input
              value={footer.brand}
              onChange={(event) =>
                setFooter({ ...footer, brand: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <label className={labelClass()}>
            Email
            <input
              value={footer.email}
              onChange={(event) =>
                setFooter({ ...footer, email: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <label className={labelClass()}>
            Instagram
            <input
              value={footer.instagram}
              onChange={(event) =>
                setFooter({ ...footer, instagram: event.target.value })
              }
              className={inputClass()}
            />
          </label>

          <label className={labelClass()}>
            Address
            <input
              value={footer.address}
              onChange={(event) =>
                setFooter({ ...footer, address: event.target.value })
              }
              className={inputClass()}
            />
          </label>
        </div>

        <label className={`${labelClass()} mt-5 block`}>
          Description
          <textarea
            value={footer.description}
            onChange={(event) =>
              setFooter({ ...footer, description: event.target.value })
            }
            className={`${inputClass()} min-h-[120px]`}
          />
        </label>

        <label className={`${labelClass()} mt-5 block`}>
          Copyright
          <input
            value={footer.copyright}
            onChange={(event) =>
              setFooter({ ...footer, copyright: event.target.value })
            }
            className={inputClass()}
          />
        </label>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d8b36d]">
            Footer Links
          </h3>

          <div className="mt-4 space-y-4">
            {footer.links.map((item, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-2">
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateFooterLink(index, "label", event.target.value)
                  }
                  className={inputClass()}
                  placeholder="Label"
                />

                <input
                  value={item.href}
                  onChange={(event) =>
                    updateFooterLink(index, "href", event.target.value)
                  }
                  className={inputClass()}
                  placeholder="Link"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky bottom-5 z-20 flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-2xl transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default AdminSettingsForm;
