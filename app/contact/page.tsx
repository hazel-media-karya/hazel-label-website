import { Suspense } from "react";
import HeaderRuntime from "@/components/HeaderRuntime";
import FooterRuntime from "@/components/FooterRuntime";
import ContactRuntime from "@/components/ContactRuntime";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderRuntime />

      <main>
        <Suspense
          fallback={
            <section className="mx-auto max-w-7xl px-6 py-20 text-zinc-400 sm:px-8 lg:px-10">
              Loading contact form...
            </section>
          }
        >
          <ContactRuntime />
        </Suspense>
      </main>

      <FooterRuntime />
    </div>
  );
}
