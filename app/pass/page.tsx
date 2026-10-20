"use client";

import Link from "next/link";
import { BottomNav, LinePassMark, lato, passesBackground, QrCode, useNow } from "./shared";

const RESET_HOUR = 4;

const pass = {
  venue: "Red Lion",
  title: "Cover (Wed, iCard)",
  quantity: 1,
  passholder: "Arnav Dedhia"
};

function ordinal(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  return `${day}${["th", "st", "nd", "rd"][day % 10] ?? "th"}`;
}

function formatNow(date: Date) {
  const month = date.toLocaleString("en-US", { month: "short" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
  return `${month} ${ordinal(date.getDate())} ${time}`;
}

function formatExpiry(now: Date) {
  const expiry = new Date(now);
  expiry.setHours(RESET_HOUR, 0, 0, 0);
  if (expiry <= now) expiry.setDate(expiry.getDate() + 1);
  const day = expiry.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = expiry.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${time}`;
}

function PassCard({ expiresAt }: { expiresAt: string }) {
  return (
    <article
      className="relative mx-[clamp(12px,5.9vw,23px)] mt-[9px] shrink-0 rounded-[15px] px-[15px] pb-[15px] pt-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
      style={{ backgroundImage: "linear-gradient(115deg, #e5b234 0%, #e3b130 45%, #d5ae2a 75%, #b7ab21 100%)" }}
    >
      <p className="text-[14px] font-bold leading-[17px] text-[#f7d47e]">{pass.venue}</p>
      <h2 className="mt-[3px] text-[22px] font-bold leading-[26px] text-white">{pass.title}</h2>

      <span className="absolute right-[14px] top-[23px] flex h-[32px] w-[57px] items-center justify-center rounded-full border-[1.5px] border-[#fff3c4] bg-white/[0.06] text-[12px] font-bold text-[#fff7da] shadow-[0_1px_4px_rgba(120,80,0,0.35)]">
        Qty {pass.quantity}
      </span>

      <div className="mx-auto mt-[7px] aspect-square h-[clamp(96px,14dvh,108px)] [@media(max-height:520px)]:h-[76px] rounded-[7px] bg-white p-[clamp(7px,1.1dvh,9px)]">
        <QrCode />
      </div>

      <dl className="mt-[6px] grid grid-cols-2 pr-[16px] text-white">
        <div>
          <dt className="text-[10px] leading-[12px] text-[#fbe3a6]">Passholder</dt>
          <dd className="text-[15px] leading-[18px]">{pass.passholder}</dd>
        </div>
        <div>
          <dt className="text-[10px] leading-[12px] text-[#fbe3a6]">Expires at</dt>
          <dd className="text-[15px] leading-[18px]">{expiresAt}</dd>
        </div>
      </dl>

      <LinePassMark className="absolute bottom-[14px] right-[12px] h-[17px] w-[17px] text-white" />
    </article>
  );
}

export default function PassPage() {
  const now = useNow();

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={passesBackground}
    >
      <header className="mt-[clamp(10px,2.2dvh,20px)] flex h-[24px] shrink-0 items-center justify-between gap-2 pl-[15px] pr-[16px]">
        <h1 className="whitespace-nowrap text-[20px] font-bold tracking-[-0.2px]">My Passes</h1>
        <span className="whitespace-nowrap text-[13.5px] tabular-nums text-[#c9d1db]">{now ? formatNow(now) : ""}</span>
      </header>

      <PassCard expiresAt={now ? formatExpiry(now) : "\u00a0"} />

      <div className="min-h-[8px] flex-1" />

      <div className="mx-[clamp(12px,5.9vw,23px)] shrink-0">
        <div className="border-t border-white/[0.18] pt-[10px]">
          <p className="text-[clamp(15px,4.3vw,17px)] leading-[1.35] text-[#e9edf2]">
            Show pass to door staff to redeem. Only door staff should redeem.
          </p>
        </div>

        <Link
          href="/pass/staff"
          className="mt-[8px] flex h-[clamp(44px,8.5dvh,72px)] w-full items-center justify-center rounded-[7px] border [@media(max-height:520px)]:h-[40px] border-white/90 bg-[#334657] text-[14.5px] text-[#e3e7eb]"
        >
          I am the bartender or venue staff
        </Link>

        <button
          type="button"
          className="mt-[8px] flex h-[clamp(44px,8.5dvh,72px)] w-full items-center justify-center rounded-[7px] [@media(max-height:520px)]:h-[40px] bg-[#0682fe] text-[15px] font-bold text-white"
        >
          How to redeem this pass
        </button>

        <div className="flex h-[clamp(14px,2.6dvh,22px)] items-center justify-center">
          <span className="h-[4px] w-[4px] rounded-full bg-[#b7c8d8]" />
        </div>
      </div>

      <BottomNav active="passes" />
    </section>
  );
}
