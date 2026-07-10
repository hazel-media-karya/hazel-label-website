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

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

export async function GET() {
  const prisma = getPrisma();

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        priceFrom: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products.map((product) => ({
        ...product,
        imageUrl: "/product-images/race-team.webp",
      })),
    });
  } catch (error) {
    console.error("Failed to load public products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load public products.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
