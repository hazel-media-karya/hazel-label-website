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

function text(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function booleanValue(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `product-${Date.now()}`;
}

function sanitizeImageUrl(value: unknown) {
  const imageUrl = text(value);

  if (!imageUrl) {
    return {
      ok: true as const,
      value: null,
    };
  }

  if (imageUrl.startsWith("data:")) {
    return {
      ok: false as const,
      message:
        "Base64 image is not allowed. Use a file path such as /product-images/race-team.webp.",
    };
  }

  if (
    imageUrl.startsWith("/product-images/") ||
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return {
      ok: true as const,
      value: imageUrl,
    };
  }

  return {
    ok: false as const,
    message:
      "Invalid image URL. Use /product-images/file.webp or a valid http/https URL.",
  };
}

function safeProductImageUrl(imageUrl: string | null) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("data:")) return null;
  return imageUrl;
}

async function makeUniqueSlug(
  prisma: PrismaClient,
  baseSlug: string,
  currentId?: string
) {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function GET() {
  const prisma = getPrisma();

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        priceFrom: true,
        imageUrl: true,
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
        imageUrl: safeProductImageUrl(product.imageUrl),
      })),
    });
  } catch (error) {
    console.error("Failed to load products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  const prisma = getPrisma();

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = text(body.name);
    const category = text(body.category, "Custom Jersey");
    const description = text(body.description);
    const priceFrom = Math.max(0, Math.round(numberValue(body.priceFrom, 0)));
    const sanitizedImage = sanitizeImageUrl(body.imageUrl);
    const isActive = booleanValue(body.isActive, true);
    const sortOrder = Math.round(numberValue(body.sortOrder, 0));

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!sanitizedImage.ok) {
      return NextResponse.json(
        {
          success: false,
          message: sanitizedImage.message,
        },
        { status: 400 }
      );
    }

    const baseSlug = slugify(text(body.slug, name));
    const slug = await makeUniqueSlug(prisma, baseSlug);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        description,
        priceFrom,
        imageUrl: sanitizedImage.value,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created.",
    });
  } catch (error) {
    console.error("Failed to create product:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  const prisma = getPrisma();

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const id = text(body.id);
    const name = text(body.name);
    const category = text(body.category, "Custom Jersey");
    const description = text(body.description);
    const priceFrom = Math.max(0, Math.round(numberValue(body.priceFrom, 0)));
    const sanitizedImage = sanitizeImageUrl(body.imageUrl);
    const isActive = booleanValue(body.isActive, true);
    const sortOrder = Math.round(numberValue(body.sortOrder, 0));

    if (!id || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id and name are required.",
        },
        { status: 400 }
      );
    }

    if (!sanitizedImage.ok) {
      return NextResponse.json(
        {
          success: false,
          message: sanitizedImage.message,
        },
        { status: 400 }
      );
    }

    const baseSlug = slugify(text(body.slug, name));
    const slug = await makeUniqueSlug(prisma, baseSlug, id);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        description,
        priceFrom,
        imageUrl: sanitizedImage.value,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated.",
    });
  } catch (error) {
    console.error("Failed to update product:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  const prisma = getPrisma();

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = text(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required.",
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted.",
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
