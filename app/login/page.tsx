import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-16 sm:px-8 lg:px-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">Login</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Access your Hazel account</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">Sign in to continue your custom apparel project or manage your orders.</p>

          <form className="mt-8 space-y-4">
            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Email</span>
              <input type="email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="you@example.com" />
            </label>
            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Password</span>
              <input type="password" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="Enter password" />
            </label>
            <button type="button" className="w-full rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            No account yet? <Link href="/contact" className="text-[#f1d7a2]">Register</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
