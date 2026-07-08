import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";
import ProductsRuntime from "@/components/ProductsRuntime";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderRuntime />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <p className="text-sm uppercase tracking-[0.45em] text-[#d8b36d]">
            Hazel Products
          </p>

          <div className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Custom Jersey & Apparel Collection
            </h1>

            <p className="mt-5 text-base leading-8 text-zinc-400">
              Pilihan produk Hazel untuk custom jersey, sportswear, teamwear,
              dan kebutuhan apparel premium komunitas, event, maupun brand.
            </p>
          </div>

          <div className="mt-12">
            <ProductsRuntime />
          </div>
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
