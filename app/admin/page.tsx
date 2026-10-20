import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "../../lib/adminAuth";
import { getSupabaseServer, hasSupabaseConfig } from "../../lib/supabase";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

const TABLES = ["users", "venues", "cover_options", "passes"] as const;

type RecentPass = {
  id: string;
  bar_day: string;
  title: string | null;
  redeemed_at: string | null;
  users: { name: string; username: string } | null;
  venues: { name: string } | null;
};

async function loadOverview() {
  const supabase = getSupabaseServer();
  const counts = await Promise.all(
    TABLES.map(async (table) => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw error;
      return [table, count ?? 0] as const;
    })
  );
  const { data, error } = await supabase
    .from("passes")
    .select("id, bar_day, title, redeemed_at, users!passes_user_id_fkey(name, username), venues(name)")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return { counts, recentPasses: (data ?? []) as unknown as RecentPass[] };
}

export default async function AdminPage() {
  if (!(await verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value))) redirect("/admin/login");

  const overview = hasSupabaseConfig() ? await loadOverview() : null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <LogoutButton />
      </div>

      {!overview ? (
        <p className="mt-6 text-slate-600">Supabase is not configured. Add your keys to .env.local.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {overview.counts.map(([table, count]) => (
              <div key={table} className="rounded border p-4">
                <p className="text-sm text-slate-500">{table}</p>
                <p className="mt-1 text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-bold">Recent passes</h2>
          {overview.recentPasses.length === 0 ? (
            <p className="mt-3 text-slate-600">No passes yet.</p>
          ) : (
            <table className="mt-3 w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-2">Bar day</th>
                  <th>Guest</th>
                  <th>Venue</th>
                  <th>Pass</th>
                  <th>Redeemed</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentPasses.map((pass) => (
                  <tr key={pass.id} className="border-b">
                    <td className="py-2">{pass.bar_day}</td>
                    <td>{pass.users?.name ?? "Unknown"}</td>
                    <td>{pass.venues?.name ?? "—"}</td>
                    <td>{pass.title ?? "—"}</td>
                    <td>{pass.redeemed_at ? new Date(pass.redeemed_at).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "Not yet"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
}
