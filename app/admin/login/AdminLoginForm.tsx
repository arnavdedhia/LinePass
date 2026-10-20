"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: new FormData(event.currentTarget).get("password") })
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to log in.");
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Unable to connect to LinePass.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Admin login</h1>
      <p className="mt-2 text-slate-600">Enter the admin password to manage LinePass.</p>
      <form className="mt-8 space-y-4" onSubmit={submit}>
        <input
          className="w-full rounded border p-3"
          name="password"
          type="password"
          placeholder="Admin password"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="w-full rounded bg-ink px-4 py-3 font-semibold text-white disabled:opacity-50" disabled={pending}>
          {pending ? "Checking..." : "Log in"}
        </button>
      </form>
    </section>
  );
}
