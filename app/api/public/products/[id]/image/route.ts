import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
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

function placeholderResponse() {
  return new Response(placeholderSvg(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export async function GET(request: Request, context: RouteContext) {
  const prisma = getPrisma();

  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    const imageUrl = product?.imageUrl;

    if (!imageUrl) {
      return placeholderResponse();
    }

    // Jangan render base64 dari database. Itu penyebab crash sebelumnya.
    if (imageUrl.startsWith("data:")) {
      return placeholderResponse();
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return NextResponse.redirect(imageUrl);
    }

    if (imageUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(imageUrl, request.url));
    }

    return placeholderResponse();
  } catch (error) {
    console.error("Failed to load product image:", error);
    return placeholderResponse();
  } finally {
    await prisma.$disconnect();
  }
}
