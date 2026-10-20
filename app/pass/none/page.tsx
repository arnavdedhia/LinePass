"use client";

import { BottomNav, lato, passesBackground } from "../shared";

const TICKET_PATH =
  "M6 0H66A6 6 0 0 1 72 6V19A7 7 0 0 0 72 33V46A6 6 0 0 1 66 52H6A6 6 0 0 1 0 46V33A7 7 0 0 0 0 19V6A6 6 0 0 1 6 0Z";

const tickets = [
  {
    from: "#2a9cff",
    to: "#0a6be3",
    icon: (
      <>
        <ellipse cx="10" cy="19" rx="6" ry="2.2" />
        <path d="M10 18.5C6.5 18 5 13.5 8.5 13c3-.4 2.8 3.6.6 3.2C11.5 12.5 15 8.5 19 5" />
        <path d="M14.5 5H19v4.5" />
      </>
    )
  },
  {
    from: "#f1c541",
    to: "#cf9a1e",
    icon: (
      <>
        <path d="M4 5h6v15H4z" />
        <path d="M10 5l3 2v11l-3 2" />
        <path d="M20 8.6c-.5-1-1.4-1.6-2.6-1.6-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.6.8 2.6 2.1-1.1 2-2.6 2c-1.3 0-2.3-.6-2.7-1.6M17.4 5.5v13" />
      </>
    )
  },
  {
    from: "#e77fd3",
    to: "#c04dab",
    icon: (
      <>
        <path d="M5 8h10v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
        <path d="M15 10.5h1.5a3 3 0 0 1 0 6H15" />
        <path d="M5 8a2.5 2.5 0 0 1 3-3.2 3 3 0 0 1 5.2.2A2.5 2.5 0 0 1 15 8" />
      </>
    )
  },
  {
    from: "#ff8a6b",
    to: "#e5553f",
    icon: (
      <>
        <path d="M4 20 8.5 9 15 15.5Z" />
        <path d="M12 9.5c.8-2.2 3-2.4 3.2-4.6M15 12.5c2-.6 3.6.6 5.4-.4" />
        <circle cx="18" cy="4.5" r=".9" fill="white" />
        <circle cx="20.5" cy="8" r=".9" fill="white" />
        <circle cx="12.5" cy="4.5" r=".9" fill="white" />
      </>
    )
  }
];

function TicketStack() {
  return (
    <div className="relative h-[64px] w-[222px]" aria-hidden="true">
      {tickets.map(({ from, to, icon }, index) => (
        <svg
          key={from}
          className="absolute top-[6px] h-[52px] w-[72px] -rotate-[9deg] drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
          style={{ left: index * 50 }}
          viewBox="0 0 72 52"
        >
          <defs>
            <linearGradient id={`ticket-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          <path d={TICKET_PATH} fill={`url(#ticket-${index})`} />
          <g
            transform="translate(36 26) scale(1.35) translate(-12 -12.5)"
            fill="none"
            stroke="white"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </g>
        </svg>
      ))}
    </div>
  );
}

export default function NoPassPage() {
  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={passesBackground}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        <TicketStack />

        <h1 className="mt-[clamp(18px,3.2dvh,26px)] whitespace-nowrap text-[clamp(22px,6.9vw,27px)] font-bold leading-[30px]">
          You have no passes... yet!
        </h1>

        <button
          type="button"
          className="mt-[clamp(24px,4.5dvh,36px)] flex h-[70px] w-[208px] flex-col items-center justify-center rounded-[7px] bg-[#0682fe] text-white"
        >
          <span className="text-[18.5px] font-bold leading-[22px]">Buy Another Pass</span>
          <span className="mt-[2px] text-[12px] leading-[15px]">Get to the fun, faster.</span>
        </button>
      </div>

      <BottomNav />
    </section>
  );
}
