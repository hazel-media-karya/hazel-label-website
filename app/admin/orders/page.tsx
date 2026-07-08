import Link from "next/link";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen bg-[#030305] px-6 py-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-[#d8b36d]">
              Hazel Admin
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Orders / Inquiries
            </h1>

            <p className="mt-4 max-w-3xl text-zinc-400">
              Data customer yang masuk dari halaman Contact dan tombol Order
              produk Hazel.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white hover:text-black"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-10">
          <AdminOrdersPanel />
        </div>
      </div>
    </main>
  );
}
