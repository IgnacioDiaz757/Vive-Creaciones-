import { createHash } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "vive_admin_session";

function getPasswordHash(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function isAdminAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!adminPassword || !session) return false;
  return session === getPasswordHash(adminPassword);
}

export function setAdminSessionCookie(response: NextResponse, password: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, getPasswordHash(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
