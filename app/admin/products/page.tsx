import AdminProductsForm from "@/components/admin/AdminProductsForm";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-[#030305] px-6 py-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
          Hazel Admin
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Products
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-400">
          Kelola produk custom jersey dan apparel Hazel. Produk yang aktif nanti
          bisa ditampilkan di halaman Products.
        </p>

        <div className="mt-10">
          <AdminProductsForm />
        </div>
      </div>
    </main>
  );
}
