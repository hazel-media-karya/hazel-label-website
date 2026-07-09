import FooterRuntime from "@/components/FooterRuntime";
import Link from "next/link";

export default function CustomStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-bold tracking-wide text-white">
            HAZEL APPAREL
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <Link href="/custom" className="text-white">
              Custom Studio
            </Link>
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <section className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            Hazel Studio
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-bold">
            Create Your Custom Jersey
          </h1>

          <p className="mt-6 max-w-2xl text-gray-300 text-lg">
            Design your own cycling jersey with Hazel Apparel. Choose your
            jersey type, add your body measurements, upload your design
            references, and send your custom request directly to our production
            team.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold">1. Choose Model</h2>
              <p className="mt-2 text-gray-400">
                Select jersey type, fit model, and size option.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold">2. Upload Design</h2>
              <p className="mt-2 text-gray-400">
                Upload logo, artwork, color references, or jersey pattern.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold">3. Submit Order</h2>
              <p className="mt-2 text-gray-400">
                Send your custom request to the Hazel production team.
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
