"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  productName: string | null;
  productSlug: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeWhatsAppNumber(value: string | null) {
  if (!value) {
    return "";
  }

  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  return digits;
}

function getFollowUpMessage(inquiry: Inquiry) {
  return encodeURIComponent(
    [
      `Halo ${inquiry.name}, kami dari Hazel Apparel.`,
      "",
      inquiry.productName
        ? `Terima kasih sudah menghubungi kami terkait produk ${inquiry.productName}.`
        : "Terima kasih sudah menghubungi kami.",
      "",
      "Boleh kami bantu lanjutkan kebutuhan custom jersey/apparel-nya?",
    ].join("\n")
  );
}

function statusClass(status: string) {
  if (status === "NEW") {
    return "border-[#d8b36d]/30 text-[#d8b36d]";
  }

  if (status === "CONTACTED") {
    return "border-sky-400/30 text-sky-300";
  }

  if (status === "DONE") {
    return "border-emerald-400/30 text-emerald-300";
  }

  return "border-white/10 text-zinc-400";
}

export default function AdminOrdersPanel() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadInquiries() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/inquiries", {
        cache: "no-store",
      });

      const json = await response.json();

      if (json.success) {
        setInquiries(json.data ?? []);
      } else {
        setMessage("Gagal memuat inquiries.");
      }
    } catch {
      setMessage("Gagal memuat inquiries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-zinc-400">
        Loading orders / inquiries...
      </div>
    );
  }

  if (message) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
        {message}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-zinc-400">
        Belum ada order atau inquiry dari customer.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {inquiries.map((inquiry) => (
        <article
          key={inquiry.id}
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-white">
                  {inquiry.name}
                </h2>

                <span
                  className={`rounded-full border px-3 py-1 text-xs ${statusClass(
                    inquiry.status
                  )}`}
                >
                  {inquiry.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                {formatDate(inquiry.createdAt)} · {inquiry.source}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {normalizeWhatsAppNumber(inquiry.whatsapp) ? (
                <a
                  href={`https://wa.me/${normalizeWhatsAppNumber(
                    inquiry.whatsapp
                  )}?text=${getFollowUpMessage(inquiry)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-emerald-400/30 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10"
                >
                  Chat WhatsApp
                </a>
              ) : null}

              <button
                type="button"
                onClick={loadInquiries}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Email
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {inquiry.email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                WhatsApp
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {inquiry.whatsapp || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Product
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {inquiry.productName || "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Message
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
              {inquiry.message}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
