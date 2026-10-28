"use client";

import Image from "next/image";
import Link from "next/link";
import { BottomNav, lato, passesBackground, useNow, useProfileName } from "../shared";
import { type Venue, venues } from "../venues";

function greeting(date: Date) {
  const hour = date.getHours();
  if (hour < 4) return "Late night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function VenueCard({ slug, name, address, image, hours }: Venue) {
  return (
    <Link
      href={`/pass/venues/${slug}`}
      className="flex h-[clamp(84px,12.8dvh,102px)] [@media(max-height:520px)]:h-[72px] shrink-0 items-center gap-[clamp(12px,4.1vw,16px)] rounded-[9px] border border-white/[0.28] bg-white/[0.1] p-[2px]"
    >
      <div className="relative aspect-square h-full overflow-hidden rounded-[7px]">
        <Image src={image} alt={`${name} logo`} fill sizes="102px" className="object-cover" priority />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[clamp(17px,4.8vw,19px)] font-bold leading-[1.2] text-white">{name}</h3>
        <p className="mt-[3px] truncate text-[clamp(12.5px,3.5vw,13.5px)] leading-[1.25] text-[#b9c3cd]">{address}</p>
        <p className="mt-[5px] flex items-center gap-[5px] text-[12px] font-bold leading-[14px] text-[#5fd38d] [@media(max-height:520px)]:hidden">
          <span className="h-[6px] w-[6px] rounded-full bg-[#5fd38d]" />
          {hours}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const now = useNow();
  const name = useProfileName();
  const firstName = name?.trim().split(/\s+/)[0];

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={passesBackground}
    >
      <header className="mt-[clamp(12px,2.6dvh,22px)] shrink-0 px-[15px]">
        <p className="flex items-center gap-[5px] text-[13px] leading-[16px] text-[#c9d1db]">
          <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" aria-hidden="true">
            <path d="M5.5 0A5.5 5.5 0 0 0 0 5.5C0 9.6 5.5 14 5.5 14S11 9.6 11 5.5A5.5 5.5 0 0 0 5.5 0Zm0 7.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z" />
          </svg>
          Champaign, IL
        </p>
        <h1 className="mt-[4px] text-[clamp(22px,6.4vw,26px)] font-bold leading-[1.15] tracking-[-0.2px]">
          {now ? `${greeting(now)}${firstName ? `, ${firstName}` : ""}` : "\u00a0"}
        </h1>
      </header>

      <h2 className="mt-[clamp(18px,3.5dvh,30px)] shrink-0 px-[15px] text-[clamp(21px,6vw,24px)] font-bold leading-[1.2]">Venues</h2>

      <div className="mt-[clamp(8px,1.6dvh,14px)] flex shrink-0 flex-col gap-[clamp(8px,1.5dvh,12px)] px-[15px]">
        {venues.map((venue) => (
          <VenueCard key={venue.slug} {...venue} />
        ))}
      </div>

      <div className="flex-1" />

      <BottomNav active="venues" />
    </section>
  );
}
