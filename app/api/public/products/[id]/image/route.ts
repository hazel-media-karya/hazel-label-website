import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.redirect(
    "https://hazellabel.com/product-images/race-team.webp"
  );
}
