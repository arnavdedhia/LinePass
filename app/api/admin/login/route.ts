import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, checkAdminPassword, createAdminToken, hasAdminPassword } from "../../../../lib/adminAuth";

const FAILED_LOGIN_DELAY_MS = 1000;

export async function POST(request: Request) {
  if (!hasAdminPassword()) {
    return NextResponse.json({ error: "Admin login is not set up. Add ADMIN_PASSWORD to .env.local." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!(await checkAdminPassword(password))) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS
  });
  return response;
}
