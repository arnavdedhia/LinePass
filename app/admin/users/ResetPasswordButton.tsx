"use client";

import { useState } from "react";

export default function ResetPasswordButton({ userId, username }: { userId: string; username: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function reset() {
    if (!window.confirm(`Reset the password for ${username}? Their old password will stop working.`)) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}/password`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) setError(result.error ?? "Could not reset the password.");
      else setPassword(result.password);
    } catch {
      setError("Could not reach LinePass.");
    } finally {
      setPending(false);
    }
  }

  if (password) {
    return (
      <div>
        <p className="font-mono text-base font-bold">{password}</p>
        <p className="text-xs text-slate-500">Shown once. Give this to {username}.</p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={reset}
        disabled={pending}
        className="rounded border px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {pending ? "Resetting..." : "Reset password"}
      </button>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
