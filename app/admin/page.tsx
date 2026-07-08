import Link from "next/link";

const adminMenus = [
  {
    title: "Site Settings",
    description: "Edit Header, Hero/Slider, Footer, menu, CTA, dan konten utama homepage.",
    href: "/admin/settings",
    status: "Ready",
  },
  {
    title: "Products",
    description: "Tambah, edit, hapus, upload gambar, dan kelola produk Hazel Apparel.",
    href: "/admin/products",
    status: "Ready",
  },
  {
    title: "Homepage Preview",
    description: "Preview homepage runtime sebelum perubahan dilihat public.",
    href: "/admin/homepage-preview",
    status: "Preview",
  },
  {
    title: "Orders / Inquiries",
    description: "Kelola pesan order, inquiry WhatsApp, status follow-up, dan calon customer.",
    href: "/admin/orders",
    status: "Next",
  },
  {
    title: "Customers",
    description: "Kelola data customer, riwayat order, kontak, dan project custom.",
    href: "/admin/customers",
    status: "Next",
  },
];

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#030305] px-6 py-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-[#d8b36d]">
              Hazel Admin
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Dashboard
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-400">
              Kelola konten website, produk, order, dan data customer Hazel
              Apparel dari satu halaman admin.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white hover:text-black"
          >
            View Website
          </Link>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {adminMenus.map((menu) => {
            const disabled = menu.status === "Next";

            const card = (
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-white/20 hover:bg-white/[0.055]">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold text-white">
                    {menu.title}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      menu.status === "Ready"
                        ? "border-emerald-400/30 text-emerald-300"
                        : menu.status === "Preview"
                          ? "border-[#d8b36d]/30 text-[#d8b36d]"
                          : "border-white/10 text-zinc-500"
                    }`}
                  >
                    {menu.status}
                  </span>
                </div>

                <p className="mt-4 min-h-[84px] text-sm leading-7 text-zinc-400">
                  {menu.description}
                </p>

                <div className="mt-6 text-sm font-medium text-white">
                  {disabled ? "Coming soon" : "Open →"}
                </div>
              </div>
            );

            if (disabled) {
              return (
                <div key={menu.title} className="cursor-not-allowed opacity-60">
                  {card}
                </div>
              );
            }

            return (
              <Link key={menu.title} href={menu.href}>
                {card}
              </Link>
            );
          })}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-xl font-semibold text-white">
            Public MVP Status
          </h2>

          <div className="mt-5 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
            <p>✅ Homepage runtime database</p>
            <p>✅ Admin Site Settings</p>
            <p>✅ Admin Products</p>
            <p>✅ Product image upload</p>
            <p>✅ Products public page</p>
            <p>✅ WhatsApp order link</p>
          </div>
        </section>
      </div>
    </main>
  );
}
