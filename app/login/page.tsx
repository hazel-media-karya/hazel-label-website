import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-5">
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.brandName} logo`}
              width={170}
              height={60}
              priority
              className="h-auto w-[150px] sm:w-[170px]"
            />
            <span className="hidden text-sm text-zinc-500 lg:block">
              Premium Custom Jersey & Apparel
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-300 lg:flex">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/hazel-studio" className="hover:text-white">Hazel Studio</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">
            Admin Login
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-white">
            Access Hazel Admin
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Sign in using the admin credentials configured for this website.
          </p>

          <form action="/api/auth/login" method="post" className="mt-8 space-y-4">
            <input type="hidden" name="next" value="/admin" />

            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@hazellabel.com"
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Password</span>
              <input
                type="password"
                name="password"
                required
                placeholder="Enter password"
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e8c47a]"
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
