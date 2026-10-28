"use client";

import { BottomNav, lato, passesBackground, profileFromName, useProfileName } from "../shared";

const card = "rounded-[9px] border border-white/[0.22] bg-white/[0.1]";
const row = "flex min-h-[52px] items-center gap-[12px] px-[14px]";

function Chevron() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-white/70">
      <path d="m1.5 1.5 6 6.5-6 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AccountPage() {
  const name = useProfileName();
  const profile = name ? profileFromName(name) : null;

  return (
    <section
      className={`${lato.className} fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0e263e] text-white`}
      style={passesBackground}
    >
      <h1 className="mt-[clamp(12px,2.6dvh,22px)] shrink-0 px-[16px] text-[clamp(26px,7vw,30px)] font-bold leading-[1.1] tracking-[-0.3px]">
        Account
      </h1>

      <div className="mt-[clamp(10px,1.8dvh,16px)] flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.4dvh,12px)] overflow-y-auto px-[15px] pb-[10px]">
        <div className={`${card} ${row} min-h-[clamp(64px,9dvh,72px)]`}>
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#3d4d5e] text-[15px] font-bold tracking-[0.4px]">
            {profile?.initials ?? "—"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-bold leading-[20px]">{profile?.name ?? "Not signed in"}</p>
            {profile && <p className="truncate text-[13.5px] leading-[18px] text-[#9aa8b6]">{profile.email}</p>}
          </div>
          <Chevron />
        </div>

        <div className={`${card} ${row} min-h-[clamp(56px,8dvh,64px)]`}>
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0 text-white">
            <path d="M2 9.2 12 3.5 22 9.2 12 14.8 2 9.2Z" strokeLinejoin="round" />
            <path d="M6.5 11.2v4.4c0 1.4 2.4 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.4" strokeLinecap="round" />
            <path d="M20.2 9.6v4.2" strokeLinecap="round" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-[15.5px] font-bold leading-[19px]">Student status</p>
            <p className="text-[12.5px] leading-[16px] text-[#9aa8b6]">Unlock student-only passes</p>
          </div>
          <span className="text-[15px] text-[#c5ced6]">Verify</span>
        </div>

        <div className={`${card} px-[14px] py-[12px]`}>
          <p className="text-[15.5px] font-bold leading-[20px]">Want $100?! Tell us where to Leap next!</p>
          <p className="mt-[4px] text-[13px] leading-[17px] text-[#c5ced6]">
            What bars get long lines that AREN&apos;T partnered with LinePass yet? Take the short survey for a chance at $100!
          </p>
          <button type="button" className="mt-[8px] text-left text-[14.5px] font-bold text-[#3d9bff]">
            Take me there!
          </button>
        </div>

        <button type="button" className={`${card} ${row} w-full text-left`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0">
            <circle cx="8.5" cy="7.5" r="3.1" />
            <path d="M2.8 19.2v-1A5.3 5.3 0 0 1 8.1 12.9h.8" strokeLinecap="round" />
            <circle cx="16.8" cy="13.2" r="4.2" />
            <path d="M16.8 11.2v4M14.8 13.2h4" strokeLinecap="round" />
          </svg>
          <span className="flex-1 text-[15.5px] font-bold">Share LinePass with friends</span>
          <svg width="16" height="18" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0 text-white/80">
            <path d="M8 13V2M3.5 6 8 1.5 12.5 6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 11v6.2A1.3 1.3 0 0 0 2.8 18.5h10.4a1.3 1.3 0 0 0 1.3-1.3V11" strokeLinecap="round" />
          </svg>
        </button>

        <div className={`${card} divide-y divide-white/[0.08]`}>
          <button type="button" className={`${row} w-full text-left`}>
            <svg width="18" height="16" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0">
              <rect x="1" y="3.5" width="20" height="13" rx="2" />
              <path d="M1 8h20" />
            </svg>
            <span className="flex-1">
              <span className="block text-[15.5px] font-bold leading-[19px]">LinePass Credit</span>
              <span className="block text-[12.5px] leading-[16px] text-[#9aa8b6]">$0.00</span>
            </span>
            <Chevron />
          </button>
          <button type="button" className={`${row} w-full text-left`}>
            <svg width="18" height="16" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0">
              <rect x="1" y="3.5" width="20" height="13" rx="2" />
              <path d="M1 8h20" />
            </svg>
            <span className="flex-1 text-[15.5px] font-bold">Payment Methods</span>
            <Chevron />
          </button>
          <button type="button" className={`${row} w-full text-left`}>
            <svg width="17" height="18" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0">
              <rect x="3" y="2" width="12" height="16" rx="1.5" />
              <path d="M6 6.5h6M6 10h6M6 13.5h4" strokeLinecap="round" />
            </svg>
            <span className="flex-1 text-[15.5px] font-bold">Order History</span>
            <Chevron />
          </button>
          <button type="button" className={`${row} w-full text-left`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0">
              <circle cx="10" cy="10" r="8" />
              <circle cx="10" cy="10" r="2.2" />
            </svg>
            <span className="flex-1 text-[15.5px] font-bold">Contact Support</span>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" className="shrink-0 text-white/75">
              <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v8A1.5 1.5 0 0 0 2.5 13h8a1.5 1.5 0 0 0 1.5-1.5V9" strokeLinecap="round" />
              <path d="M8 1h5v5M13 1 6.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="mt-auto py-[8px] text-center text-[12px] text-[#7d8b99]">Privacy · Terms</p>
      </div>

      <BottomNav active="account" />
    </section>
  );
}
