import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, resolveRequestUrl, verifySessionCookie } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const baseUrl = resolveRequestUrl(request);

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (await verifySessionCookie(session)) {
      const redirectUrl = new URL("/admin", baseUrl);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifySessionCookie(session))) {
      const loginUrl = new URL("/login", baseUrl);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
