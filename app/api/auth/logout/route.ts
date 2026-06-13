import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, resolveRequestUrl } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const baseUrl = resolveRequestUrl(request);
  const response = NextResponse.redirect(new URL("/login", baseUrl));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
