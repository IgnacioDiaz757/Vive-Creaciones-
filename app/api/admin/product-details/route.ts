import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthorized } from "@/lib/admin/auth";
import { isValidProductSlug } from "@/lib/products/data";
import type { NextRequest } from "next/server";

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
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("product_details")
    .select("slug, price, short_description");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ details: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Config de Supabase incompleta." }, { status: 500 });
  }

  const { slug, price, shortDescription } = (await request.json()) as {
    slug?: string;
    price?: string;
    shortDescription?: string;
  };

  if (!slug || !isValidProductSlug(slug)) {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }

  const { error } = await supabase.from("product_details").upsert(
    {
      slug,
      price: price?.trim() || null,
      short_description: shortDescription?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (error) {
    return NextResponse.json(
      {
        error:
          "No se pudo guardar detalle. Verificá que exista la tabla product_details (slug, price, short_description, updated_at).",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
