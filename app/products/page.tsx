import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/site-config";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <SectionTitle
            eyebrow="Products"
            title="Premium apparel for performance, teams, and signature collections"
            description="Choose from a refined range of custom jerseys and apparel designed for movement, branding, and elevated presentation."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {siteConfig.productCategories.map((category) => (
              <ProductCard key={category.title} category={category} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">Built for elite standards</h3>
            <p className="mt-3 text-sm leading-8 text-zinc-400">
              Every product can be customized with your team colors, sponsor marks, and personal details while maintaining a premium feel from concept through delivery.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#060606] p-6">
            <h3 className="text-xl font-semibold text-white">Ideal for</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-400">
              <li>• Cycling clubs and race teams</li>
              <li>• Running squads and event gear</li>
              <li>• Corporate wellness uniforms</li>
              <li>• Brand launches and custom capsules</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
