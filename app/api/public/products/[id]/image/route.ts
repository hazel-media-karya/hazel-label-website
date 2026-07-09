import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
  });
}

function placeholderSvg() {
  return `
    <svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="900" fill="#050505"/>
      <rect x="80" y="80" width="1040" height="740" rx="48" fill="#111111" stroke="#2a2a2a"/>
      <text x="600" y="430" text-anchor="middle" fill="#d8b36d" font-size="34" font-family="Arial, sans-serif" letter-spacing="8">
        HAZEL APPAREL
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#777777" font-size="24" font-family="Arial, sans-serif">
        Product Image
      </text>
    </svg>
  `;
}

export async function GET(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const prisma = getPrisma();

  try {
    const params = await Promise.resolve(context.params);
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      select: {
        imageUrl: true,
      },
    });

    const imageUrl = product?.imageUrl;

    if (!imageUrl) {
      return new Response(placeholderSvg(), {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return NextResponse.redirect(imageUrl);
    }

    if (imageUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(imageUrl, request.url));
    }

    const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!match) {
      return new Response(placeholderSvg(), {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const contentType = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, "base64");

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Failed to load product image:", error);

    return new Response(placeholderSvg(), {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
