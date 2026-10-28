import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../lib/supabase";
import { deviceHashMatches, hashDeviceToken, newDeviceToken, readDeviceToken, startSession } from "../../../../lib/userSession";

const BOUND_ELSEWHERE = "This account is already bound to another device.";

export async function POST(request: Request) {
  const body = await request.json();
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const existingDeviceToken = readDeviceToken();

  if (!hasSupabaseConfig()) {
    return startSession(NextResponse.json({ ok: true, local: true }), "local-demo-user", existingDeviceToken ?? newDeviceToken());
  }

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, password_hash, active, device_token_hash")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }
  if (!user.active) {
    return NextResponse.json({ error: "This account has been deactivated." }, { status: 403 });
  }

  let deviceToken = existingDeviceToken;
  if (user.device_token_hash) {
    if (!deviceToken || !deviceHashMatches(deviceToken, user.device_token_hash)) {
      return NextResponse.json({ error: BOUND_ELSEWHERE }, { status: 403 });
    }
  } else {
    deviceToken ??= newDeviceToken();
    const { data: bound, error: bindError } = await supabase
      .from("users")
      .update({ device_token_hash: hashDeviceToken(deviceToken) })
      .eq("id", user.id)
      .is("device_token_hash", null)
      .select("id")
      .maybeSingle();
    if (bindError) throw bindError;
    if (!bound) return NextResponse.json({ error: BOUND_ELSEWHERE }, { status: 403 });
  }

  return startSession(NextResponse.json({ ok: true }), user.id, deviceToken);
}
