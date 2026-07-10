"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LowPolyBodyAvatar from "@/components/LowPolyBodyAvatar";

type ViewMode = "front" | "back" | "left" | "right";
type FitPreference = "slim" | "regular" | "relaxed";

type BodyMeasurements = {
  chest: string;
  waist: string;
  frontLength: string;
  armCircumference: string;
  sleeveLength: string;
  neck: string;
  backLength: string;
  pocketLength: string;
};

const defaultBody: BodyMeasurements = {
  chest: "92",
  waist: "82",
  frontLength: "58",
  armCircumference: "30",
  sleeveLength: "24",
  neck: "38",
  backLength: "64",
  pocketLength: "18",
};

const viewRotation: Record<ViewMode, string> = {
  front: "rotateY(0deg)",
  back: "rotateY(180deg)",
  left: "rotateY(55deg)",
  right: "rotateY(-55deg)",
};

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getSizeRecommendation(chest: number, waist: number) {
  const base = Math.max(chest, waist + 8);

  if (base <= 86) return "S";
  if (base <= 94) return "M";
  if (base <= 102) return "L";
  if (base <= 110) return "XL";
  return "CUSTOM";
}

function getFitNotes(body: BodyMeasurements, fit: FitPreference) {
  const chest = toNumber(body.chest);
  const waist = toNumber(body.waist);
  const frontLength = toNumber(body.frontLength);
  const backLength = toNumber(body.backLength);
  const arm = toNumber(body.armCircumference);
  const neck = toNumber(body.neck);
  const pocket = toNumber(body.pocketLength);

  const notes: string[] = [];

  if (chest - waist >= 12) {
    notes.push("Bentuk badan cenderung athletic; bagian dada perlu ruang lebih.");
  }

  if (waist > chest - 4) {
    notes.push("Area perut perlu pola regular agar jersey tidak terlalu ketat.");
  }

  if (backLength - frontLength >= 5) {
    notes.push("Panjang belakang lebih dominan; cocok untuk cycling cut.");
  }

  if (arm >= 34) {
    notes.push("Lingkar lengan besar; sleeve opening perlu dibuat lebih longgar.");
  }

  if (neck >= 42) {
    notes.push("Lingkar leher besar; kerah sebaiknya tidak terlalu rapat.");
  }

  if (pocket < 16) {
    notes.push("Panjang saku pendek; kapasitas pocket belakang terbatas.");
  }

  if (fit === "slim") {
    notes.push("Fit preference: slim fit, pola akan dibuat lebih menempel.");
  } else if (fit === "relaxed") {
    notes.push("Fit preference: relaxed fit, pola akan diberi ease lebih longgar.");
  } else {
    notes.push("Fit preference: regular fit, cocok untuk pemakaian komunitas dan event.");
  }

  return notes;
}

export default function CustomJerseyStudio() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<"body" | "jersey">("body");
  const [body, setBody] = useState<BodyMeasurements>(defaultBody);
  const [fit, setFit] = useState<FitPreference>("regular");

  const [view, setView] = useState<ViewMode>("front");
  const [mainColor, setMainColor] = useState("#111111");
  const [accentColor, setAccentColor] = useState("#d8b36d");
  const [secondColor, setSecondColor] = useState("#8b0f1f");
  const [playerName, setPlayerName] = useState("HAZEL");
  const [playerNumber, setPlayerNumber] = useState("07");
  const [artworkUrl, setArtworkUrl] = useState("");

  const chest = toNumber(body.chest);
  const waist = toNumber(body.waist);
  const frontLength = toNumber(body.frontLength);
  const backLength = toNumber(body.backLength);
  const sleeveLength = toNumber(body.sleeveLength);
  const armCircumference = toNumber(body.armCircumference);
  const neck = toNumber(body.neck);
  const pocketLength = toNumber(body.pocketLength);

  const recommendedSize = useMemo(
    () => getSizeRecommendation(chest, waist),
    [chest, waist]
  );

  const fitNotes = useMemo(
    () => getFitNotes(body, fit),
    [body, fit]
  );



  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Halo Hazel Apparel, saya ingin custom jersey.

