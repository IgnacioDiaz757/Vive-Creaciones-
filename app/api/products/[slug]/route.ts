import { NextResponse } from "next/server";
import { getProductDetail, isValidProductSlug } from "@/lib/products/data";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Context) {
  const { slug } = await params;
  if (!isValidProductSlug(slug)) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  const product = await getProductDetail(slug);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ product });
}
