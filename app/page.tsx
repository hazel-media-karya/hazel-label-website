import Link from "next/link";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-wide">
            HAZEL APPAREL
          </Link>

          <nav className="hidden gap-8 text-sm text-white/75 md:flex">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/custom" className="hover:text-white">Custom Studio</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
          </nav>
        </div>
      </header>

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.35em] text-yellow-300">
            Hazel Apparel
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
            Premium Custom Jersey & Apparel
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
            Custom jersey and sportswear platform for teams, communities,
            events, and professional apparel production.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/custom"
              className="rounded-full bg-white px-7 py-3 font-bold text-black hover:bg-white/85"
            >
              Start Custom Order
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-white/20 px-7 py-3 font-bold text-white hover:border-white/50"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© Hazel Apparel</p>
          <p>officialhazelapparel@gmail.com</p>
        </div>
      </footer>
    </main>
  );
}
