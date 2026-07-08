import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function text(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

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

export async function GET() {
  const prisma = getPrisma();

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: inquiries,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load inquiries.",
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
    const email = text(body.email);
    const whatsapp = text(body.whatsapp);
    const productName = text(body.productName);
    const productSlug = text(body.productSlug);
    const message = text(body.message);
    const source = text(body.source, "website");

    if (!name || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and message are required.",
        },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: email || null,
        whatsapp: whatsapp || null,
        productName: productName || null,
        productSlug: productSlug || null,
        message,
        source,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: "Inquiry saved.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save inquiry.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function PATCH(request: Request) {
  const prisma = getPrisma();

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const id = text(body.id);
    const status = text(body.status, "NEW");

    const allowedStatuses = ["NEW", "CONTACTED", "DONE"];

    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid inquiry id and status are required.",
        },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: inquiry,
      message: "Inquiry status updated.",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update inquiry status.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
