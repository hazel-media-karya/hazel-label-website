"use client";

import { useEffect, useState } from "react";

type SiteSettingsData = {
  header: Record<string, unknown>;
  hero: Record<string, unknown>;
  footer: Record<string, unknown>;
};

export default function AdminSettingsPanel() {
  const [data, setData] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("Gagal memuat site settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Loading site settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <SettingsCard title="Header Settings" value={data?.header} />
      <SettingsCard title="Hero / Slider Settings" value={data?.hero} />
      <SettingsCard title="Footer Settings" value={data?.footer} />
    </div>
  );
}

function SettingsCard({
  title,
  value,
}: {
  title: string;
  value?: Record<string, unknown>;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-3 text-lg font-semibold text-white">
        {title}
      </h2>

      <pre className="overflow-auto rounded-xl bg-black/50 p-4 text-sm text-zinc-300">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}
