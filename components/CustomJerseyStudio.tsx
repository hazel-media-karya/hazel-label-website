"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import GLBBodyAvatar from "@/components/GLBBodyAvatar";

type ViewMode = "front" | "back" | "left" | "right";
type FitPreference = "slim" | "regular" | "relaxed";
type Gender = "male" | "female";
type JerseyType = "short-sleeve" | "long-sleeve";

const wizardSteps = [
  "Gender",
  "Tinggi & Berat",
  "Ukuran Tubuh",
  "Preview Fitting",
  "Model Jersey",
  "Generate Jersey",
  "Upload Desain",
  "Checkout",
];

type BodyMeasurements = {
  height: string;
  weight: string;
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
  height: "170",
  weight: "65",
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

function getSizeRecommendation(
  chest: number,
  waist: number,
  height: number,
  weight: number
) {
  const base = Math.max(chest, waist + 8);
  const bmi =
    height > 0 && weight > 0 ? weight / Math.pow(height / 100, 2) : 0;

  const sizes = ["S", "M", "L", "XL", "CUSTOM"] as const;

  let index = 0;

  if (base <= 86) index = 0;
  else if (base <= 94) index = 1;
  else if (base <= 102) index = 2;
  else if (base <= 110) index = 3;
  else index = 4;

  if ((height >= 185 || bmi >= 28) && index < sizes.length - 1) {
    index += 1;
  }

  if (height > 0 && height <= 155 && bmi > 0 && bmi < 20 && index > 0) {
    index -= 1;
  }

  return sizes[index];
}

function getFitNotes(body: BodyMeasurements, fit: FitPreference) {
  const height = toNumber(body.height);
  const weight = toNumber(body.weight);
  const chest = toNumber(body.chest);
  const waist = toNumber(body.waist);
  const frontLength = toNumber(body.frontLength);
  const backLength = toNumber(body.backLength);
  const arm = toNumber(body.armCircumference);
  const neck = toNumber(body.neck);
  const pocket = toNumber(body.pocketLength);

  const notes: string[] = [];

  if (height > 0 && weight > 0) {
    const bmi = weight / Math.pow(height / 100, 2);

    if (height >= 180) {
      notes.push("Tinggi badan cukup tinggi; panjang jersey perlu diperhatikan agar tidak terlalu pendek.");
    }

    if (bmi >= 27) {
      notes.push("Rasio berat dan tinggi menunjukkan body volume lebih besar; rekomendasi size perlu diberi ease tambahan.");
    }

    if (bmi < 19) {
      notes.push("Rasio berat dan tinggi cenderung slim; pola dapat dibuat lebih ramping.");
    }
  }

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

  const [step, setStep] = useState(0);
  const [body, setBody] = useState<BodyMeasurements>(defaultBody);
  const [fit, setFit] = useState<FitPreference>("regular");
  const [gender, setGender] = useState<Gender>("male");
  const [jerseyType, setJerseyType] = useState<JerseyType>("short-sleeve");
  const [jerseyGenerated, setJerseyGenerated] = useState(false);

  const [view, setView] = useState<ViewMode>("front");
  const [mainColor, setMainColor] = useState("#111111");
  const [accentColor, setAccentColor] = useState("#d8b36d");
  const [secondColor, setSecondColor] = useState("#8b0f1f");
  const [playerName, setPlayerName] = useState("HAZEL");
  const [playerNumber, setPlayerNumber] = useState("07");
  const [artworkUrl, setArtworkUrl] = useState("");

  const height = toNumber(body.height);
  const weight = toNumber(body.weight);
  const chest = toNumber(body.chest);
  const waist = toNumber(body.waist);
  const frontLength = toNumber(body.frontLength);
  const backLength = toNumber(body.backLength);
  const sleeveLength = toNumber(body.sleeveLength);
  const armCircumference = toNumber(body.armCircumference);
  const neck = toNumber(body.neck);
  const pocketLength = toNumber(body.pocketLength);

  const recommendedSize = useMemo(
    () => getSizeRecommendation(chest, waist, height, weight),
    [chest, waist, height, weight]
  );

  const fitNotes = useMemo(
    () => getFitNotes(body, fit),
    [body, fit]
  );



  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Halo Hazel Apparel, saya ingin custom jersey.

BODY MEASUREMENT:
Tinggi badan: ${body.height} cm
Berat badan: ${body.weight} kg
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

  function nextStep() {
    setStep((current) => Math.min(current + 1, wizardSteps.length - 1));
  }

  function prevStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  const bellyDominant = waist > chest;
  const genderLabel = gender === "male" ? "Pria" : "Wanita";
  const jerseyTypeLabel =
    jerseyType === "short-sleeve" ? "Jersey Lengan Pendek" : "Jersey Lengan Panjang";

  return (
    <section className="mx-auto w-full max-w-[1500px] px-6 py-5">
      <div className="mb-5">
        <p className="text-sm leading-6 text-zinc-400">
          Hazel Studio dibuat bertahap agar user tidak bingung saat mengisi data fitting,
          memilih model jersey, mengunggah desain, lalu checkout.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-[28px] border border-white/10 bg-white/[0.03] p-3 md:grid-cols-4 xl:grid-cols-8">
        {wizardSteps.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-2xl px-3 py-3 text-left text-xs font-semibold transition ${
              step === index
                ? "bg-[#d8b36d] text-black"
                : index < step
                  ? "bg-white/10 text-white"
                  : "bg-black/50 text-zinc-500 hover:bg-white/5"
            }`}
          >
            <span className="block">Step {index + 1}</span>
            <span className="block truncate">{item}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(620px,0.94fr)_minmax(640px,1.06fr)]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
            Step {step + 1} / 8
          </p>

          {step === 0 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Pilih gender avatar
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Pilih gender terlebih dahulu sebelum memasukkan data ukuran tubuh.
                Untuk tahap MVP, avatar masih memakai model GLB yang sama, tetapi alur data sudah disiapkan untuk model pria dan wanita.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`rounded-3xl border p-6 text-left transition ${
                    gender === "male"
                      ? "border-[#d8b36d] bg-[#d8b36d]/15"
                      : "border-white/10 bg-black/40 hover:bg-white/5"
                  }`}
                >
                  <p className="text-2xl font-black text-white">Pria</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Avatar fitting untuk jersey pria.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`rounded-3xl border p-6 text-left transition ${
                    gender === "female"
                      ? "border-[#d8b36d] bg-[#d8b36d]/15"
                      : "border-white/10 bg-black/40 hover:bg-white/5"
                  }`}
                >
                  <p className="text-2xl font-black text-white">Wanita</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Avatar fitting untuk jersey wanita.
                  </p>
                </button>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Input tinggi badan dan berat badan
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Data ini dipakai untuk mengatur tinggi avatar dan body mass sebelum ukuran detail diisi.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <MeasurementInput
                  label="Tinggi badan"
                  unit="cm"
                  value={body.height}
                  onChange={(value) => updateBody("height", value)}
                />

                <MeasurementInput
                  label="Berat badan"
                  unit="kg"
                  value={body.weight}
                  onChange={(value) => updateBody("weight", value)}
                />
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Input ukuran tubuh utama
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Isi ukuran tubuh utama saja. Field pola jersey seperti panjang belakang, panjang saku,
                dan panjang kerah tidak ditampilkan di tahap anatomy agar user tidak bingung.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <MeasurementInput
                  label="Lingkar leher"
                  unit="cm"
                  value={body.neck}
                  onChange={(value) => updateBody("neck", value)}
                />

                <MeasurementInput
                  label="Lingkar dada"
                  unit="cm"
                  value={body.chest}
                  onChange={(value) => updateBody("chest", value)}
                />

                <MeasurementInput
                  label="Lingkar perut"
                  unit="cm"
                  value={body.waist}
                  onChange={(value) => updateBody("waist", value)}
                />

                <MeasurementInput
                  label="Lingkar lengan"
                  unit="cm"
                  value={body.armCircumference}
                  onChange={(value) => updateBody("armCircumference", value)}
                />

                <MeasurementInput
                  label="Panjang lengan"
                  unit="cm"
                  value={body.sleeveLength}
                  onChange={(value) => updateBody("sleeveLength", value)}
                />

                <label className="text-sm font-medium text-zinc-300">
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

              {bellyDominant ? (
                <div className="mt-5 rounded-2xl border border-[#d8b36d]/30 bg-[#d8b36d]/10 p-4 text-sm leading-6 text-[#f1d7a2]">
                  Lingkar perut lebih besar dari lingkar dada. Preview anatomy akan menonjolkan area belly/perut.
                </div>
              ) : null}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Preview size dan anatomy fitting
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Periksa rekomendasi size dan catatan fitting sebelum memilih model jersey.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-sm text-zinc-400">Recommended Size</p>
                <p className="mt-2 text-5xl font-black text-white">{recommendedSize}</p>

                <div className="mt-5 space-y-2">
                  {fitNotes.map((note) => (
                    <p key={note} className="text-sm leading-6 text-zinc-400">
                      • {note}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Pilih model jersey
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Pilih model awal yang akan digenerate ke badan avatar.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setJerseyType("short-sleeve")}
                  className={`rounded-3xl border p-6 text-left transition ${
                    jerseyType === "short-sleeve"
                      ? "border-[#d8b36d] bg-[#d8b36d]/15"
                      : "border-white/10 bg-black/40 hover:bg-white/5"
                  }`}
                >
                  <p className="text-2xl font-black text-white">Lengan Pendek</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Cocok untuk cycling jersey reguler.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setJerseyType("long-sleeve")}
                  className={`rounded-3xl border p-6 text-left transition ${
                    jerseyType === "long-sleeve"
                      ? "border-[#d8b36d] bg-[#d8b36d]/15"
                      : "border-white/10 bg-black/40 hover:bg-white/5"
                  }`}
                >
                  <p className="text-2xl font-black text-white">Lengan Panjang</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Cocok untuk full sleeve jersey.
                  </p>
                </button>
              </div>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Generate jersey ke badan
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Tahap ini menyiapkan jersey berdasarkan model yang dipilih. Untuk MVP awal,
                status generate ditandai dulu sebelum integrasi GLB jersey.
              </p>

              <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-sm text-zinc-400">Model dipilih</p>
                <p className="mt-2 text-3xl font-black text-white">{jerseyTypeLabel}</p>

                <button
                  type="button"
                  onClick={() => setJerseyGenerated(true)}
                  className="mt-5 rounded-full bg-[#d8b36d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e8c47a]"
                >
                  Generate Jersey
                </button>

                {jerseyGenerated ? (
                  <p className="mt-4 text-sm leading-6 text-[#f1d7a2]">
                    Jersey berhasil digenerate ke preview. Lanjut upload desain sendiri.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {step === 6 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Upload gambar / desain sendiri
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Upload logo, motif, sponsor, atau artwork yang akan ditempelkan ke jersey.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
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
              </div>

              {artworkUrl ? (
                <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="mb-3 text-sm text-zinc-400">Uploaded artwork preview</p>
                  <img
                    src={artworkUrl}
                    alt="Uploaded design"
                    className="max-h-56 rounded-2xl object-contain"
                  />
                </div>
              ) : null}
            </>
          ) : null}

          {step === 7 ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Checkout ke keranjang
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Desain terakhir akan disimpan sebagai snapshot view depan, samping kiri,
                belakang, dan samping kanan sebelum masuk keranjang.
              </p>

              <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-black/40 p-5 text-sm leading-6 text-zinc-300">
                <p><span className="text-zinc-500">Gender:</span> {genderLabel}</p>
                <p><span className="text-zinc-500">Size:</span> {recommendedSize}</p>
                <p><span className="text-zinc-500">Fit:</span> {fit}</p>
                <p><span className="text-zinc-500">Model jersey:</span> {jerseyTypeLabel}</p>
                <p><span className="text-zinc-500">Artwork:</span> {artworkUrl ? "Sudah upload" : "Belum upload"}</p>
                <p><span className="text-zinc-500">Snapshot:</span> front, left, back, right</p>
              </div>

              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full bg-[#d8b36d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e8c47a]"
              >
                Checkout ke Keranjang
              </a>
            </>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={step === wizardSteps.length - 1}
              className="rounded-full bg-[#d8b36d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e8c47a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-black p-5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
                Body Anatomy Preview
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                {genderLabel} · {recommendedSize} · {jerseyTypeLabel}
              </p>
            </div>

            <div className="rounded-full border border-[#d8b36d]/40 px-4 py-2 text-xs font-bold text-[#f1d7a2]">
              Step {step + 1}/8
            </div>
          </div>

          <GLBBodyAvatar
            body={body}
            fit={fit}
            recommendedSize={recommendedSize}
          />

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-sm text-zinc-400">Current Input Summary</p>

            <div className="mt-3 grid gap-2 text-xs leading-5 text-zinc-400 sm:grid-cols-2">
              <p>Gender: {genderLabel}</p>
              <p>Tinggi: {body.height} cm</p>
              <p>Berat: {body.weight} kg</p>
              <p>Dada: {body.chest} cm</p>
              <p>Perut: {body.waist} cm</p>
              <p>Lengan: {body.armCircumference} cm</p>
              <p>Leher: {body.neck} cm</p>
              <p>Size: {recommendedSize}</p>
            </div>

            {bellyDominant ? (
              <p className="mt-3 rounded-xl border border-[#d8b36d]/30 bg-[#d8b36d]/10 px-3 py-2 text-xs leading-5 text-[#f1d7a2]">
                Belly rule aktif: lingkar perut lebih besar dari lingkar dada.
              </p>
            ) : null}
          </div>

          {step >= 5 ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d8b36d]">
                Jersey Preview Placeholder
              </p>

              <div className="mt-5 flex min-h-[360px] items-center justify-center rounded-[28px] border border-white/10 bg-black/60 p-6 [perspective:1200px]">
                <div
                  className="relative h-[330px] w-[210px] transition-transform duration-700 [transform-style:preserve-3d]"
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

              <div className="mt-4 flex flex-wrap gap-2">
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
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MeasurementInput({
  label,
  value,
  unit = "cm",
  min,
  max,
  onChange,
}: {
  label: string;
  unit?: string;
  value: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
}) {
  function handleChange(rawValue: string) {
    if (rawValue === "") {
      onChange("");
      return;
    }

    const number = Number(rawValue);
    if (!Number.isFinite(number)) return;

    const minValue = min ?? number;
    const maxValue = max ?? number;
    const clamped = Math.max(minValue, Math.min(maxValue, number));

    onChange(String(clamped));
  }

  return (
    <label className="text-xs font-medium text-zinc-300">
      {label} <span className="text-zinc-500">({unit})</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-white outline-none"
      />
    </label>
  );
}

function ColorInput({
  label,
  value,
  unit = "cm",
  onChange,
}: {
  label: string;
  unit?: string;
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
