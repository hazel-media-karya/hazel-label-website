"use client";

import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/HeroSlider";

export default function HeroSliderRuntime() {
  const [settings, setSettings] = useState<unknown>(undefined);

  useEffect(() => {
    let active = true;

    async function loadHeroSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (active && json.success && json.data?.hero) {
          setSettings(json.data.hero);
        }
      } catch {
        // keep fallback hero slider from siteConfig
      }
    }

    loadHeroSettings();

    return () => {
      active = false;
    };
  }, []);

  return <HeroSlider settings={settings} />;
}
