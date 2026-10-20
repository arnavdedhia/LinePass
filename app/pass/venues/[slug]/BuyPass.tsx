"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav, barDayDate, coverTitle, lato, useNow } from "../../shared";
import { useSelectedVenue } from "../../VenueContext";
import { getVenue } from "../../venues";

export default function BuyPass({ slug }: { slug: string }) {
  const venue = getVenue(slug)!;
  const now = useNow();
  const router = useRouter();
  const { selectVenue } = useSelectedVenue();

  const buyCover = () => {
    selectVenue(venue.slug);
    router.push("/pass");
  };

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#14273f] text-white`}
      style={{
        backgroundImage: `radial-gradient(75% 38% at 55% 58%, ${venue.glow} 0%, rgba(20, 39, 63, 0) 100%), radial-gradient(120% 40% at 100% 0%, rgba(10, 70, 140, 0.85) 0%, rgba(14, 50, 95, 0.55) 40%, rgba(20, 39, 63, 0) 80%)`
      }}
    >
      <header className="relative shrink-0 pt-[clamp(6px,1.1dvh,9px)]">
        <Link
          href="/pass/home"
          aria-label="Back to venues"
          className="absolute left-[12px] top-[clamp(4px,0.9dvh,8px)] flex h-[36px] w-[36px] items-center justify-center"
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2 2 9l7 7" />
          </svg>
        </Link>
        <button
          type="button"
          aria-label="Share venue"
          className="absolute right-[12px] top-[clamp(4px,0.9dvh,8px)] flex h-[36px] w-[36px] items-center justify-center"
        >
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 13V1.5M4.5 5.5 9 1l4.5 4.5" />
            <path d="M6 9H2.5A1.5 1.5 0 0 0 1 10.5v9A1.5 1.5 0 0 0 2.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 15.5 9H12" />
          </svg>
        </button>

        <div className="relative mx-auto aspect-square h-[clamp(84px,14.1dvh,113px)] overflow-hidden rounded-[8px] shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
          <Image src={venue.image} alt={`${venue.name} logo`} fill sizes="113px" className="object-cover" priority />
        </div>

        <h1 className="mt-[clamp(10px,2.3dvh,19px)] text-center text-[clamp(21px,6vw,23px)] font-bold leading-[28px]">{venue.name}</h1>
        <p className="mt-[clamp(2px,0.6dvh,5px)] flex items-center justify-center gap-[7px] text-[clamp(13px,3.6vw,14px)] leading-[17px] text-[#b9c3cd]">
          <svg width="11" height="14" viewBox="0 0 11 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M5.5.7A4.8 4.8 0 0 0 .7 5.5c0 3.6 4.8 7.6 4.8 7.6s4.8-4 4.8-7.6A4.8 4.8 0 0 0 5.5.7Z" />
            <circle cx="5.5" cy="5.5" r="1.7" />
          </svg>
          {venue.address}
        </p>
      </header>

      <h2 className="mt-[clamp(18px,4.5dvh,36px)] shrink-0 px-[15px] text-[clamp(18px,5vw,19.5px)] font-bold leading-[24px]">
        {now ? `Today, ${barDayDate(now)}` : "\u00a0"}
      </h2>

      <div className="mt-[clamp(8px,1.6dvh,13px)] shrink-0 px-[15px]">
        <button
          type="button"
          onClick={buyCover}
          className="flex h-[clamp(58px,8.3dvh,66px)] w-full flex-col justify-center rounded-[8px] border border-white/[0.3] bg-white/[0.13] px-[11px] text-left"
        >
          <span className="text-[16px] font-bold leading-[20px] text-white">{now ? coverTitle(now) : "\u00a0"}</span>
          <span className="mt-[4px] text-[14px] leading-[17px] text-[#e3e7eb]">${venue.coverPrice}</span>
        </button>
      </div>

      <div className="flex-1" />

      <BottomNav active="venues" />
    </section>
  );
}
