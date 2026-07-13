"use client";

import { useMemo, useState } from "react";
import GLBBodyAvatar from "./GLBBodyAvatar";

type Gender = "male" | "female";
type JerseyType = "short-sleeve" | "long-sleeve";

type Measurements = {
  height: number;
  weight: number;
  neck: number;
  chest: number;
  waist: number;
  arm: number;
  sleeveLength: number;

  // Field pola jersey disimpan untuk tahap berikutnya, tapi tidak ditampilkan di anatomy input.
  frontLength: number;
  backLength: number;
  pocketLength: number;
};

const AvatarPreview = GLBBodyAvatar as React.ComponentType<any>;

const steps = [
  "Gender",
  "Tinggi & Berat",
  "Ukuran Tubuh",
  "Preview Fitting",
  "Model Jersey",
  "Generate Jersey",
  "Upload Desain",
  "Checkout",
];

const defaultMeasurements: Measurements = {
  height: 170,
  weight: 70,
  neck: 38,
  chest: 100,
  waist: 90,
  arm: 36,
  sleeveLength: 24,
  frontLength: 58,
  backLength: 66,
  pocketLength: 18,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getBmi(height: number, weight: number) {
  const meter = height / 100;
  if (!meter || !weight) return 0;
  return weight / (meter * meter);
}

function getRecommendedSize(m: Measurements) {
  const bmi = getBmi(m.height, m.weight);
  const bellyDominant = m.waist > m.chest;
  const extremeBelly = m.waist - m.chest >= 15;

  if (bmi >= 30 || extremeBelly || m.chest > 116 || m.waist > 116 || m.arm > 44) {
    return "CUSTOM";
  }

  const base = Math.max(m.chest, m.waist);

  if (base <= 86) return "XS";
  if (base <= 92) return "S";
  if (base <= 98) return "M";
  if (base <= 104) return bellyDominant ? "L" : "L";
  if (base <= 110) return "XL";
  if (base <= 116) return "XXL";

  return "CUSTOM";
}

function getFittingNotes(m: Measurements) {
  const notes: string[] = [];
  const bmi = getBmi(m.height, m.weight);

  if (m.waist > m.chest) {
    notes.push("Lingkar perut lebih besar dari lingkar dada; preview akan menonjolkan area belly/perut.");
  }

  if (bmi >= 28) {
    notes.push("Rasio tinggi dan berat menunjukkan body volume lebih besar; pola perlu diberi ease tambahan.");
  }

  if (m.arm >= 40) {
    notes.push("Lingkar lengan besar; sleeve opening perlu dibuat lebih longgar.");
  }

  if (m.neck >= 43) {
    notes.push("Lingkar leher besar; area collar perlu diberi ruang lebih nyaman.");
  }

  if (notes.length === 0) {
    notes.push("Ukuran tubuh masih dalam range regular fit.");
  }

  return notes;
}

function Field({
  label,
  value,
  min,
  max,
  suffix = "cm",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-300">
        {label} <span className="text-zinc-500">({suffix})</span>
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#e6bd67]"
      />
    </label>
  );
}

export default function CustomJerseyStudio() {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>("male");
  const [jerseyType, setJerseyType] = useState<JerseyType>("short-sleeve");
  const [generated, setGenerated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [measurements, setMeasurements] = useState<Measurements>(defaultMeasurements);

  const recommendedSize = useMemo(() => getRecommendedSize(measurements), [measurements]);
  const fittingNotes = useMemo(() => getFittingNotes(measurements), [measurements]);

  const avatarDimensions = {
    ...measurements,
    gender,
    armCircumference: measurements.arm,
    waist: measurements.waist,
  };

  function updateMeasurement<K extends keyof Measurements>(key: K, value: Measurements[K]) {
    setMeasurements((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function prevStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#e6bd67]">
          Hazel Studio
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Custom Jersey Fitting Wizard
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Ikuti langkah bertahap untuk membuat anatomy preview, memilih model jersey,
          mengunggah desain, lalu checkout ke keranjang.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-4 lg:grid-cols-8">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={[
              "rounded-2xl px-3 py-3 text-left text-xs transition",
              index === step
                ? "bg-[#e6bd67] text-black"
                : index < step
                  ? "bg-white/10 text-white"
                  : "bg-black text-zinc-500",
            ].join(" ")}
          >
            <span className="block font-bold">Step {index + 1}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-[#e6bd67]">
            Step {step + 1}
          </p>

          {step === 0 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Pilih gender avatar</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Pilih avatar awal. Nanti model pria dan wanita bisa memakai GLB berbeda.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={[
                    "rounded-2xl border p-6 text-left transition",
                    gender === "male"
                      ? "border-[#e6bd67] bg-[#e6bd67]/15"
                      : "border-white/10 bg-white/[0.03]",
                  ].join(" ")}
                >
                  <span className="block text-xl font-bold">Pria</span>
                  <span className="mt-2 block text-sm text-zinc-400">
                    Avatar mannequin pria untuk jersey fitting.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={[
                    "rounded-2xl border p-6 text-left transition",
                    gender === "female"
                      ? "border-[#e6bd67] bg-[#e6bd67]/15"
                      : "border-white/10 bg-white/[0.03]",
                  ].join(" ")}
                >
                  <span className="block text-xl font-bold">Wanita</span>
                  <span className="mt-2 block text-sm text-zinc-400">
                    Avatar mannequin wanita untuk jersey fitting.
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Input tinggi & berat</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Data ini dipakai untuk menyesuaikan tinggi avatar dan body mass.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Tinggi badan"
                  value={measurements.height}
                  min={130}
                  max={210}
                  onChange={(value) => updateMeasurement("height", value)}
                />
                <Field
                  label="Berat badan"
                  value={measurements.weight}
                  min={35}
                  max={160}
                  suffix="kg"
                  onChange={(value) => updateMeasurement("weight", value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Input ukuran tubuh utama</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Isi ukuran tubuh utama saja. Detail pola jersey akan diproses di tahap berikutnya.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Lingkar leher"
                  value={measurements.neck}
                  min={30}
                  max={55}
                  onChange={(value) => updateMeasurement("neck", value)}
                />
                <Field
                  label="Lingkar dada"
                  value={measurements.chest}
                  min={70}
                  max={140}
                  onChange={(value) => updateMeasurement("chest", value)}
                />
                <Field
                  label="Lingkar perut"
                  value={measurements.waist}
                  min={60}
                  max={160}
                  onChange={(value) => updateMeasurement("waist", value)}
                />
                <Field
                  label="Lingkar lengan"
                  value={measurements.arm}
                  min={20}
                  max={60}
                  onChange={(value) => updateMeasurement("arm", value)}
                />
                <Field
                  label="Panjang lengan"
                  value={measurements.sleeveLength}
                  min={15}
                  max={70}
                  onChange={(value) => updateMeasurement("sleeveLength", value)}
                />
              </div>

              {measurements.waist > measurements.chest && (
                <div className="mt-5 rounded-2xl border border-[#e6bd67]/40 bg-[#e6bd67]/10 p-4 text-sm text-[#e6bd67]">
                  Lingkar perut lebih besar dari lingkar dada. Preview akan dibuat dengan bentuk belly/perut lebih menonjol.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Preview fitting</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Cek rekomendasi size dan catatan fitting sebelum memilih model jersey.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-zinc-400">Recommended Size</p>
                <p className="mt-1 text-4xl font-black">{recommendedSize}</p>
                <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                  {fittingNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Pilih model jersey</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Pilih model dasar jersey yang akan digenerate ke badan avatar.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setJerseyType("short-sleeve")}
                  className={[
                    "rounded-2xl border p-6 text-left transition",
                    jerseyType === "short-sleeve"
                      ? "border-[#e6bd67] bg-[#e6bd67]/15"
                      : "border-white/10 bg-white/[0.03]",
                  ].join(" ")}
                >
                  <span className="block text-xl font-bold">Lengan Pendek</span>
                  <span className="mt-2 block text-sm text-zinc-400">
                    Cocok untuk cycling jersey reguler.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setJerseyType("long-sleeve")}
                  className={[
                    "rounded-2xl border p-6 text-left transition",
                    jerseyType === "long-sleeve"
                      ? "border-[#e6bd67] bg-[#e6bd67]/15"
                      : "border-white/10 bg-white/[0.03]",
                  ].join(" ")}
                >
                  <span className="block text-xl font-bold">Lengan Panjang</span>
                  <span className="mt-2 block text-sm text-zinc-400">
                    Cocok untuk kebutuhan full sleeve.
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Generate jersey ke badan</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Tahap ini menyiapkan model jersey ke avatar. Untuk MVP awal, status generate ditandai dulu.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-zinc-400">Model dipilih</p>
                <p className="mt-1 text-2xl font-bold">
                  {jerseyType === "short-sleeve" ? "Jersey Lengan Pendek" : "Jersey Lengan Panjang"}
                </p>

                <button
                  type="button"
                  onClick={() => setGenerated(true)}
                  className="mt-5 rounded-full bg-[#e6bd67] px-6 py-3 font-bold text-black transition hover:bg-[#f4d58a]"
                >
                  Generate Jersey
                </button>

                {generated && (
                  <p className="mt-4 text-sm text-[#e6bd67]">
                    Jersey berhasil digenerate ke preview. Tahap berikutnya upload desain sendiri.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Upload gambar / desain sendiri</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Upload logo, motif, sponsor, atau desain yang akan ditempel ke jersey.
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => setUploadedFiles(Array.from(event.target.files ?? []))}
                className="w-full rounded-2xl border border-white/10 bg-black p-4 text-sm text-zinc-300"
              />

              <div className="mt-5 space-y-2">
                {uploadedFiles.length === 0 ? (
                  <p className="text-sm text-zinc-500">Belum ada file desain yang diupload.</p>
                ) : (
                  uploadedFiles.map((file) => (
                    <p key={file.name} className="rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-zinc-300">
                      {file.name}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="mb-3 text-2xl font-bold">Checkout ke keranjang</h2>
              <p className="mb-6 text-sm leading-6 text-zinc-400">
                Desain terakhir akan disimpan sebagai snapshot view depan, samping kiri, belakang, dan samping kanan.
              </p>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-300">
                <p><span className="text-zinc-500">Gender:</span> {gender === "male" ? "Pria" : "Wanita"}</p>
                <p><span className="text-zinc-500">Size:</span> {recommendedSize}</p>
                <p><span className="text-zinc-500">Model:</span> {jerseyType === "short-sleeve" ? "Lengan Pendek" : "Lengan Panjang"}</p>
                <p><span className="text-zinc-500">File desain:</span> {uploadedFiles.length} file</p>
              </div>

              <button
                type="button"
                className="mt-5 rounded-full bg-[#e6bd67] px-6 py-3 font-bold text-black transition hover:bg-[#f4d58a]"
              >
                Checkout ke Keranjang
              </button>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={step === steps.length - 1}
              className="rounded-full bg-[#e6bd67] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#f4d58a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#e6bd67]">
                Body Anatomy Preview
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Gender: {gender === "male" ? "Pria" : "Wanita"} · Size {recommendedSize}
              </p>
            </div>
            <span className="rounded-full border border-[#e6bd67]/40 px-4 py-2 text-xs font-bold text-[#e6bd67]">
              Step {step + 1}/8
            </span>
          </div>

          <AvatarPreview
            dimensions={avatarDimensions}
            recommendedSize={recommendedSize}
            sizeRecommendation={recommendedSize}
            gender={gender}
            jerseyType={jerseyType}
            generated={generated}
          />

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-zinc-400">Current Input Summary</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-300 sm:grid-cols-3">
              <p>Tinggi: {measurements.height} cm</p>
              <p>Berat: {measurements.weight} kg</p>
              <p>Dada: {measurements.chest} cm</p>
              <p>Perut: {measurements.waist} cm</p>
              <p>Lengan: {measurements.arm} cm</p>
              <p>Leher: {measurements.neck} cm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
