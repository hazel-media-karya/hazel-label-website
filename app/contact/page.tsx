import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)]">
          <SectionTitle
            eyebrow="Contact"
            title="Let’s build your next premium custom apparel order"
            description="Share your vision and our team will help you shape a polished, premium experience from first concept to delivery."
          />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[24px] border border-white/10 bg-black/35 p-6">
              <h3 className="text-xl font-semibold text-white">Reach out</h3>
              <p className="mt-3 text-sm leading-8 text-zinc-400">
                Email us at {siteConfig.contactEmail} or use WhatsApp for a quick conversation about your order, team kit, or studio project.
              </p>
              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Email: {siteConfig.contactEmail}</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">WhatsApp: +1 (800) 555-0148</div>
              </div>
            </div>

            <form className="rounded-[24px] border border-white/10 bg-white/5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-zinc-300">
                  <span className="mb-2 block">Name</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="Your name" />
                </label>
                <label className="text-sm text-zinc-300">
                  <span className="mb-2 block">Email</span>
                  <input type="email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="you@example.com" />
                </label>
              </div>
              <label className="mt-4 block text-sm text-zinc-300">
                <span className="mb-2 block">Project</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="Cycling jersey, team kit, or custom apparel" />
              </label>
              <label className="mt-4 block text-sm text-zinc-300">
                <span className="mb-2 block">Message</span>
                <textarea className="min-h-36 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="Tell us about your goals, timeline, and design ideas." />
              </label>
              <button type="button" className="mt-5 rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
