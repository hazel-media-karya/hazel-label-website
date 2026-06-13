import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/site-config";

const steps = [
  { title: "Register", text: "Set up your team or athlete profile in minutes." },
  { title: "Upload Design", text: "Drop your artwork, badge, or sponsor mark into the studio." },
  { title: "Preview in 3D", text: "See your jersey live with precise panel and fit previews." },
  { title: "Checkout", text: "Finalize sizing, colors, and delivery in a single flow." },
];

const testimonials = [
  {
    quote: "The 3D preview made it effortless to approve our club kit before production.",
    name: "Mina Alvarez",
    role: "Head Coach, Northwave FC",
  },
  {
    quote: "Our sponsor integration and delivery turnaround felt as premium as our brand.",
    name: "Jordan Lee",
    role: "Performance Lead, Apex Running",
  },
  {
    quote: "Hazel Studio helped us launch a full custom collection without the usual friction.",
    name: "Alicia Tan",
    role: "Founder, Studio Nine",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />

      <main id="home" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 sm:px-8 lg:px-10">
        <HeroSlider />

        <section id="about" className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <SectionTitle
            eyebrow="How it works"
            title="From concept to delivery in four streamlined steps"
            description="Hazel Label brings together premium fabrication, customization, and production insight into one elegant workflow."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[22px] border border-white/10 bg-black/35 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8b36d]/45 bg-[#d8b36d]/10 text-sm font-semibold text-[#f2d6a1]">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="studio" className="grid gap-6 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-6 shadow-[0_0_60px_rgba(0,0,0,0.3)] backdrop-blur-md lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">Hazel Studio</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">A premium studio for elite kit creation</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-zinc-400">
              Design for men and women, review body measurements, upload full 8-panel patterns, and approve 360° previews before production begins.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Male & Female Avatar Preview",
                "Body Measurements",
                "8-Panel Jersey Upload",
                "360° Preview",
                "Invoice Generation",
                "Order Tracking",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#060606] p-4">
            <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400">
              <span>Studio preview</span>
              <span className="text-[#d8b36d]">360°</span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(216,179,109,0.16),_transparent_60%)] p-4">
                <div className="flex justify-center gap-4">
                  <div className="h-32 w-20 rounded-[30px] border border-white/10 bg-zinc-900" />
                  <div className="h-32 w-20 rounded-[30px] border border-[#d8b36d]/35 bg-zinc-900" />
                </div>
                <div className="mt-4 rounded-[16px] border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">
                  Male / Female avatar concepts with real-time jersey fitting.
                </div>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-black/35 p-4">
                <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-zinc-500">Measurement summary</div>
                  <div className="space-y-2 text-sm text-zinc-300">
                    <div className="flex justify-between rounded-xl bg-white/5 px-3 py-2"><span>Chest</span><span>104 cm</span></div>
                    <div className="flex justify-between rounded-xl bg-white/5 px-3 py-2"><span>Waist</span><span>82 cm</span></div>
                    <div className="flex justify-between rounded-xl bg-white/5 px-3 py-2"><span>Length</span><span>69 cm</span></div>
                  </div>
                </div>
                <div className="mt-3 rounded-[16px] border border-[#d8b36d]/25 bg-[#d8b36d]/10 p-3 text-sm text-[#f2d6a1]">
                  Live invoice generation and order tracking available with every custom order.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <SectionTitle
            eyebrow="Products"
            title="Custom apparel tailored for performance and prestige"
            description="Choose from premium jerseys and fully bespoke apparel built for sports clubs, brands, and events."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {siteConfig.productCategories.map((category) => (
              <ProductCard key={category.title} category={category} />
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#060606] p-6 sm:p-8">
          <SectionTitle
            eyebrow="Testimonials"
            title="Trusted by athletes and teams worldwide"
            description="Digital-first design, premium quality, and decisive production support for every launch."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm leading-8 text-zinc-300">“{item.quote}”</p>
                <div className="mt-6">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-zinc-500">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
