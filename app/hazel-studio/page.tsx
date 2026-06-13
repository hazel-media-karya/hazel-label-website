import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/site-config";

export default function HazelStudioPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(216,179,109,0.16),_transparent_44%),linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <SectionTitle
            eyebrow="Hazel Studio"
            title="A premium 3D workflow for custom jersey creation"
            description="Design, preview, and approve your apparel before production begins with a streamlined digital studio experience."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {siteConfig.hazelStudioFeatures.map((feature) => (
              <div key={feature.title} className="rounded-[24px] border border-white/10 bg-black/35 p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">The Hazel Studio experience</h3>
            <p className="mt-3 text-sm leading-8 text-zinc-400">
              Start by registering your profile, upload your 8-panel design, confirm your body measurements, and review a full 3D preview before moving to checkout.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#d8b36d]/25 bg-[#d8b36d]/10 p-6 text-sm leading-8 text-[#f1d7a2]">
            Every custom order includes a polished invoice, order tracking, and a premium production handoff.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
