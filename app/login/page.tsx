import Link from "next/link";
import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams?.next ?? "/admin";
  const hasError = resolvedSearchParams?.error === "invalid";

  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <HeaderRuntime />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 py-16 sm:px-8 lg:px-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))] p-8 shadow-[0_0_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d8b36d]">Temporary Admin Access</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Access the Hazel admin workspace</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-400">Use the environment-based credentials configured for this deployment to continue into the private admin area.</p>

          <form action="/api/auth/login" method="post" className="mt-8 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Email</span>
              <input type="email" name="email" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="admin@hazellabel.com" required />
            </label>
            <label className="block text-sm text-zinc-300">
              <span className="mb-2 block">Password</span>
              <input type="password" name="password" className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none ring-0" placeholder="Enter password" required />
            </label>
            {hasError ? (
              <p className="rounded-2xl border border-[#d8b36d]/30 bg-[#d8b36d]/10 px-3 py-2 text-sm text-[#f1d7a2]">
                Invalid admin credentials. Please try again.
              </p>
            ) : null}
            <button type="submit" className="w-full rounded-full bg-[#d8b36d] px-5 py-3 text-sm font-semibold text-[#140f09] transition hover:bg-[#e8c47a]">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            Need a temporary access setup? <Link href="/contact" className="text-[#f1d7a2]">Reach out</Link>
          </div>
        </div>
      </main>
      <FooterRuntime />
    </div>
  );
}
