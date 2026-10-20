import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "../../../lib/adminAuth";
import { getSupabaseServer, hasSupabaseConfig } from "../../../lib/supabase";
import LogoutButton from "../LogoutButton";
import ResetPasswordButton from "./ResetPasswordButton";

export const dynamic = "force-dynamic";

type AdminUser = {
  id: string;
  name: string;
  username: string;
  active: boolean;
  device_token_hash: string | null;
  created_at: string | null;
};

async function loadUsers() {
  const { data, error } = await getSupabaseServer()
    .from("users")
    .select("id, name, username, active, device_token_hash, created_at")
    .order("username");
  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

export default async function AdminUsersPage() {
  if (!(await verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value))) redirect("/admin/login?next=/admin/users");

  const users = hasSupabaseConfig() ? await loadUsers() : null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-slate-500 hover:text-ink">
            &larr; Admin
          </Link>
          <h1 className="text-3xl font-bold">Users</h1>
        </div>
        <LogoutButton />
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Passwords are stored only as one-way hashes, so they can&apos;t be shown. Use Reset password to give someone a new one.
      </p>

      {!users ? (
        <p className="mt-6 text-slate-600">Supabase is not configured.</p>
      ) : users.length === 0 ? (
        <p className="mt-6 text-slate-600">No users yet.</p>
      ) : (
        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-2">Name</th>
              <th>Username</th>
              <th>Status</th>
              <th>Device</th>
              <th>Created</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b align-top">
                <td className="py-2">{user.name}</td>
                <td className="font-mono">{user.username}</td>
                <td>{user.active ? "Active" : "Deactivated"}</td>
                <td>{user.device_token_hash ? "Linked to a phone" : "Not linked yet"}</td>
                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { timeZone: "America/Chicago" }) : "—"}</td>
                <td className="py-2">
                  <ResetPasswordButton userId={user.id} username={user.username} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
