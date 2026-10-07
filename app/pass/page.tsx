"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Pass = { id: string; bar_day_date: string; status: string };

export default function PassPage() {
  const [pass, setPass] = useState<Pass | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pass/today")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) setError(result.error ?? "Unable to load your pass.");
        else setPass(result.pass);
      })
      .catch(() => setError("Unable to connect to LinePass."));
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">Your daily pass</h1>
      <p className="mt-2 text-slate-600">Valid for the current bar day, resetting at 4:00 AM Chicago time.</p>
      {error && <p className="mt-8 rounded bg-red-50 p-4 text-red-700">{error}</p>}
      {pass && (
        <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Guest pass</p>
          <p className="mt-3 break-all text-2xl font-bold">{pass.id}</p>
          <p className="mt-3 text-sm text-slate-600">Bar day: {pass.bar_day_date}</p>
          <p className="mt-4 font-medium capitalize text-green-700">{pass.status}</p>
        </div>
      )}
      <Link className="mt-8 inline-block rounded border px-4 py-3 font-semibold" href="/redeem">
        I am the bartender or venue staff
      </Link>
    </section>
  );
}
