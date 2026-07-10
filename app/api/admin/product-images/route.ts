import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getMissingCloudinaryVars() {
  return [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ].filter((key) => !process.env[key]);
}

function configureCloudinary() {
  const missing = getMissingCloudinaryVars();

  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary variables: ${missing.join(", ")}`);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function slugifyFilename(filename: string) {
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || `product-${Date.now()}`;
}

async function uploadToCloudinary(file: File) {
  configureCloudinary();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const safeName = slugifyFilename(file.name);

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "hazel-label/products",
    public_id: `${safeName}-${Date.now()}`,
    resource_type: "image",
    overwrite: false,
    format: "webp",
    transformation: [
      {
        width: 1600,
        crop: "limit",
        quality: "auto:good",
      },
    ],
  });

  const optimizedUrl = cloudinary.url(result.public_id, {
    secure: true,
    format: "webp",
    transformation: [
      {
        width: 1600,
        crop: "limit",
        quality: "auto:good",
      },
    ],
  });

  return optimizedUrl;
}

export async function GET() {
  const missing = getMissingCloudinaryVars();

  return NextResponse.json({
    success: missing.length === 0,
    message:
      missing.length === 0
        ? "Cloudinary variables are configured."
        : `Missing Cloudinary variables: ${missing.join(", ")}`,
    missing,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type: ${file.type}. Only image files are allowed.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is too large. Maximum size is 5MB.",
        },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(file);

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Image uploaded.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upload error.";

    console.error("Product image upload error:", message);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
