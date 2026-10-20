import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, verifyAdminToken } from "../../../../../../lib/adminAuth";
import { getSupabaseServer, hasSupabaseConfig } from "../../../../../../lib/supabase";

const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PASSWORD_LENGTH = 12;

function generatePassword() {
  return Array.from({ length: PASSWORD_LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  if (!(await verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  if (!hasSupabaseConfig()) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const password = generatePassword();
  const { data, error } = await getSupabaseServer()
    .from("users")
    .update({ password_hash: await bcrypt.hash(password, 12) })
    .eq("id", params.id)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  if (!data) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({ password });
}
