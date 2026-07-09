import Link from "next/link";
import FooterRuntime from "@/components/FooterRuntime";

export default function CustomStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* STATIC HEADER - tidak pakai HeaderRuntime supaya tidak kedip */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/hazel-logo-white.png"
              alt="Hazel Apparel"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/products" className="transition hover:text-white">
              Products
            </Link>

            <Link href="/custom" className="text-white">
              Custom Studio
            </Link>

            <Link href="/login" className="transition hover:text-white">
              Login
            </Link>
          </nav>

          <div className="flex items-center md:hidden">
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="border-b border-white/10 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">
              Hazel Studio
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              Create Your Custom Jersey
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
              Design your own cycling jersey with Hazel Apparel. Choose your
              jersey type, add your body measurements, upload your design
              references, and send your custom request directly to our
              production team.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                <h2 className="text-2xl font-bold text-white">
                  1. Choose Model
                </h2>
                <p className="mt-4 text-base leading-7 text-blue-100/75">
                  Select jersey type, fit model, and size option.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                <h2 className="text-2xl font-bold text-white">
                  2. Upload Design
                </h2>
                <p className="mt-4 text-base leading-7 text-blue-100/75">
                  Upload logo, artwork, color references, or jersey pattern.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
                <h2 className="text-2xl font-bold text-white">
                  3. Submit Order
                </h2>
                <p className="mt-4 text-base leading-7 text-blue-100/75">
                  Send your custom request to the Hazel production team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM PLACEHOLDER */}
        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                Custom Order
              </p>

              <h2 className="mt-5 text-4xl font-bold text-white md:text-5xl">
                Start Your Jersey Request
              </h2>

              <p className="mt-6 text-lg leading-8 text-white/70">
                Fill in your basic jersey details. Our team will review your
                request and contact you for design confirmation, sizing, and
                production details.
              </p>
            </div>

            <form className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="+62..."
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Jersey Type
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40">
                    <option>Cycling Jersey</option>
                    <option>Running Jersey</option>
                    <option>Event Jersey</option>
                    <option>Team Apparel</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Size Option
                  </label>
                  <select className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40">
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                    <option>Custom Measurement</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Example: 12"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Main Color
                  </label>
                  <input
                    type="text"
                    placeholder="Black, blue, red..."
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/70">
                    Design Notes
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us your jersey concept, logo placement, color references, or special request."
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-white px-6 py-4 font-bold text-black transition hover:bg-white/85"
                  >
                    Submit Custom Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
