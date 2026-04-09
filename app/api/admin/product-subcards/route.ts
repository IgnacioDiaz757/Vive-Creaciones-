import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthorized } from "@/lib/admin/auth";
import { isValidProductSlug } from "@/lib/products/data";
import sharp from "sharp";
import type { NextRequest } from "next/server";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) return null;
  return createClient(supabaseUrl, serviceRole);
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

async function uploadSubcardImage(
  supabase: any,
  file: File,
  subcardId: string,
  productSlug: string
) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const processedImage = await sharp(fileBuffer)
    .resize(1400, 1050, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "subcard";
  const filePath = `${Date.now()}__subcard-${subcardId}__product-${productSlug}__${baseName}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, processedImage, {
      upsert: false,
      contentType: "image/jpeg",
    });
  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return supabase.storage.from("product-images").getPublicUrl(filePath).data.publicUrl;
}

function getFilesFromFormData(formData: FormData, key: string) {
  return formData.getAll(key).filter((item): item is File => item instanceof File);
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("product_subcards")
    .select("id, product_slug, title, price, description, image_url")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json(
      {
        error:
          "No se pudo leer product_subcards. Creá la tabla (id, product_slug, title, price, description, created_at).",
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ subcards: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const formData = await request.formData();
  const productSlug = String(formData.get("productSlug") ?? "");
  const title = String(formData.get("title") ?? "");
  const price = String(formData.get("price") ?? "");
  const description = String(formData.get("description") ?? "");
  const files = getFilesFromFormData(formData, "files");

  if (!productSlug || !isValidProductSlug(productSlug)) {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }
  if (!title.trim()) {
    return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "Tenés que subir al menos una imagen para la card." }, { status: 400 });
  }

  const subcardId = crypto.randomUUID();
  let imageUrl = "";
  try {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadSubcardImage(supabase, file, subcardId, productSlug);
      uploadedUrls.push(url);
    }
    imageUrl = uploadedUrls[0] ?? "";
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  const { error } = await supabase.from("product_subcards").insert({
    id: subcardId,
    product_slug: productSlug,
    title: title.trim(),
    price: price.trim() || null,
    description: description.trim() || null,
    image_url: imageUrl,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const formData = await request.formData();
  const id = String(formData.get("id") ?? "");
  const productSlug = String(formData.get("productSlug") ?? "");
  const title = String(formData.get("title") ?? "");
  const price = String(formData.get("price") ?? "");
  const description = String(formData.get("description") ?? "");
  const files = getFilesFromFormData(formData, "files");

  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  if (!productSlug || !isValidProductSlug(productSlug)) {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }
  if (!title.trim()) {
    return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
  }

  const updatePayload: {
    title: string;
    price: string | null;
    description: string | null;
    image_url?: string;
  } = {
    title: title.trim(),
    price: price.trim() || null,
    description: description.trim() || null,
  };

  if (files.length > 0) {
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadSubcardImage(supabase, file, id, productSlug);
        uploadedUrls.push(url);
      }
      updatePayload.image_url = uploadedUrls[0];
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }

  const { error } = await supabase.from("product_subcards").update(updatePayload).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }
  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "ID inválido." }, { status: 400 });

  const { error } = await supabase.from("product_subcards").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
