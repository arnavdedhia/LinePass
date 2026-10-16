"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Pass = { id: string; bar_day_date: string; status: string };

const qrModules = Array.from({ length: 21 * 21 }, (_, index) => {
  const x = index % 21;
  const y = Math.floor(index / 21);
  const inFinder = (originX: number, originY: number) =>
    x >= originX &&
    x < originX + 7 &&
    y >= originY &&
    y < originY + 7 &&
    (x === originX ||
      x === originX + 6 ||
      y === originY ||
      y === originY + 6 ||
      (x >= originX + 2 && x <= originX + 4 && y >= originY + 2 && y <= originY + 4));

  if (inFinder(0, 0) || inFinder(14, 0) || inFinder(0, 14)) return true;
  return ((x * 17 + y * 29 + x * y * 3) % 11 < 5) || ((x + y) % 9 === 0);
});

function QrCode() {
  return (
    <svg className="h-full w-full" viewBox="0 0 21 21" role="img" aria-label="Pass QR code">
      <rect width="21" height="21" fill="white" />
      {qrModules.map((isFilled, index) =>
        isFilled ? (
          <rect
            key={index}
            x={index % 21}
            y={Math.floor(index / 21)}
            width="1"
            height="1"
            fill="#050505"
          />
        ) : null
      )}
    </svg>
  );
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return <span className="flex h-6 items-center justify-center text-[25px] leading-none">{children}</span>;
}

export default function PassPage() {
  const [, setPass] = useState<Pass | null>(null);
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
    <section className="fixed inset-0 z-50 flex min-h-screen min-w-[320px] flex-col overflow-hidden bg-[#09243b] text-white">
      <div className="mx-auto flex w-full max-w-[472px] flex-1 flex-col px-7 pt-5">
        <div className="flex items-center justify-between px-9 text-[18px] font-semibold tracking-tight">
          <span>11:42</span>
          <span className="flex items-center gap-1.5 text-[17px]">
            <span className="flex items-end gap-0.5" aria-label="cellular signal">
              <i className="h-1 w-1 rounded-sm bg-white" />
              <i className="h-2 w-1 rounded-sm bg-white" />
              <i className="h-3 w-1 rounded-sm bg-white" />
              <i className="h-4 w-1 rounded-sm bg-white" />
            </span>
            <span aria-hidden="true">⌁</span>
            <span className="rounded bg-[#e8c94f] px-1 text-[12px] text-[#13253b]">23</span>
          </span>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h1 className="text-[21px] font-medium tracking-tight">My Passes</h1>
          <span className="text-[16px] text-[#c5cbd2]">Sep 30th 11:42:02 PM</span>
        </div>

        <div className="mt-4 rounded-[18px] bg-[#edb91f] px-[17px] pb-[17px] pt-5 text-white shadow-[0_3px_0_rgba(0,0,0,0.12)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[17px] text-[#ffedae]">Red Lion</p>
              <h2 className="mt-0.5 text-[28px] font-medium leading-8">Cover (Wed, iCard)</h2>
            </div>
            <span className="rounded-full border border-white/80 px-4 py-2 text-[14px] shadow-[0_2px_6px_rgba(77,54,0,0.3)]">
              Qty 1
            </span>
          </div>

          <div className="mx-auto mt-2 h-[130px] w-[130px] rounded-[10px] bg-white p-2.5">
            <QrCode />
          </div>

          <div className="mt-2 flex justify-between text-[15px] leading-5">
            <div>
              <p className="text-[11px] text-[#ffedae]">Passholder</p>
              <p>Arnav Dedhia</p>
            </div>
            <div className="mr-11">
              <p className="text-[11px] text-[#ffedae]">Expires at</p>
              <p>Oct 1, 4:00 AM</p>
            </div>
            <span className="self-end text-[22px] font-black italic">L</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="border-t border-white/30 pb-2 pt-2 text-[20px] leading-7 text-[#f1f3f5]">
            <p>Show pass to door staff to redeem. Only door</p>
            <p>staff should redeem.</p>
          </div>
          <Link
            href="/redeem"
            className="flex h-[88px] items-center justify-center rounded-lg border border-white bg-[#34495c] text-[16px] font-normal"
          >
            I am the bartender or venue staff
          </Link>
          <button className="mt-2 flex h-[88px] w-full items-center justify-center rounded-lg bg-[#1389f4] text-[18px] font-bold">
            How to redeem this pass
          </button>
        </div>
      </div>

      <nav className="mx-auto flex h-[76px] w-full max-w-[472px] items-center justify-between border-t border-white/5 bg-[#082238] px-6 text-[12px] text-[#8997a5]">
        <span className="flex w-16 flex-col items-center gap-1 text-[#8493a1]">
          <NavIcon>◉</NavIcon>
          Venues
        </span>
        <span className="flex w-20 flex-col items-center gap-1 text-white">
          <NavIcon>▮◀▮</NavIcon>
          My Passes
        </span>
        <span className="flex w-16 flex-col items-center gap-1">
          <span className="rounded-full bg-[#287ed1] px-2 text-[14px] font-bold italic text-white">NEW</span>
          Points
        </span>
        <span className="flex w-16 flex-col items-center gap-1">
          <NavIcon>♧</NavIcon>
          Drops
        </span>
        <span className="flex w-16 flex-col items-center gap-1">
          <NavIcon>♙</NavIcon>
          Account
        </span>
      </nav>
      {error ? <span className="sr-only">{error}</span> : null}
    </section>
  );
}
