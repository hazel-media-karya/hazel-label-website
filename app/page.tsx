import Image from "next/image";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Hazel Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

const featureBadges = [
  "Premium Quality Fabrics",
  "Advanced 3D Customization",
  "Worldwide Shipping",
];

const steps = [
  { title: "Register", text: "Set up your team or athlete profile in minutes." },
  { title: "Upload Design", text: "Drop your artwork, badge, or sponsor mark into the studio." },
  { title: "Preview in 3D", text: "See your jersey live with precise panel and fit previews." },
  { title: "Checkout", text: "Finalize sizing, colors, and delivery in a single flow." },
];

const products = [
  {
    title: "Cycling Jersey",
    description: "Aerodynamic race gear with premium sublimation and tech detailing.",
    accent: "from-amber-300/20 via-amber-400/10 to-transparent",
  },
  {
    title: "Running Jersey",
    description: "Lightweight performance apparel for clubs, events, and training squads.",
    accent: "from-slate-200/15 via-slate-100/10 to-transparent",
  },
  {
    title: "Team Jersey",
    description: "Custom uniforms designed for elite teams and growing communities.",
    accent: "from-amber-400/20 via-transparent to-stone-200/10",
  },
  {
    title: "Custom Apparel",
    description: "Launch a full collection with personalized fit, trim, and branding.",
    accent: "from-zinc-300/15 via-zinc-100/10 to-transparent",
  },
];

const testimonials = [
  {
    quote:
      "The 3D preview made it effortless to approve our club kit before production.",
    name: "Mina Alvarez",
    role: "Head Coach, Northwave FC",
  },
  {
    quote:
      "Our sponsor integration and delivery turnaround felt as premium as our brand.",
    name: "Jordan Lee",
    role: "Performance Lead, Apex Running",
  },
  {
    quote:
      "Hazel Studio helped us launch a full custom collection without the usual friction.",
    name: "Alicia Tan",
    role: "Founder, Studio Nine",
  },
];

const footerSections = [
  {
    title: "Company",
    links: ["About Us", "Our Story", "Careers"],
  },
  {
    title: "Products",
    links: ["Cycling Jersey", "Running Jersey", "Team Jersey", "Custom Apparel"],
  },
  {
    title: "Support",
    links: ["Help Center", "Shipping", "Returns"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
        <a href="#home" className="flex items-center gap-3">
          <Image src="/logo-hazel-white.png" alt="Hazel Label logo" width={144} height={44} priority />
        </a>
        <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-[#d8b36d] hover:text-white sm:inline-flex">
            Login
          </a>
          <a
            href="#products"
            className="rounded-full bg-[#d8b36d] px-4 py-2 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]"
          >
            Start Custom
          </a>
        </div>
      </header>

      <main id="home" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 sm:px-8 lg:px-10">
        <section className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(216,179,109,0.16),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))] p-6 shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#d8b36d]/40 bg-[#d8b36d]/10 px-3 py-1 text-sm text-[#f2d6a1]">
              Premium sports-tech custom apparel
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Create Your Custom Jersey in 3D
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
              Build elite team uniforms, athlete gear, and signature apparel with cinematic previews, precise branding, and luxury-grade finishes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#studio" className="rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
                Design Now
              </a>
              <a href="#products" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d8b36d] hover:text-[#f2d6a1]">
                Explore Products
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {featureBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#080808]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex gap-3 rounded-[22px] border border-white/10 bg-black/40 p-3">
              <div className="flex flex-col gap-2">
                {['Front', 'Back', 'Left', 'Right', 'Zoom', 'Rotate'].map((control, index) => (
                  <button
                    key={control}
                    className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                      index === 0
                        ? "border-[#d8b36d] bg-[#d8b36d]/15 text-[#f2d6a1]"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-[#d8b36d]/50 hover:text-white"
                    }`}
                  >
                    {control}
                  </button>
                ))}
              </div>
              <div className="flex-1 rounded-[20px] border border-white/10 bg-[linear-gradient(145deg,_rgba(216,179,109,0.16),_rgba(255,255,255,0.04))] p-3">
                <div className="mb-3 flex items-center justify-between rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
                  <span>3D Preview</span>
                  <span className="text-[#d8b36d]">Live</span>
                </div>
                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0f0f0f] p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(216,179,109,0.2),_transparent_55%)]" />
                    <svg viewBox="0 0 320 420" className="relative h-full w-full" aria-label="Jersey preview illustration">
                      <rect x="92" y="70" width="136" height="250" rx="52" fill="#111111" stroke="#d8b36d" strokeWidth="3" />
                      <path d="M118 142c16-22 68-22 84 0l18 28-22 10-6 84h-18l-6-84-28-10z" fill="#f8f2e8" fillOpacity="0.86" />
                      <path d="M158 96c10 0 18 8 18 18v22c0 8-6 14-14 14h-8c-8 0-14-6-14-14v-22c0-10 8-18 18-18z" fill="#d8b36d" />
                      <circle cx="128" cy="204" r="6" fill="#d8b36d" />
                      <circle cx="192" cy="204" r="6" fill="#d8b36d" />
                      <path d="M118 330c20 26 66 24 86 0" stroke="#d8b36d" strokeWidth="4" strokeLinecap="round" />
                      <rect x="140" y="154" width="42" height="20" rx="10" fill="#0f0f0f" />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Upload Design</div>
                      <div className="rounded-2xl border border-dashed border-[#d8b36d]/40 bg-[#d8b36d]/10 p-3 text-sm text-zinc-300">
                        Drop your jersey artwork here
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Color</div>
                      <div className="flex gap-2">
                        {['#d8b36d', '#ffffff', '#1b1b1b'].map((color) => (
                          <span key={color} className="h-7 w-7 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-black/30 p-3">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-zinc-500">Player</div>
                      <div className="space-y-2 text-sm text-zinc-300">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Name</div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Number 07</div>
                      </div>
                    </div>
                    <button className="w-full rounded-full bg-[#d8b36d] px-4 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">How it works</p>
              <h2 className="text-3xl font-semibold text-white">From concept to delivery in four streamlined steps</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Hazel Label brings together premium fabrication, customization, and production insight into one elegant workflow.
            </p>
          </div>
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
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">Products</p>
              <h2 className="text-3xl font-semibold text-white">Custom apparel tailored for performance and prestige</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Choose from premium jerseys and fully bespoke apparel built for sports clubs, brands, and events.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.title} className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#060606]">
                <div className={`h-36 bg-gradient-to-br ${product.accent}`}>
                  <div className="mx-auto flex h-full max-w-[90%] items-end justify-center px-4 pb-4">
                    <div className="h-24 w-20 rounded-[30px] border border-white/10 bg-black/55" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#060606] p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">Testimonials</p>
              <h2 className="text-3xl font-semibold text-white">Trusted by athletes and teams worldwide</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400">
              Digital-first design, premium quality, and decisive production support for every launch.
            </p>
          </div>
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

      <footer id="contact" className="border-t border-white/10 bg-[#020202]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          <div className="max-w-sm">
            <Image src="/logo-hazel-white.png" alt="Hazel Label logo" width={140} height={40} />
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Luxury custom sportswear and premium apparel experiences crafted for modern teams and athletes.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b36d]">{section.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                  {section.links.map((link) => (
                    <li key={link}>{link}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b36d]">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>hello@hazellabel.com</li>
                <li>+1 (800) 555-0148</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-zinc-500 sm:px-8 lg:px-10">
          © 2026 Hazel Label. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
