import { NextResponse } from "next/server";
import { endSession } from "../../../../lib/userSession";

export async function POST() {
  return endSession(NextResponse.json({ ok: true }));
}
