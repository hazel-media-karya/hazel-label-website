import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";
import ProductsRuntime from "@/components/ProductsRuntime";
import ProductsHeroImage from "@/components/ProductsHeroImage";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderRuntime />

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,179,109,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-10">
            <p className="text-sm uppercase tracking-[0.45em] text-[#d8b36d]">
              Hazel Products
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Custom Jersey & Premium Apparel Collection
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
                  Pilihan produk Hazel untuk custom jersey, sportswear,
                  teamwear, komunitas, event, dan brand apparel premium.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <ProductsHeroImage />

                <p className="text-sm leading-7 text-zinc-300">
                  Semua produk dapat dikustom sesuai kebutuhan tim: warna,
                  logo, identitas komunitas, sponsor, dan konsep visual.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
                  <span>Custom Design</span>
                  <span>Teamwear</span>
                  <span>Order via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
          <ProductsRuntime />
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
