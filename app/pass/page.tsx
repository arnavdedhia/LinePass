"use client";

import Link from "next/link";
import { lato, QrCode, useNow } from "./shared";

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

function LinePassMark({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3h3.6L8.4 15.2h4.9l-.5 3.3H3.9L6.6 3Zm7.2 3.3h3.3l-1.3 8.9h4.4l-.5 3.3h-6.3L12 17l1.8-10.7Z"
        fill={outline ? "none" : "currentColor"}
        stroke={outline ? "currentColor" : "none"}
        strokeWidth={outline ? 1.5 : 0}
        strokeLinejoin="round"
      />
    </svg>
  );
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

function NavItem({ label, icon, active = false }: { label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center ${active ? "text-white" : "text-[#8b98a7]"}`}>
      <div className="flex h-[24px] items-center justify-center">{icon}</div>
      <span className="mt-[4px] text-[11px] leading-[13px]">{label}</span>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="grid h-[clamp(56px,9.5dvh,82px)] shrink-0 [@media(max-height:520px)]:h-[50px] grid-cols-5 border-t border-white/[0.04] bg-[#0a1f34] pt-[4px]">
      <NavItem
        label="Venues"
        icon={
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="currentColor" strokeLinejoin="round" />
          </svg>
        }
      />
      <NavItem
        active
        label="My Passes"
        icon={
          <svg width="23" height="17" viewBox="0 0 23 17" fill="currentColor">
            <path d="M2 0h8.6v17H2a2 2 0 0 1-2-2v-4A2.5 2.5 0 0 0 0 6V2a2 2 0 0 1 2-2Z" />
            <path d="M12.4 0H21a2 2 0 0 1 2 2v4a2.5 2.5 0 0 0 0 5v4a2 2 0 0 1-2 2h-8.6V0Z" />
          </svg>
        }
      />
      <div className="flex flex-col items-center text-[#8b98a7]">
        <div className="relative flex h-[24px] items-start justify-center">
          <span className="absolute top-[13px] flex h-[11px] w-[18px] items-end justify-center rounded-b-full bg-[#2d5fa6] pb-[3px]">
            <span className="h-[1px] w-[7px] bg-white/60" />
          </span>
          <span className="relative -mt-[1px] flex h-[18px] w-[37px] items-center justify-center rounded-full border border-[#5b9ae6] bg-[#1a6bc6] text-[12px] font-bold italic leading-none tracking-[0.2px] text-white">
            NEW
          </span>
        </div>
        <span className="mt-[4px] text-[11px] leading-[13px]">Points</span>
      </div>
      <NavItem label="Drops" icon={<LinePassMark outline className="h-[23px] w-[23px]" />} />
      <NavItem
        label="Account"
        icon={
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="5.5" r="4.5" />
            <path d="M1 20.2v-1.4A5.8 5.8 0 0 1 6.8 13h6.4a5.8 5.8 0 0 1 5.8 5.8v1.4" strokeLinecap="round" />
          </svg>
        }
      />
    </nav>
  );
}

export default function PassPage() {
  const now = useNow();

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={{
        backgroundImage:
          "radial-gradient(120% 45% at 100% 0%, rgba(8, 82, 164, 0.95) 0%, rgba(11, 58, 108, 0.75) 35%, rgba(14, 38, 62, 0) 75%)"
      }}
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

      <BottomNav />
    </section>
  );
}
