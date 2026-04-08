import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isAdminAuthorized(request) });
}
