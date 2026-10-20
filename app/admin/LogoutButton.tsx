"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="rounded border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
      Log out
    </button>
  );
}
