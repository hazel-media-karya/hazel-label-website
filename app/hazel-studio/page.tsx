import CustomJerseyStudio from "@/components/CustomJerseyStudio";
import FooterRuntime from "@/components/FooterRuntime";
import HeaderRuntime from "@/components/HeaderRuntime";

export const dynamic = "force-static";

export default function HazelStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderRuntime />

      <main>
        <section className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
            Hazel Studio
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
            MVP 3D custom jersey modeling
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400">
            A lightweight interactive studio for previewing custom jersey ideas
            before production. Built first as a safe browser-based MVP.
          </p>
        </section>

        <CustomJerseyStudio />
      </main>

      <FooterRuntime />
    </div>
  );
}
