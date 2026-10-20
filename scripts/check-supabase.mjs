import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

try {
  for (const line of readFileSync(resolve(".env.local"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
} catch {
  console.error("No .env.local found. Copy .env.example to .env.local and fill in your Supabase keys.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const problems = [];
if (!url) problems.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
else if (url.includes("your-project.supabase.co")) problems.push("NEXT_PUBLIC_SUPABASE_URL is still the placeholder.");
if (!key) problems.push("SUPABASE_SERVICE_ROLE_KEY is missing (use the secret / service_role key, not the publishable key).");
else if (key === "your-service-role-key") problems.push("SUPABASE_SERVICE_ROLE_KEY is still the placeholder.");
else if (key.startsWith("sb_publishable_")) problems.push("SUPABASE_SERVICE_ROLE_KEY is a publishable key; use the secret key instead.");
if (problems.length) {
  problems.forEach((problem) => console.error(problem));
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

for (const table of ["users", "venues", "cover_options", "passes"]) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    console.error(`${table}: ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`${table}: ok (${count} rows)`);
  }
}

if (process.exitCode) console.error("Run supabase/schema.sql and supabase/seed.sql in the Supabase SQL Editor, then try again.");
else console.log("Supabase is connected.");
