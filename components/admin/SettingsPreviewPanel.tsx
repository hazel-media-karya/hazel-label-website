"use client";

import { useEffect, useState } from "react";

type SettingsData = {
  header?: {
    logoText?: string;
    tagline?: string;
    ctaLabel?: string;
    ctaHref?: string;
    navItems?: Array<{
      label: string;
      href: string;
    }>;
  };
  hero?: {
    title?: string;
    eyebrow?: string;
    subtitle?: string;
    primaryButtonLabel?: string;
    secondaryButtonLabel?: string;
    slides?: Array<{
      title?: string;
      description?: string;
    }>;
  };
  footer?: {
    brand?: string;
    email?: string;
    address?: string;
    copyright?: string;
    instagram?: string;
    description?: string;
    links?: Array<{
      label: string;
      href: string;
    }>;
  };
};

export default function SettingsPreviewPanel() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!json.success) {
          throw new Error(json.message || "Failed to load settings");
        }

        setData(json.data);
      } catch {
        setMessage("Gagal memuat data preview.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Loading preview data...
      </div>
    );
  }

  if (message) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        {message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Header Preview
        </p>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {data?.header?.logoText || "HAZEL APPAREL"}
            </h2>
            <p className="text-sm text-zinc-400">
              {data?.header?.tagline || "Custom Jersey Platform"}
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-zinc-300">
            {(data?.header?.navItems || []).map((item) => (
              <span key={`${item.label}-${item.href}`}>
                {item.label}
              </span>
            ))}
          </nav>

          <div className="rounded-full border border-white/15 px-5 py-2 text-sm text-white">
            {data?.header?.ctaLabel || "Start Custom"}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Hero / Slider Preview
        </p>

        <h2 className="mb-3 text-3xl font-semibold text-white">
          {data?.hero?.title || "Hero title"}
        </h2>

        <p className="mb-5 max-w-2xl text-zinc-400">
          {data?.hero?.subtitle || "Hero subtitle"}
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {(data?.hero?.slides || []).map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <p className="mb-2 text-sm text-zinc-500">
                Slide {index + 1}
              </p>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {slide.title || "Untitled slide"}
              </h3>
              <p className="text-sm leading-6 text-zinc-400">
                {slide.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Footer Preview
        </p>

        <h2 className="mb-2 text-2xl font-semibold text-white">
          {data?.footer?.brand || "HAZEL APPAREL"}
        </h2>

        <p className="mb-4 max-w-2xl text-zinc-400">
          {data?.footer?.description || "Footer description"}
        </p>

        <div className="grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
          <p>Email: {data?.footer?.email || "-"}</p>
          <p>Instagram: {data?.footer?.instagram || "-"}</p>
          <p>Address: {data?.footer?.address || "-"}</p>
          <p>{data?.footer?.copyright || "-"}</p>
        </div>
      </section>
    </div>
  );
}
