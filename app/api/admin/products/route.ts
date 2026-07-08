import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis as unknown as {
  productAdminPrisma?: PrismaClient;
};

const prisma =
  globalForPrisma.productAdminPrisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.productAdminPrisma = prisma;
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

async function makeUniqueSlug(baseSlug: string, currentId?: string) {
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
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load products.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = text(body.name);
    const category = text(body.category, "Custom Jersey");
    const description = text(body.description);
    const priceFrom = Math.max(0, Math.round(numberValue(body.priceFrom, 0)));
    const imageUrl = text(body.imageUrl);
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

    const baseSlug = slugify(text(body.slug, name));
    const slug = await makeUniqueSlug(baseSlug);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        description,
        priceFrom,
        imageUrl: imageUrl || null,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product created.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const id = text(body.id);
    const name = text(body.name);
    const category = text(body.category, "Custom Jersey");
    const description = text(body.description);
    const priceFrom = Math.max(0, Math.round(numberValue(body.priceFrom, 0)));
    const imageUrl = text(body.imageUrl);
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

    const baseSlug = slugify(text(body.slug, name));
    const slug = await makeUniqueSlug(baseSlug, id);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        description,
        priceFrom,
        imageUrl: imageUrl || null,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}
