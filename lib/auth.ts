export const ADMIN_SESSION_COOKIE = "hazel_admin_session";

export function resolveRequestUrl(request: { url: string; headers: Headers }): URL {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ?? request.headers.get("x-forwarded-server")?.split(",")[0]?.trim() ?? request.headers.get("host");

  if (forwardedProto && forwardedHost) {
    return new URL(`${forwardedProto}://${forwardedHost}`);
  }

  return new URL(request.url);
}

function getAdminSecret(): string {
  return `${process.env.ADMIN_EMAIL ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return (
    isAdminConfigured() &&
    email.trim().toLowerCase() === (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase() &&
    password === (process.env.ADMIN_PASSWORD ?? "")
  );
}

async function createSignature(payload: string): Promise<string> {
  const secret = new TextEncoder().encode(getAdminSecret());
  const key = await globalThis.crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature), (value) => value.toString(16).padStart(2, "0")).join("");
}

export async function createSessionCookieValue(email: string): Promise<string> {
  const payload = JSON.stringify({ email: email.trim().toLowerCase(), issuedAt: Date.now() });
  const encoded = encodeBase64Url(new TextEncoder().encode(payload));
  return `${encoded}.${await createSignature(encoded)}`;
}

export async function verifySessionCookie(value: string | undefined | null): Promise<string | null> {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) {
    return null;
  }

  if ((await createSignature(encoded)) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(encoded))) as {
      email?: string;
      issuedAt?: number;
    };

    if (typeof payload.email !== "string" || typeof payload.issuedAt !== "number") {
      return null;
    }

    return payload.email;
  } catch {
    return null;
  }
}
