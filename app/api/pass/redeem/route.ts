import { NextResponse } from "next/server";
import { getBarDayDate } from "../../../../lib/barDay";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../lib/supabase";
import { getSessionUserId } from "../../../../lib/userSession";

export async function POST(request: Request) {
  const staffId = getSessionUserId();
  if (!staffId) return NextResponse.json({ error: "Staff must log in first." }, { status: 401 });
  const body = await request.json();
  const passId = typeof body.passId === "string" ? body.passId.trim() : "";
  if (!passId) return NextResponse.json({ error: "A pass ID is required." }, { status: 400 });

  if (!hasSupabaseConfig()) {
    if (passId !== "local-demo-pass") {
      return NextResponse.json({ error: "Pass is invalid, expired, or already redeemed." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, message: "The local demo pass has been redeemed." });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("passes")
    .update({ redeemed_at: new Date().toISOString(), redeemed_by: staffId })
    .eq("id", passId)
    .eq("bar_day", getBarDayDate())
    .is("redeemed_at", null)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return NextResponse.json({ error: "Pass is invalid, expired, or already redeemed." }, { status: 409 });
  return NextResponse.json({ ok: true, message: "The pass is valid and has been redeemed." });
}
