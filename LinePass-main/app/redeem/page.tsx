"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedeemPage() {
  const router = useRouter();
  const [passId, setPassId] = useState("");
  const [error, setError] = useState("");

  async function redeem(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/pass/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passId })
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Redemption failed.");
      return;
    }
    router.push(`/redeem/result?success=true&message=${encodeURIComponent(result.message)}`);
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold">Redeem a pass</h1>
      <p className="mt-2 text-slate-600">Enter the guest pass ID and confirm redemption.</p>
      <form className="mt-8 space-y-4" onSubmit={redeem}>
        <input className="w-full rounded border p-3" value={passId} onChange={(event) => setPassId(event.target.value)} placeholder="Pass ID" required />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="w-full rounded bg-gold px-4 py-3 font-bold text-ink">Redeem</button>
      </form>
    </section>
  );
}
