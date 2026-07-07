import SettingsPreviewPanel from "@/components/admin/SettingsPreviewPanel";

export const dynamic = "force-dynamic";

export default function AdminSettingsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Hazel Admin
        </p>

        <h1 className="mb-3 text-3xl font-semibold">
          Site Settings Preview
        </h1>

        <p className="mb-8 max-w-2xl text-zinc-400">
          Halaman ini hanya untuk preview data Header, Hero/Slider, dan Footer dari database. Homepage utama belum disentuh.
        </p>

        <SettingsPreviewPanel />
      </div>
    </main>
  );
}
