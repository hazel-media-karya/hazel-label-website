cat > components/admin/AdminSettingsForm.tsx <<'EOF'
"use client";

import { useEffect, useState } from "react";

type SettingsState = {
  header: unknown;
  hero: unknown;
  footer: unknown;
};

export default function AdminSettingsForm() {
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [draft, setDraft] = useState({
    header: "",
    hero: "",
    footer: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/admin/site-settings", {
        cache: "no-store"
      });

      const json = await response.json();

      if (json.success) {
        const data = {
          header: json.data.header,
          hero: json.data.hero,
          footer: json.data.footer
        };

        setSettings(data);
        setDraft({
          header: JSON.stringify(data.header, null, 2),
          hero: JSON.stringify(data.hero, null, 2),
          footer: JSON.stringify(data.footer, null, 2)
        });
      } else {
        setMessage("Gagal memuat settings.");
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    try {
      const parsedSettings = {
        header: JSON.parse(draft.header),
        hero: JSON.parse(draft.hero),
        footer: JSON.parse(draft.footer)
      };

      const response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsedSettings)
      });

      const json = await response.json();

      if (json.success) {
        setSettings(parsedSettings);
        setMessage("Settings berhasil disimpan.");
      } else {
        setMessage("Gagal menyimpan settings.");
      }
    } catch {
      setMessage("Format JSON belum valid. Periksa tanda koma, kurung, dan kutip.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsBlock
        title="Header Settings"
        value={draft.header}
        onChange={(value) => setDraft((prev) => ({ ...prev, header: value }))}
      />

      <SettingsBlock
        title="Hero / Slider Settings"
        value={draft.hero}
        onChange={(value) => setDraft((prev) => ({ ...prev, hero: value }))}
      />

      <SettingsBlock
        title="Footer Settings"
        value={draft.footer}
        onChange={(value) => setDraft((prev) => ({ ...prev, footer: value }))}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
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

function SettingsBlock({
  title,
  value,
  onChange
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
        className="min-h-[260px] w-full rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-sm text-white outline-none focus:border-white/30"
      />
    </section>
  );
}
EOF
