"use client";

import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { siteConfig } from "@/lib/site-config";

type HeroSliderItem = (typeof siteConfig.heroSliderItems)[number];

type HeroSliderRuntimeSettings = {
  slides: HeroSliderItem[];
};

type DatabaseHeroSlide = {
  title?: unknown;
  description?: unknown;
};

function toText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : fallback;
}

function buildSafeHeroSettings(rawHero: unknown): HeroSliderRuntimeSettings | undefined {
  if (!rawHero || typeof rawHero !== "object") {
    return undefined;
  }

  const hero = rawHero as {
    slides?: unknown;
  };

  if (!Array.isArray(hero.slides) || hero.slides.length === 0) {
    return undefined;
  }

  const databaseSlides = hero.slides as DatabaseHeroSlide[];
  const fallbackSlides = siteConfig.heroSliderItems;

  const slides = fallbackSlides.map((fallbackSlide, index) => {
    const databaseSlide = databaseSlides[index];

    if (!databaseSlide || typeof databaseSlide !== "object") {
      return fallbackSlide;
    }

    return {
      ...fallbackSlide,
      title: toText(databaseSlide.title, fallbackSlide.title),
    };
  });

  return {
    slides,
  };
}

export default function HeroSliderRuntime() {
  const [settings, setSettings] = useState<HeroSliderRuntimeSettings | undefined>(
    undefined
  );

  useEffect(() => {
    let active = true;

    async function loadHeroSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (!active || !json.success) {
          return;
        }

        const safeSettings = buildSafeHeroSettings(json.data?.hero);

        if (safeSettings) {
          setSettings(safeSettings);
        }
      } catch {
        // fallback to static siteConfig hero slider
      }
    }

    loadHeroSettings();

    return () => {
      active = false;
    };
  }, []);

  return <HeroSlider settings={settings} />;
}
