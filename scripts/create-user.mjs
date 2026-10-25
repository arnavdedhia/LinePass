import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

function loadLocalEnv() {
  let contents;

  try {
    contents = readFileSync(resolve(".env.local"), "utf8");
  } catch {
    throw new Error("Create .env.local from .env.example before creating users.");
  }

  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const [username, password, ...nameParts] = process.argv.slice(2);
if (!username || !password) {
  throw new Error('Usage: npm run user:create -- <username> <password> ["Display Name"]');
}
const name = nameParts.join(" ") || username;

loadLocalEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const passwordHash = await bcrypt.hash(password, 12);
const { error } = await supabase
  .from("users")
  .upsert({ username, password_hash: passwordHash, name, device_token_hash: null, active: true }, { onConflict: "username" });

if (error) throw error;
console.log(`User saved. Username: ${username}`);
