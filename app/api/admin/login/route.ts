import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "Falta configurar ADMIN_PASSWORD en variables de entorno." },
      { status: 500 }
    );
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Password de admin incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response, adminPassword);
  return response;
}
