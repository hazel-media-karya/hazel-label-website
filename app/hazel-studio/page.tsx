import CustomJerseyStudio from "@/components/CustomJerseyStudio";
import HeaderRuntime from "@/components/HeaderRuntime";

export const dynamic = "force-static";

export default function HazelStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderRuntime />

      <main>
        <section className="mx-auto max-w-[1500px] px-6 pt-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
            Hazel Studio
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            MVP 3D custom jersey modeling
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
            A lightweight interactive studio for previewing custom jersey ideas
            before production. Built first as a safe browser-based MVP.
          </p>
        </section>

        <CustomJerseyStudio />
      </main>

    </div>
  );
}
