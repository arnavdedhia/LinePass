import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "linepass_session";
export const DEVICE_COOKIE = "linepass_device_id";
export const SIGNED_IN_COOKIE = "linepass_signed_in";
export const LEGACY_USER_COOKIE = "linepass_user_id";

const SESSION_SECONDS = 60 * 60 * 24 * 30;
const DEVICE_SECONDS = 60 * 60 * 24 * 365;

const secure = process.env.NODE_ENV === "production";

function sessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "linepass-local-dev-only";
  throw new Error("Set SESSION_SECRET or SUPABASE_SERVICE_ROLE_KEY to sign user sessions.");
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(`session:${payload}`).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function hashDeviceToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function deviceHashMatches(token: string, storedHash: string) {
  return safeEqual(hashDeviceToken(token), storedHash);
}

export function newDeviceToken() {
  return randomBytes(32).toString("base64url");
}

export function readDeviceToken() {
  return cookies().get(DEVICE_COOKIE)?.value || null;
}

export function getSessionUserId() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [userId, expiresAt, signature] = token.split(".");
  if (!userId || !expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) return null;
  return safeEqual(signature, sign(`${userId}.${expiresAt}`)) ? userId : null;
}

export function startSession(response: NextResponse, userId: string, deviceToken: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  response.cookies.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_SECONDS
  });
  response.cookies.set(DEVICE_COOKIE, deviceToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: DEVICE_SECONDS
  });
  response.cookies.set(SIGNED_IN_COOKIE, "1", { sameSite: "lax", secure, path: "/", maxAge: SESSION_SECONDS });
  response.cookies.delete(LEGACY_USER_COOKIE);
  return response;
}

export function endSession(response: NextResponse) {
  for (const name of [SESSION_COOKIE, SIGNED_IN_COOKIE, LEGACY_USER_COOKIE]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}
