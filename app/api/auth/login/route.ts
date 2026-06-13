import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionCookieValue, resolveRequestUrl, validateAdminCredentials } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const baseUrl = resolveRequestUrl(request);
  const nextPath = String(formData.get("next") ?? "/admin");
  const redirectUrl = new URL(nextPath.startsWith("/") ? nextPath : "/admin", baseUrl);

  if (!validateAdminCredentials(email, password)) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("error", "invalid");
    loginUrl.searchParams.set("next", redirectUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(ADMIN_SESSION_COOKIE, await createSessionCookieValue(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
