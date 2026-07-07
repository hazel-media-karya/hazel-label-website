"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function HeaderRuntime() {
  const [settings, setSettings] = useState<unknown>(undefined);

  useEffect(() => {
    let active = true;

    async function loadHeaderSettings() {
      try {
        const response = await fetch("/api/admin/site-settings", {
          cache: "no-store",
        });

        const json = await response.json();

        if (active && json.success && json.data?.header) {
          setSettings(json.data.header);
        }
      } catch {
        // keep fallback header from siteConfig
      }
    }

    loadHeaderSettings();

    return () => {
      active = false;
    };
  }, []);

  return <Header settings={settings} />;
}