BODY MEASUREMENT:
Lingkar dada: ${body.chest} cm
Lingkar perut: ${body.waist} cm
Panjang depan kerah-bawah: ${body.frontLength} cm
Lingkar lengan: ${body.armCircumference} cm
Panjang lengan: ${body.sleeveLength} cm
Lingkar leher: ${body.neck} cm
Panjang belakang: ${body.backLength} cm
Panjang saku: ${body.pocketLength} cm
Fit: ${fit}
Rekomendasi size: ${recommendedSize}

JERSEY:
Nama: ${playerName}
Nomor: ${playerNumber}
Warna utama: ${mainColor}
Warna aksen: ${accentColor}
Warna kedua: ${secondColor}`
    );
  }, [
    body,
    fit,
    recommendedSize,
    playerName,
    playerNumber,
    mainColor,
    accentColor,
    secondColor,
  ]);

  useEffect(() => {
    return () => {
      if (artworkUrl.startsWith("blob:")) {
        URL.revokeObjectURL(artworkUrl);
      }
    };
  }, [artworkUrl]);

  function updateBody(key: keyof BodyMeasurements, value: string) {
    setBody((current) => ({
      ...current,
      [key]: value,
    }));
  }

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
    <section className="mx-auto w-full max-w-[1500px] px-6 py-5">
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep("body")}
          className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
            step === "body"
              ? "border-[#d8b36d] bg-[#d8b36d] text-black"
              : "border-white/15 text-white hover:bg-white/10"
          }`}
        >
          1. Body Measurement
        </button>

        <button
          type="button"
          onClick={() => setStep("jersey")}
          className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
            step === "jersey"
              ? "border-[#d8b36d] bg-[#d8b36d] text-black"
              : "border-white/15 text-white hover:bg-white/10"
          }`}
        >
          2. Jersey Customizer
        </button>
      </div>

      {step === "body" ? (
        <div className="grid h-[calc(100vh-255px)] min-h-[480px] gap-5 overflow-hidden xl:grid-cols-[minmax(680px,0.98fr)_minmax(640px,1.02fr)]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 min-w-0 overflow-hidden">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
              Generate User Anatomy
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">
              Input ukuran tubuh user
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Data ini dipakai untuk membuat preview anatomi tubuh, rekomendasi
              size, dan catatan pola jersey sebelum masuk ke desain.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MeasurementInput
                label="Lingkar dada"
                value={body.chest}
                onChange={(value) => updateBody("chest", value)}
              />

              <MeasurementInput
                label="Lingkar perut"
                value={body.waist}
                onChange={(value) => updateBody("waist", value)}
              />

              <MeasurementInput
                label="Panjang kerah sampai ujung bawah jersey"
                value={body.frontLength}
                onChange={(value) => updateBody("frontLength", value)}
              />

              <MeasurementInput
                label="Panjang jersey bagian belakang"
                value={body.backLength}
                onChange={(value) => updateBody("backLength", value)}
              />

              <MeasurementInput
                label="Lingkar lengan"
                value={body.armCircumference}
                onChange={(value) => updateBody("armCircumference", value)}
              />

              <MeasurementInput
                label="Panjang lengan"
                value={body.sleeveLength}
                onChange={(value) => updateBody("sleeveLength", value)}
              />

              <MeasurementInput
                label="Lingkar leher"
                value={body.neck}
                onChange={(value) => updateBody("neck", value)}
              />

              <MeasurementInput
                label="Panjang saku"
                value={body.pocketLength}
                onChange={(value) => updateBody("pocketLength", value)}
              />

              <label className="text-sm font-medium text-zinc-300 sm:col-span-2">
                Fit Preference
                <select
                  value={fit}
                  onChange={(event) => setFit(event.target.value as FitPreference)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="slim">Slim Fit</option>
                  <option value="regular">Regular Fit</option>
                  <option value="relaxed">Relaxed Fit</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setStep("jersey")}
              className="mt-4 rounded-full bg-[#d8b36d] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e8c47a]"
            >
              Continue to Jersey Design
            </button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-black p-5 min-w-0 overflow-hidden">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
              Body Anatomy Preview
            </p>

            <LowPolyBodyAvatar
              body={body}
              fit={fit}
              recommendedSize={recommendedSize}
            />

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-sm text-zinc-400">Recommended Size</p>
              <p className="mt-1 text-3xl font-black text-white">
                {recommendedSize}
              </p>

              <div className="mt-3 space-y-2">
                {fitNotes.map((note) => (
                  <p key={note} className="text-xs leading-5 text-zinc-400">
                    • {note}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-[calc(100vh-255px)] min-h-[480px] gap-5 overflow-hidden xl:grid-cols-[minmax(680px,0.98fr)_minmax(640px,1.02fr)]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
              Jersey Customizer
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white">
              Custom jersey preview
            </h2>

            <div className="mt-6 rounded-2xl border border-[#d8b36d]/25 bg-[#d8b36d]/10 p-4 text-sm leading-7 text-[#f1d7a2]">
              Size recommendation: <strong>{recommendedSize}</strong> · Fit:{" "}
              <strong>{fit}</strong>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium text-zinc-300">
                Player Name
                <input
                  value={playerName}
                  onChange={(event) =>
                    setPlayerName(event.target.value.toUpperCase())
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
                />
              </label>

              <label className="text-xs font-medium text-zinc-300">
                Number
                <input
                  value={playerNumber}
                  onChange={(event) => setPlayerNumber(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ColorInput label="Main Color" value={mainColor} onChange={setMainColor} />
              <ColorInput label="Accent" value={accentColor} onChange={setAccentColor} />
              <ColorInput label="Secondary" value={secondColor} onChange={setSecondColor} />
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
                <JerseyFace
                  side="front"
                  mainColor={mainColor}
                  accentColor={accentColor}
                  secondColor={secondColor}
                  artworkUrl={artworkUrl}
                  playerName={playerName}
                  playerNumber={playerNumber}
                />

                <JerseyFace
                  side="back"
                  mainColor={mainColor}
                  accentColor={accentColor}
                  secondColor={secondColor}
                  artworkUrl=""
                  playerName={playerName}
                  playerNumber={playerNumber}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MeasurementInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-medium text-zinc-300">
      {label} <span className="text-zinc-500">(cm)</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs font-medium text-zinc-300">
      {label}
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black"
      />
    </label>
  );
}

function JerseyFace({
  side,
  mainColor,
  accentColor,
  secondColor,
  artworkUrl,
  playerName,
  playerNumber,
}: {
  side: "front" | "back";
  mainColor: string;
  accentColor: string;
  secondColor: string;
  artworkUrl: string;
  playerName: string;
  playerNumber: string;
}) {
  return (
    <div
      className={`absolute inset-0 rounded-[42px] border border-white/15 shadow-2xl [backface-visibility:hidden] ${
        side === "back" ? "[transform:rotateY(180deg)]" : ""
      }`}
      style={{
        background:
          side === "front"
            ? `
              radial-gradient(circle at 50% 18%, ${accentColor} 0 7%, transparent 8%),
              linear-gradient(135deg, transparent 0 20%, ${secondColor} 21% 34%, transparent 35%),
              linear-gradient(225deg, transparent 0 18%, ${accentColor} 19% 28%, transparent 29%),
              ${mainColor}
            `
            : `
              linear-gradient(45deg, transparent 0 20%, ${accentColor} 21% 28%, transparent 29%),
              linear-gradient(315deg, transparent 0 18%, ${secondColor} 19% 33%, transparent 34%),
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
        {side === "front" ? "Hazel Apparel" : "Custom Teamwear"}
      </div>
    </div>
  );
}
