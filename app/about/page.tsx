import Link from "next/link";
import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";
import { SectionTitle } from "@/components/SectionTitle";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(216,179,109,0.16),_transparent_44%),linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <SectionTitle
            eyebrow="About Hazel"
            title="The premium custom apparel platform for modern teams and athletes"
            description="Hazel Label and Hazel Apparel combine digital design, premium fabrication, and a luxury customer experience into one refined workflow."
          />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 text-base leading-8 text-zinc-300">
              <p>
                Hazel Label was created to make elite custom jerseys feel effortless. From clubs and academies to athlete-led brands, each order is designed to feel tailored, polished, and ready for performance.
              </p>
              <p>
                Our platform brings together custom jersey production, premium textile selection, and digital previews so customers can approve every detail before production begins.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/35 p-6">
              <h3 className="text-xl font-semibold text-white">What makes Hazel special</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                <li>• Custom jersey design with luxury-grade detailing</li>
                <li>• Premium apparel for cycling, running, and teams</li>
                <li>• Digital customization and 3D previews</li>
                <li>• White-glove order flow from concept to delivery</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Custom Jersey",
              text: "Athlete-first kits with bold branding, premium fit, and elite-level finishing.",
            },
            {
              title: "Premium Apparel",
              text: "Performance wear crafted for cycling, running, club uniforms, and signature collections.",
            },
            {
              title: "Digital Customization",
              text: "Upload designs, preview 3D visuals, and manage every detail before checkout.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.text}</p>
            </div>
          ))}
        </section>

        <div className="rounded-[24px] border border-[#d8b36d]/25 bg-[#d8b36d]/10 p-6 text-sm leading-8 text-[#f1d7a2]">
          Ready to create a signature kit? <Link href="/hazel-studio" className="font-semibold text-white">Enter Hazel Studio</Link> and begin your premium apparel journey.
        </div>
      </main>
      <Footer />
    </div>
  );
}
