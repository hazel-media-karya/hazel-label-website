import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center">
            <Image
              src={siteConfig.logoPath}
              alt={`${siteConfig.brandName} logo`}
              width={170}
              height={60}
              priority
              className="h-auto w-[150px] sm:w-[170px]"
            />
          </Link>

          <nav className="hidden gap-8 text-sm text-white/75 md:flex">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/custom" className="hover:text-white">Custom Studio</Link>
          </nav>
        </div>
      </header>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
            Admin Login
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            Sign in to Hazel Label
          </h1>

          <form action="/api/auth/login" method="POST" className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white px-6 py-4 font-bold text-black hover:bg-white/85"
            >
              Login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
