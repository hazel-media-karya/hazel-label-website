import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      message: "Site settings loaded from database",
      data: {
        header: settings.header,
        hero: settings.hero,
        footer: settings.footer,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load site settings from database",
      },
      { status: 500 }
    );
  }
}
