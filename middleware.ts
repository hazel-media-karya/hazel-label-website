import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionCookie } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (await verifySessionCookie(session)) {
      const redirectUrl = new URL("/admin", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifySessionCookie(session))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
