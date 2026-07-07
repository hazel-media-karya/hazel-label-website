import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Site settings API is ready",
    data: {
      header: {
        brand: "HAZEL APPAREL"
      },
      hero: {
        title: "Premium Custom Jersey & Apparel"
      },
      footer: {
        copyright: "© 2026 Hazel Apparel. All rights reserved."
      }
    }
  });
}
