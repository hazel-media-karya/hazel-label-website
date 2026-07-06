import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultSiteSettings, getSiteSettings } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load site settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const current = await getSiteSettings();

    const updated = await prisma.siteSetting.update({
      where: { id: "main" },
      data: {
        header: body.header ?? current.header ?? defaultSiteSettings.header,
        hero: body.hero ?? current.hero ?? defaultSiteSettings.hero,
        footer: body.footer ?? current.footer ?? defaultSiteSettings.footer,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update site settings",
      },
      { status: 500 }
    );
  }
}
