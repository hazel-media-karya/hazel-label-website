cat > app/admin/settings/page.tsx <<'EOF'
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Hazel Admin
        </p>

        <h1 className="mb-3 text-3xl font-semibold">
          Site Settings
        </h1>

        <p className="mb-8 max-w-2xl text-zinc-400">
          Atur Header, Hero/Slider, dan Footer homepage Hazel Apparel dari admin dashboard.
        </p>

        <AdminSettingsForm />
      </div>
    </main>
  );
}
EOF
