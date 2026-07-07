import HeaderRuntime from "@/components/HeaderRuntime";
import HeroSliderRuntime from "@/components/HeroSliderRuntime";
import FooterRuntime from "@/components/FooterRuntime";

export const dynamic = "force-dynamic";

export default function HomepagePreviewPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f8f2e8]">
      <HeaderRuntime />

      <main id="home" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 sm:px-8 lg:px-10">
        <HeroSliderRuntime />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Homepage Preview
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-white">
            Header Runtime Test
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Halaman ini hanya untuk mengetes Header yang membaca database saat runtime. Homepage utama belum disentuh.
          </p>
        </section>
      </main>

      <FooterRuntime />
    </div>
  );
}
