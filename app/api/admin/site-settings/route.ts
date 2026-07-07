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
      message: "Site settings updated",
      data: {
        header: updated.header,
        hero: updated.hero,
        footer: updated.footer,
      },
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
