"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

type HeroSliderItem = (typeof siteConfig.heroSliderItems)[number];

type HeroSettings = {
  slides?: HeroSliderItem[];
};

function normalizeHeroSettings(settings?: unknown): HeroSettings {
  if (!settings || typeof settings !== "object") {
    return {};
  }

  const value = settings as {
    slides?: unknown;
  };

  if (!Array.isArray(value.slides)) {
    return {};
  }

  const slides = value.slides.filter(
    (item) => item && typeof item === "object"
  ) as HeroSliderItem[];

  return {
    slides,
  };
}

export function HeroSlider({
  settings,
}: {
  settings?: unknown;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const hero = normalizeHeroSettings(settings);
  const heroSliderItems =
    hero.slides && hero.slides.length > 0
      ? hero.slides
      : siteConfig.heroSliderItems;
  const slide =
    heroSliderItems[Math.min(activeSlide, heroSliderItems.length - 1)] ??
    heroSliderItems[0];

  return (
    <section className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(216,179,109,0.16),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))] p-6 shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex rounded-full border border-[#d8b36d]/40 bg-[#d8b36d]/10 px-3 py-1 text-sm text-[#f2d6a1]">
          {slide.eyebrow}
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {slide.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">{slide.subtitle}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={slide.primaryHref} className="rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
            {slide.primaryCtaText}
          </Link>
          <Link href={slide.secondaryHref} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d8b36d] hover:text-[#f2d6a1]">
            {slide.secondaryCtaText}
          </Link>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          {slide.badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#080808]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex gap-3 rounded-[22px] border border-white/10 bg-black/40 p-3">
          <div className="flex flex-col gap-2">
            {['Front', 'Back', 'Left', 'Right', 'Zoom', 'Rotate'].map((control, index) => (
              <button
                key={control}
                type="button"
                className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                  index === 0
                    ? "border-[#d8b36d] bg-[#d8b36d]/15 text-[#f2d6a1]"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:border-[#d8b36d]/50 hover:text-white"
                }`}
              >
                {control}
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-[20px] border border-white/10 bg-[linear-gradient(145deg,_rgba(216,179,109,0.16),_rgba(255,255,255,0.04))] p-3">
            <div className="mb-3 flex items-center justify-between rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
              <span>3D Preview</span>
              <span className="text-[#d8b36d]">Live</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0f0f0f] p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(216,179,109,0.2),_transparent_55%)]" />
                <svg viewBox="0 0 320 420" className="relative h-full w-full" aria-label="Jersey preview illustration">
                  <rect x="92" y="70" width="136" height="250" rx="52" fill="#111111" stroke="#d8b36d" strokeWidth="3" />
                  <path d="M118 142c16-22 68-22 84 0l18 28-22 10-6 84h-18l-6-84-28-10z" fill="#f8f2e8" fillOpacity="0.86" />
                  <path d="M158 96c10 0 18 8 18 18v22c0 8-6 14-14 14h-8c-8 0-14-6-14-14v-22c0-10 8-18 18-18z" fill="#d8b36d" />
                  <circle cx="128" cy="204" r="6" fill="#d8b36d" />
                  <circle cx="192" cy="204" r="6" fill="#d8b36d" />
                  <path d="M118 330c20 26 66 24 86 0" stroke="#d8b36d" strokeWidth="4" strokeLinecap="round" />
                  <rect x="140" y="154" width="42" height="20" rx="10" fill="#0f0f0f" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Upload Design</div>
                  <div className="rounded-2xl border border-dashed border-[#d8b36d]/40 bg-[#d8b36d]/10 p-3 text-sm text-zinc-300">
                    Drop your jersey artwork here
                  </div>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Color</div>
                  <div className="flex gap-2">
                    {['#d8b36d', '#ffffff', '#1b1b1b'].map((color) => (
                      <span key={color} className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Player</div>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Name</div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Number 07</div>
                  </div>
                </div>
                <button type="button" className="w-full rounded-full bg-[#d8b36d] px-4 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" onClick={() => setActiveSlide((prev) => (prev === 0 ? heroSliderItems.length - 1 : prev - 1))} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            ←
          </button>
          {heroSliderItems.map((item, index) => (
            <button key={item.title} type="button" onClick={() => setActiveSlide(index)} className={`h-2.5 w-2.5 rounded-full ${index === activeSlide ? "bg-[#d8b36d]" : "bg-white/20"}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
          <button type="button" onClick={() => setActiveSlide((prev) => (prev + 1) % heroSliderItems.length)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
