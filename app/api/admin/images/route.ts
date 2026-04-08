import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthorized } from "@/lib/admin/auth";
import { getAspectFromName, getProductSlugFromName } from "@/lib/images/aspect";
import type { NextRequest } from "next/server";

const sectionToBucket = {
  products: "product-images",
  gallery: "gallery-images",
} as const;

type UploadSection = keyof typeof sectionToBucket;

function isUploadSection(value: string): value is UploadSection {
  return value === "products" || value === "gallery";
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) return null;
  return createClient(supabaseUrl, serviceRole);
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const section = request.nextUrl.searchParams.get("section") ?? "";
  if (!isUploadSection(section)) {
    return NextResponse.json({ error: "Sección inválida." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const bucket = sectionToBucket[section];
  const { data, error } = await supabase.storage.from(bucket).list("", { limit: 100 });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const images =
    data?.map((file) => ({
      name: file.name,
      aspect: getAspectFromName(file.name),
      productSlug: getProductSlugFromName(file.name),
      url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
    })) ?? [];

  return NextResponse.json({ images });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { section, name } = (await request.json()) as { section?: string; name?: string };
  if (!section || !name || !isUploadSection(section)) {
    return NextResponse.json({ error: "Datos inválidos para eliminar imagen." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const bucket = sectionToBucket[section];
  const { error } = await supabase.storage.from(bucket).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
