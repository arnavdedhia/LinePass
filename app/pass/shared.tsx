"use client";

import { Lato } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

export const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });

export const passesBackground = {
  backgroundImage:
    "radial-gradient(120% 45% at 100% 0%, rgba(8, 82, 164, 0.95) 0%, rgba(11, 58, 108, 0.75) 35%, rgba(14, 38, 62, 0) 75%)"
};

export function useNow() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

const QR_SIZE = 29;

const qrModules = Array.from({ length: QR_SIZE * QR_SIZE }, (_, index) => {
  const x = index % QR_SIZE;
  const y = Math.floor(index / QR_SIZE);

  const finder = (ox: number, oy: number) => {
    const dx = x - ox;
    const dy = y - oy;
    if (dx < -1 || dx > 7 || dy < -1 || dy > 7) return null;
    if (dx === -1 || dx === 7 || dy === -1 || dy === 7) return false;
    return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
  };

  for (const [ox, oy] of [[0, 0], [QR_SIZE - 7, 0], [0, QR_SIZE - 7]]) {
    const value = finder(ox, oy);
    if (value !== null) return value;
  }

  const ax = x - (QR_SIZE - 7);
  const ay = y - (QR_SIZE - 7);
  if (Math.abs(ax) <= 2 && Math.abs(ay) <= 2) {
    return Math.max(Math.abs(ax), Math.abs(ay)) !== 1;
  }

  if (y === 6) return x % 2 === 0;
  if (x === 6) return y % 2 === 0;

  const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return noise - Math.floor(noise) < 0.5;
});

export function LinePassMark({ className, outline = false }: { className?: string; outline?: boolean }) {
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

function NavItem({
  label,
  icon,
  active = false,
  href
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const className = `flex flex-col items-center ${active ? "text-white" : "text-[#8b98a7]"}`;
  const content = (
    <>
      <div className="flex h-[24px] items-center justify-center">{icon}</div>
      <span className="mt-[4px] text-[11px] leading-[13px]">{label}</span>
    </>
  );

  if (!href) return <div className={className}>{content}</div>;

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  );
}

export function BottomNav({ active }: { active: "venues" | "passes" }) {
  return (
    <nav className="grid h-[clamp(56px,10.3dvh,82px)] shrink-0 [@media(max-height:520px)]:h-[50px] grid-cols-5 border-t border-white/[0.04] bg-[#0a1f34] pt-[4px]">
      <NavItem
        href="/pass/home"
        active={active === "venues"}
        label="Venues"
        icon={
          active === "venues" ? (
            <svg width="22" height="22" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
              <path d="m16 8-2.4 5.6L8 16l2.4-5.6L16 8Z" fill="#0a1f34" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="10" />
              <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" fill="currentColor" strokeLinejoin="round" />
            </svg>
          )
        }
      />
      <NavItem
        href="/pass"
        active={active === "passes"}
        label="My Passes"
        icon={
          active === "passes" ? (
            <svg width="23" height="17" viewBox="0 0 23 17" fill="currentColor">
              <path d="M2 0h8.6v17H2a2 2 0 0 1-2-2v-4A2.5 2.5 0 0 0 0 6V2a2 2 0 0 1 2-2Z" />
              <path d="M12.4 0H21a2 2 0 0 1 2 2v4a2.5 2.5 0 0 0 0 5v4a2 2 0 0 1-2 2h-8.6V0Z" />
            </svg>
          ) : (
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M2.8.8h18.4a2 2 0 0 1 2 2v3.6a2.6 2.6 0 0 0 0 5.2v3.6a2 2 0 0 1-2 2H2.8a2 2 0 0 1-2-2v-3.6a2.6 2.6 0 0 0 0-5.2V2.8a2 2 0 0 1 2-2Z" />
              <path d="M9 6.5h6M9 11.5h6" strokeLinecap="round" />
            </svg>
          )
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

export function QrCode() {
  return (
    <svg
      className="h-full w-full"
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pass QR code"
    >
      {qrModules.map((filled, index) =>
        filled ? (
          <rect key={index} x={index % QR_SIZE} y={Math.floor(index / QR_SIZE)} width="1" height="1" fill="#000" />
        ) : null
      )}
    </svg>
  );
}
