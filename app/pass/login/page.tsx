"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { LinePassMark, lato, passesBackground } from "../shared";
import { useSelectedVenue } from "../VenueContext";

const inputClassName =
  "h-[50px] w-full rounded-[8px] border border-white/[0.3] bg-white/[0.13] px-[12px] text-[16px] text-white placeholder:text-[#8b98a7] focus:border-[#0682fe] focus:outline-none";

export default function PassLoginPage() {
  const router = useRouter();
  const { venue, signedIn, markSignedIn } = useSelectedVenue();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (signedIn) router.replace("/pass");
  }, [signedIn, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Unable to log in.");
        return;
      }
      markSignedIn();
    } catch {
      setError("Unable to connect to LinePass.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={passesBackground}
    >
      <header className="relative h-[44px] shrink-0">
        <Link
          href={`/pass/venues/${venue.slug}`}
          aria-label="Back"
          className="absolute left-[12px] top-[clamp(4px,0.9dvh,8px)] flex h-[36px] w-[36px] items-center justify-center"
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2 2 9l7 7" />
          </svg>
        </Link>
      </header>

      <div className="flex flex-1 flex-col px-[20px] pt-[clamp(16px,6dvh,56px)]">
        <LinePassMark className="h-[34px] w-[34px] text-white" />
        <h1 className="mt-[14px] text-[24px] font-bold leading-[30px]">Log in</h1>
        <p className="mt-[4px] text-[14.5px] leading-[20px] text-[#c9d1db]">Log in to get your {venue.name} pass.</p>

        <form className="mt-[24px] flex flex-col gap-[12px]" onSubmit={submit}>
          <input
            className={inputClassName}
            name="username"
            placeholder="Username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            required
          />
          <input
            className={inputClassName}
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          {error && <p className="text-[14px] leading-[18px] text-[#ff8f8f]">{error}</p>}
          <button
            className="mt-[8px] flex h-[50px] w-full items-center justify-center rounded-[7px] bg-[#0682fe] text-[15px] font-bold text-white disabled:opacity-60"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
}
