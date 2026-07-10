import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/product-images/race-team.webp", request.url)
  );
}
