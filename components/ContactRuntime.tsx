"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function inputClass() {
  return "mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30";
}

function labelClass() {
  return "text-sm font-medium text-zinc-200";
}

function titleFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ContactRuntime() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") ?? "";
  const productTitle = useMemo(() => titleFromSlug(productSlug), [productSlug]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (productTitle) {
      setProject(productTitle);
      setMessage(`Halo Hazel Apparel, saya tertarik order produk ${productTitle}.`);
    }
  }, [productTitle]);

  function sendInquiry() {
    const subject = encodeURIComponent(
      project ? `Inquiry Hazel Apparel - ${project}` : "Inquiry Hazel Apparel"
    );

    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project: ${project}`,
        "",
        "Message:",
        message,
      ].join("\n")
    );

    window.location.href = `mailto:officialhazelapparel@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-[#d8b36d]">
            Contact Hazel
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Let’s build your next premium custom apparel order
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
            Share your vision and our team will help you shape a polished,
            premium custom jersey and apparel experience from concept to
            delivery.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-zinc-300">
              Email: officialhazelapparel@gmail.com
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-zinc-300">
              Instagram: @officialhazelapparel
            </div>

            {productTitle ? (
              <div className="rounded-2xl border border-[#d8b36d]/30 bg-[#d8b36d]/10 px-5 py-4 text-sm text-[#f1d79b]">
                Selected product: {productTitle}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass()}>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass()}
                placeholder="Your name"
              />
            </label>

            <label className={labelClass()}>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass()}
                placeholder="you@example.com"
              />
            </label>

            <label className={`${labelClass()} md:col-span-2`}>
              Project
              <input
                value={project}
                onChange={(event) => setProject(event.target.value)}
                className={inputClass()}
                placeholder="Cycling jersey, team kit, or custom apparel"
              />
            </label>

            <label className={`${labelClass()} md:col-span-2`}>
              Message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={`${inputClass()} min-h-[170px]`}
                placeholder="Tell us about your goals, timeline, and design ideas."
              />
            </label>
          </div>

          <button
            type="button"
            onClick={sendInquiry}
            className="mt-7 rounded-full bg-[#d8b36d] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[#f1d79b]"
          >
            Send Inquiry
          </button>
        </div>
      </div>
    </section>
  );
}
