import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBarDayDate } from "../../../../lib/barDay";
import { getSupabaseServer } from "../../../../lib/supabase";

export async function GET() {
  const userId = (await cookies()).get("linepass_user_id")?.value;
  if (!userId) return NextResponse.json({ error: "You must log in first." }, { status: 401 });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("passes")
    .upsert({ user_id: userId, bar_day_date: getBarDayDate() }, { onConflict: "user_id,bar_day_date" })
    .select("id, bar_day_date, status")
    .single();
  if (error) throw error;
  return NextResponse.json({ pass: data });
}
