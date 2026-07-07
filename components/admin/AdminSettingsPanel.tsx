"use client";

import { useEffect, useState } from "react";

type SiteSettingsData = {
  header: Record<string, unknown>;
  hero: Record<string, unknown>;
  footer: Record<string, unknown>;
};

export default function AdminSettingsPanel() {
  const [draft, setDraft] = useState({
    header: "",
    hero: "",
    footer: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        const data: SiteSettingsData = json.data;

        setDraft({
          header: JSON.stringify(data.header, null, 2),
          hero: JSON.stringify(data.hero, null, 2),
          footer: JSON.stringify(data.footer, null, 2),
        });
      } catch {
        setMessage("Gagal memuat site settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        header: JSON.parse(draft.header),
        hero: JSON.parse(draft.hero),
        footer: JSON.parse(draft.footer),
      };

      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to save settings");
      }

      setMessage("Settings berhasil disimpan.");
    } catch {
      setMessage("Gagal menyimpan. Pastikan format JSON valid.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        <SettingsEditor
          title="Header Settings"
          value={draft.header}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              header: value,
            }))
          }
        />

        <SettingsEditor
          title="Hero / Slider Settings"
          value={draft.hero}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              hero: value,
            }))
          }
        />

        <SettingsEditor
          title="Footer Settings"
          value={draft.footer}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              footer: value,
            }))
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {message && (
          <p className="text-sm text-zinc-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function SettingsEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="mb-3 text-lg font-semibold text-white">
        {title}
      </h2>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className="min-h-[520px] w-full resize-y rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-sm leading-6 text-zinc-100 outline-none transition focus:border-white/30"
      />
    </section>
  );
}
