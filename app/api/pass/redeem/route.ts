import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBarDayDate } from "../../../../lib/barDay";
import { getSupabaseServer } from "../../../../lib/supabase";

export async function POST(request: Request) {
  const staffId = (await cookies()).get("linepass_user_id")?.value;
  if (!staffId) return NextResponse.json({ error: "Staff must log in first." }, { status: 401 });
  const body = await request.json();
  const passId = typeof body.passId === "string" ? body.passId.trim() : "";
  if (!passId) return NextResponse.json({ error: "A pass ID is required." }, { status: 400 });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("passes")
    .update({ status: "redeemed", redeemed_at: new Date().toISOString(), redeemed_by: staffId })
    .eq("id", passId)
    .eq("bar_day_date", getBarDayDate())
    .eq("status", "active")
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return NextResponse.json({ error: "Pass is invalid, expired, or already redeemed." }, { status: 409 });
  return NextResponse.json({ ok: true, message: "The pass is valid and has been redeemed." });
}
