import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseServer } from "../../../../lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: user, error } = await supabase.from("users").select("*").eq("username", username).maybeSingle();
  if (error) throw error;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const deviceId = request.headers.get("x-linepass-device") ?? crypto.randomUUID();
  if (user.device_id && user.device_id !== deviceId) {
    return NextResponse.json({ error: "This account is already bound to another device." }, { status: 403 });
  }
  if (!user.device_id) {
    const { error: updateError } = await supabase.from("users").update({ device_id: deviceId }).eq("id", user.id);
    if (updateError) throw updateError;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("linepass_user_id", user.id, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  response.cookies.set("linepass_device_id", deviceId, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return response;
}
