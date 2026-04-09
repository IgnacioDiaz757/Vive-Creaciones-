import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthorized } from "@/lib/admin/auth";
import { isAspectOption } from "@/lib/images/aspect";
import { PRODUCT_CATALOG } from "@/lib/products/catalog";
import sharp from "sharp";
import type { NextRequest } from "next/server";

const sectionToBucket = {
  products: "product-images",
  gallery: "gallery-images",
} as const;

type UploadSection = keyof typeof sectionToBucket;

function isUploadSection(value: string): value is UploadSection {
  return value === "products" || value === "gallery";
}

function sanitizeFileName(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    return NextResponse.json(
      { error: "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const section = String(formData.get("section") ?? "");
  const aspect = String(formData.get("aspect") ?? "16x9");
  const productSlug = String(formData.get("productSlug") ?? "");
  const file = formData.get("file");

  if (!isUploadSection(section)) {
    return NextResponse.json({ error: "Sección de subida inválida." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió archivo." }, { status: 400 });
  }
  if (!isAspectOption(aspect)) {
    return NextResponse.json({ error: "Aspect ratio inválido." }, { status: 400 });
  }
  if (
    section === "products" &&
    (!productSlug || !PRODUCT_CATALOG.some((product) => product.slug === productSlug))
  ) {
    return NextResponse.json(
      { error: "Debés indicar un producto válido para subir la imagen." },
      { status: 400 }
    );
  }

  const bucket = sectionToBucket[section];
  const supabase = createClient(supabaseUrl, serviceRole);
  const dimensions =
    aspect === "16x9"
      ? { width: 1600, height: 900 }
      : aspect === "9x16"
        ? { width: 1080, height: 1920 }
        : aspect === "4x3"
          ? { width: 1400, height: 1050 }
          : { width: 1200, height: 1200 };

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const processedImage = await sharp(fileBuffer)
    .resize(dimensions.width, dimensions.height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const productToken = section === "products" ? `__product-${productSlug}` : "";
  const heroToken = section === "products" ? "__hero" : "";
  const rawBaseName = file.name.replace(/\.[^.]+$/, "");
  const safeBaseName = sanitizeFileName(rawBaseName) || "image";
  const filePath = `${Date.now()}__${aspect}${heroToken}${productToken}__${safeBaseName}.jpg`;

  if (section === "products") {
    const { data: existingFiles } = await supabase.storage.from(bucket).list("", { limit: 500 });
    const oldHeroFiles =
      existingFiles
        ?.map((existing) => existing.name)
        .filter((name) => name.includes("__hero__") && name.includes(`__product-${productSlug}__`)) ?? [];
    if (oldHeroFiles.length > 0) {
      await supabase.storage.from(bucket).remove(oldHeroFiles);
    }
  }

  const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, processedImage, {
    upsert: false,
    contentType: "image/jpeg",
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return NextResponse.json({ ok: true, url: data.publicUrl, bucket });
}
