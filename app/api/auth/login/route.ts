import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../lib/supabase";

function markSignedIn(response: NextResponse) {
  response.cookies.set("linepass_signed_in", "1", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return response;
}

export async function POST(request: Request) {
  const body = await request.json();
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!hasSupabaseConfig()) {
    const response = NextResponse.json({ ok: true, local: true });
    response.cookies.set("linepass_user_id", "local-demo-user", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    return markSignedIn(response);
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: user, error } = await supabase.from("users").select("*").eq("username", username).maybeSingle();
  if (error) throw error;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }
  if (!user.active) {
    return NextResponse.json({ error: "This account has been deactivated." }, { status: 403 });
  }

  const deviceId =
    request.headers.get("x-linepass-device") ?? (await cookies()).get("linepass_device_id")?.value ?? crypto.randomUUID();
  const deviceTokenHash = createHash("sha256").update(deviceId).digest("hex");
  if (user.device_token_hash && user.device_token_hash !== deviceTokenHash) {
    return NextResponse.json({ error: "This account is already bound to another device." }, { status: 403 });
  }
  if (!user.device_token_hash) {
    const { error: updateError } = await supabase
      .from("users")
      .update({ device_token_hash: deviceTokenHash })
      .eq("id", user.id);
    if (updateError) throw updateError;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("linepass_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  response.cookies.set("linepass_device_id", deviceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return markSignedIn(response);
}
