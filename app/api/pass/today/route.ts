import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBarDayDate } from "../../../../lib/barDay";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../lib/supabase";

const WEEKDAYS = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const DEFAULT_PRICE_CENTS = 1000;
const PASS_COLUMNS = "id, title, bar_day, redeemed_at, venues(slug, name)";

export async function GET(request: Request) {
  const userId = (await cookies()).get("linepass_user_id")?.value;
  if (!userId) return NextResponse.json({ error: "You must log in first." }, { status: 401 });

  const venueSlug = new URL(request.url).searchParams.get("venue")?.trim();
  if (!venueSlug) return NextResponse.json({ error: "A venue is required." }, { status: 400 });

  const barDay = getBarDayDate();
  const weekday = new Date(`${barDay}T00:00:00Z`).getUTCDay();
  const fallbackTitle = `Cover (${WEEKDAYS[weekday]}, All Day)`;

  if (!hasSupabaseConfig()) {
    return NextResponse.json({
      pass: { id: "local-demo-pass", venue: venueSlug, title: fallbackTitle, bar_day: barDay, redeemed_at: null },
      local: true
    });
  }

  const supabase = getSupabaseServer();

  const { data: existing, error: existingError } = await supabase
    .from("passes")
    .select(PASS_COLUMNS)
    .eq("user_id", userId)
    .eq("bar_day", barDay)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return NextResponse.json({ pass: existing });

  const { data: venue, error: venueError } = await supabase.from("venues").select("id").eq("slug", venueSlug).maybeSingle();
  if (venueError) throw venueError;
  if (!venue) return NextResponse.json({ error: "Unknown venue." }, { status: 404 });

  const { data: option, error: optionError } = await supabase
    .from("cover_options")
    .select("title, price_cents")
    .eq("venue_id", venue.id)
    .eq("weekday", weekday)
    .maybeSingle();
  if (optionError) throw optionError;

  const { data, error } = await supabase
    .from("passes")
    .insert({
      user_id: userId,
      venue_id: venue.id,
      title: option?.title ?? fallbackTitle,
      price_cents: option?.price_cents ?? DEFAULT_PRICE_CENTS,
      bar_day: barDay
    })
    .select(PASS_COLUMNS)
    .single();
  if (error) throw error;
  return NextResponse.json({ pass: data });
}
