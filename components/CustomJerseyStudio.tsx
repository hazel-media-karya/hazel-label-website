"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ViewMode = "front" | "back" | "left" | "right";

const viewRotation: Record<ViewMode, string> = {
  front: "rotateY(0deg)",
  back: "rotateY(180deg)",
  left: "rotateY(55deg)",
  right: "rotateY(-55deg)",
};

export default function CustomJerseyStudio() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [view, setView] = useState<ViewMode>("front");
  const [mainColor, setMainColor] = useState("#111111");
  const [accentColor, setAccentColor] = useState("#d8b36d");
  const [secondColor, setSecondColor] = useState("#8b0f1f");
  const [playerName, setPlayerName] = useState("HAZEL");
  const [playerNumber, setPlayerNumber] = useState("07");
  const [artworkUrl, setArtworkUrl] = useState("");

  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Halo Hazel Apparel, saya ingin custom jersey.\n\nNama: ${playerName}\nNomor: ${playerNumber}\nWarna utama: ${mainColor}\nWarna aksen: ${accentColor}\nWarna kedua: ${secondColor}\nView terakhir: ${view}`
    );
  }, [playerName, playerNumber, mainColor, accentColor, secondColor, view]);

  useEffect(() => {
    return () => {
      if (artworkUrl.startsWith("blob:")) {
        URL.revokeObjectURL(artworkUrl);
      }
    };
  }, [artworkUrl]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    if (artworkUrl.startsWith("blob:")) {
      URL.revokeObjectURL(artworkUrl);
    }

    setArtworkUrl(URL.createObjectURL(file));
    event.target.value = "";
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
          Hazel 3D Studio MVP
        </p>

        <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Create your custom jersey preview
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
          Upload artwork, adjust colors, add player identity, and preview the
          jersey from multiple angles before submitting your custom order.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-zinc-300">
            Player Name
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value.toUpperCase())}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none"
              placeholder="HAZEL"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Number
            <input
              value={playerNumber}
              onChange={(event) => setPlayerNumber(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none"
              placeholder="07"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium text-zinc-300">
            Main Color
            <input
              type="color"
              value={mainColor}
              onChange={(event) => setMainColor(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Accent
            <input
              type="color"
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black"
            />
          </label>

          <label className="text-sm font-medium text-zinc-300">
            Secondary
            <input
              type="color"
              value={secondColor}
              onChange={(event) => setSecondColor(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-[#d8b36d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e8c47a]"
          >
            Upload Design
          </button>

          {artworkUrl ? (
            <button
              type="button"
              onClick={() => setArtworkUrl("")}
              className="rounded-full border border-red-500/30 px-6 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Remove Design
            </button>
          ) : null}

          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Submit Custom Order
          </a>
        </div>

        <p className="mt-4 text-xs leading-6 text-zinc-500">
          MVP ini hanya preview di browser. Upload desain di sini tidak disimpan
          ke database sampai sistem order final dibuat.
        </p>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-black p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
            Live Preview
          </p>

          <div className="flex flex-wrap gap-2">
            {(["front", "back", "left", "right"] as ViewMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition ${
                  view === item
                    ? "border-[#d8b36d] bg-[#d8b36d] text-black"
                    : "border-white/15 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex min-h-[620px] items-center justify-center rounded-[28px] border border-white/10 bg-black/60 p-8 [perspective:1200px]">
          <div
            className="relative h-[520px] w-[330px] transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: viewRotation[view] }}
          >
            <div
              className="absolute inset-0 rounded-[42px] border border-white/15 shadow-2xl [backface-visibility:hidden]"
              style={{
                background: `
                  radial-gradient(circle at 50% 18%, ${accentColor} 0 7%, transparent 8%),
                  linear-gradient(135deg, transparent 0 20%, ${secondColor} 21% 34%, transparent 35%),
                  linear-gradient(225deg, transparent 0 18%, ${accentColor} 19% 28%, transparent 29%),
                  ${mainColor}
                `,
                clipPath:
                  "polygon(28% 0, 72% 0, 94% 18%, 86% 42%, 76% 38%, 76% 100%, 24% 100%, 24% 38%, 14% 42%, 6% 18%)",
              }}
            >
              {artworkUrl ? (
                <img
                  src={artworkUrl}
                  alt="Uploaded jersey artwork"
                  className="absolute inset-x-[13%] top-[28%] h-[38%] w-[74%] rounded-2xl object-cover opacity-80 mix-blend-screen"
                />
              ) : null}

              <div className="absolute left-1/2 top-[12%] h-16 w-24 -translate-x-1/2 rounded-b-full border-b-4 border-black/60 bg-black/40" />

              <div className="absolute inset-x-0 top-[42%] text-center">
                <p className="text-3xl font-black tracking-[0.08em] text-white drop-shadow-lg">
                  {playerName || "HAZEL"}
                </p>
                <p className="mt-4 text-7xl font-black text-white/95 drop-shadow-lg">
                  {playerNumber || "07"}
                </p>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-white/70">
                Hazel Apparel
              </div>
            </div>

            <div
              className="absolute inset-0 rounded-[42px] border border-white/15 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{
                background: `
                  linear-gradient(45deg, transparent 0 20%, ${accentColor} 21% 28%, transparent 29%),
                  linear-gradient(315deg, transparent 0 18%, ${secondColor} 19% 33%, transparent 34%),
                  ${mainColor}
                `,
                clipPath:
                  "polygon(28% 0, 72% 0, 94% 18%, 86% 42%, 76% 38%, 76% 100%, 24% 100%, 24% 38%, 14% 42%, 6% 18%)",
              }}
            >
              <div className="absolute inset-x-0 top-[28%] text-center">
                <p className="text-4xl font-black tracking-[0.1em] text-white">
                  {playerName || "HAZEL"}
                </p>
                <p className="mt-8 text-8xl font-black text-white">
                  {playerNumber || "07"}
                </p>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-white/70">
                Custom Teamwear
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
