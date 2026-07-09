import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

function isAdminPage(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname: string) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const shouldProtect = isAdminPage(pathname) || isAdminApi(pathname);

  if (!shouldProtect) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (session) {
    return NextResponse.next();
  }

  if (isAdminApi(pathname)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
