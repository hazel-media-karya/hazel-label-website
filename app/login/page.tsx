import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    redirect?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const error = params?.error;
  const success = params?.success;
  const redirect = params?.redirect || "/admin";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <HeaderRuntime />

      <main className="flex-1 px-6 py-20">
        <section className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80">
              Hazel Admin
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              Sign in to Hazel Label
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              Access your Hazel Label dashboard to manage products, inquiries,
              orders, website content, and custom jersey requests.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="text-lg font-bold text-white">
                  Product Management
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Manage jersey products, pricing, images, and product details.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="text-lg font-bold text-white">
                  Customer Orders
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Review inquiries, custom requests, and incoming orders.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl md:p-8">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
                Login
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white">
                Admin Dashboard
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                Please sign in using your registered admin account.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Login failed. Please check your email and password.
              </div>
            ) : null}

            {success ? (
              <div className="mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                Your account is ready. Please login to continue.
              </div>
            ) : null}

            <form action="/api/auth/login" method="POST" className="space-y-5">
              <input type="hidden" name="redirect" value={redirect} />

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@hazellabel.com"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-white/40"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-white px-6 py-4 font-bold text-black transition hover:bg-white/85"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/45">
              Hazel Label admin access is limited to authorized users.
            </p>
          </div>
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
