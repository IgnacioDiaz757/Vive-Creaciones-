import { NextResponse } from "next/server";
import { getProductsSummary } from "@/lib/products/data";

export async function GET() {
  const products = await getProductsSummary();
  return NextResponse.json({ products });
}
