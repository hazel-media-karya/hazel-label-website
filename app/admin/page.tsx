import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <SectionTitle
            eyebrow="Admin"
            title="Future content management workspace"
            description="This area is prepared for the next stage of Hazel Label administration, where site content, products, and order workflows can be managed centrally."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Header Settings", text: "Manage navigation, CTA labels, and brand content." },
              { title: "Slider Settings", text: "Edit hero slides and call-to-action messaging." },
              { title: "Footer Settings", text: "Update footer links, support details, and social channels." },
              { title: "Products", text: "Create and update premium apparel categories and product content." },
              { title: "Orders", text: "Review order journeys, status, and invoice flow." },
              { title: "Customers", text: "Track accounts, project history, and contact information." },
            ].map((card) => (
              <div key={card.title} className="rounded-[24px] border border-white/10 bg-black/35 p-6">
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{card.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
