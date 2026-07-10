import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionCookieValue,
  resolveRequestUrl,
  validateAdminCredentials,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const baseUrl = resolveRequestUrl(request);
  return NextResponse.redirect(new URL("/login", baseUrl));
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextPath = String(formData.get("next") ?? "/admin");

    const baseUrl = resolveRequestUrl(request);
    const safeNextPath = nextPath.startsWith("/") ? nextPath : "/admin";
    const redirectUrl = new URL(safeNextPath, baseUrl);

    if (!validateAdminCredentials(email, password)) {
      const loginUrl = new URL("/login", baseUrl);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", redirectUrl.pathname);

      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      await createSessionCookieValue(email),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    const baseUrl = resolveRequestUrl(request);
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("error", "server");

    return NextResponse.redirect(loginUrl);
  }
}
