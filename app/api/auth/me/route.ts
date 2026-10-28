import { NextResponse } from "next/server";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../lib/supabase";
import { getSessionUserId } from "../../../../lib/userSession";

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ user: null });
  if (!hasSupabaseConfig()) return NextResponse.json({ user: { name: "Demo User" } });

  const { data, error } = await getSupabaseServer().from("users").select("name").eq("id", userId).maybeSingle();
  if (error) throw error;
  return NextResponse.json({ user: data ? { name: data.name } : null });
}
