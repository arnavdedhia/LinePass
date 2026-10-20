export const ADMIN_COOKIE = "linepass_admin";
export const ADMIN_SESSION_SECONDS = 12 * 60 * 60;

const encoder = new TextEncoder();

function adminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  return password && password !== "choose-a-long-admin-password" ? password : null;
}

export function hasAdminPassword() {
  return adminPassword() !== null;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function checkAdminPassword(candidate: string) {
  const password = adminPassword();
  if (!password) return false;
  const [expected, actual] = await Promise.all([sign("password", password), sign("password", candidate)]);
  return constantTimeEqual(expected, actual);
}

export async function createAdminToken() {
  const password = adminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD is not set.");
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  return `${expiresAt}.${await sign(`admin:${expiresAt}`, password)}`;
}

export async function verifyAdminToken(token: string | undefined) {
  const password = adminPassword();
  if (!password || !token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) return false;
  return constantTimeEqual(signature, await sign(`admin:${expiresAt}`, password));
}
