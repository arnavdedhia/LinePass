"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStartRedeem } from "../RedeemTransition";
import { lato, QrCode, useNow } from "../shared";

const EMOJIS = [
  "💅", "🦄", "🍕", "🎸", "🌮", "🐙", "🍉", "🚀", "🦊", "🎲",
  "🌵", "🍩", "🐢", "🎈", "🦋", "🍔", "🐳", "⚡", "🍒", "🎧"
];

function formatCurrentTime(date: Date) {
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" });
  return `${day}, ${time}`;
}

function VenueLogo() {
  return (
    <div className="relative aspect-square h-[clamp(60px,10.25dvh,82px)] overflow-hidden rounded-full border-[4px] border-[#0884fe] bg-[#1f2a36] [@media(max-height:520px)]:h-[48px]">
      <Image src="/red-lion-logo.jpg" alt="The Red Lion" fill sizes="82px" priority className="object-cover" />
    </div>
  );
}

function pickTwo() {
  const first = Math.floor(Math.random() * EMOJIS.length);
  const second = (first + 1 + Math.floor(Math.random() * (EMOJIS.length - 1))) % EMOJIS.length;
  return [EMOJIS[first], EMOJIS[second]];
}

function EmojiStrip() {
  const [emojis, setEmojis] = useState<string[]>([]);

  useEffect(() => setEmojis(pickTwo()), []);

  return (
    <div
      className="relative h-[clamp(60px,9.9dvh,79px)] w-[182px] shrink-0 overflow-hidden rounded-[12px] bg-[#0b2c4d] [@media(max-height:520px)]:h-[48px]"
      aria-hidden="true"
    >
      <div className="flex h-full items-center justify-around px-[14px]">
        {emojis.map((emoji) => (
          <span key={emoji} className="text-[clamp(30px,4.75dvh,38px)] leading-none">
            {emoji}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 animate-sweep">
        <span className="absolute inset-y-0 right-0 w-[3px] bg-[#1d4a80]" />
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 24 21" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M10.3 2.2a2 2 0 0 1 3.4 0l8.5 14.6a2 2 0 0 1-1.7 3H3.5a2 2 0 0 1-1.7-3l8.5-14.6Z" strokeLinejoin="round" />
      <path d="M12 8v5" strokeLinecap="round" />
      <circle cx="12" cy="16.4" r="0.6" fill="currentColor" />
    </svg>
  );
}

export default function StaffPage() {
  const now = useNow();
  const router = useRouter();
  const startRedeem = useStartRedeem();

  useEffect(() => router.prefetch("/pass/none"), [router]);

  return (
    <section className={`${lato.className} fixed inset-0 z-50 flex flex-col items-center overflow-hidden bg-[#101a24] text-white`}>
      <div className="min-h-[8px] flex-[60]" />

      <div className="flex w-[min(306px,calc(100%-40px))] shrink-0 flex-col items-center rounded-[15px] bg-[#0c3b69] pb-[clamp(16px,3dvh,24px)] pt-[clamp(14px,2.75dvh,22px)]">
        <VenueLogo />

        <div className="mt-[clamp(10px,1.75dvh,14px)] aspect-square h-[clamp(120px,20.6dvh,165px)] [@media(max-height:520px)]:h-[104px] rounded-[15px] bg-white p-[clamp(10px,1.75dvh,14px)]">
          <QrCode />
        </div>

        <p className="mt-[clamp(10px,1.8dvh,16px)] text-[11px] leading-[14px] text-[#a5b4c6]">Current time</p>
        <p className="mt-[3px] h-[18px] text-[14.5px] leading-[18px] tabular-nums">{now ? formatCurrentTime(now) : ""}</p>
      </div>

      <div className="min-h-[8px] flex-[59]" />

      <EmojiStrip />

      <div className="min-h-[8px] flex-[61]" />

      <div className="flex w-full shrink-0 flex-col items-center px-[clamp(20px,9.2vw,36px)]">
        <p className="flex items-center gap-[8px] text-[14.5px] font-bold text-[#f3c235]">
          <WarningIcon />
          This action cannot be undone
        </p>

        <button
          type="button"
          onClick={startRedeem}
          className="mt-[clamp(10px,1.8dvh,15px)] flex h-[clamp(46px,6.5dvh,52px)] [@media(max-height:520px)]:h-[42px] w-full items-center justify-center rounded-[15px] bg-[#0682fe] text-[16px] font-bold text-white"
        >
          Redeem
        </button>

        <Link href="/pass" className="mt-[clamp(12px,2.3dvh,20px)] px-6 [@media(max-height:520px)]:mt-[4px] py-[6px] text-[15.5px] text-white/90">
          Cancel
        </Link>
      </div>

      <div className="h-[clamp(16px,6.1dvh,49px)] shrink-0 [@media(max-height:520px)]:h-[8px]" />
    </section>
  );
}
