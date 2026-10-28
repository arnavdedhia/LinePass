"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import styles from "./redeem.module.css";
import { lato } from "./shared";

const NO_PASS_PATH = "/pass/none";
const NAVIGATE_AT_MS = 1520;
const EXIT_AT_MS = 1860;

type Phase = "idle" | "playing" | "leaving";

const StartRedeemContext = createContext<() => void>(() => {});

export function useStartRedeem() {
  return useContext(StartRedeemContext);
}

function RedeemOverlay({ leaving, onDone }: { leaving: boolean; onDone: () => void }) {
  return (
    <div
      className={`${lato.className} ${styles.sheet} ${leaving ? styles.leaving : ""}`}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget && event.animationName.includes("sheetOut")) onDone();
      }}
      aria-live="polite"
    >
      <span className="sr-only">Pass redeemed</span>
      <div className={styles.stage} aria-hidden="true">
        <svg className={styles.mark} viewBox="0 0 200 200">
          <g className={styles.ringMove}>
            <g transform="translate(100 100) scale(-1 1) rotate(-90)">
              <circle className={styles.ring} r="91.5" pathLength="100" />
            </g>
          </g>
          <g className={styles.checkMove}>
            <path className={styles.check} d="M64 104 87 132 136 75" pathLength="100" />
          </g>
        </svg>

        <svg className={styles.logo} viewBox="0 0 324 334">
          <polygon className={styles.l1} points="75,70 150,70 124,233 198,233 187,310 25,310" />
          <polygon className={styles.l2} points="178,28 258,28 230,200 300,200 288,268 205,268 211,228 138,228" />
        </svg>

        <p className={styles.tagline}>Fun, Faster.</p>
      </div>
    </div>
  );
}

export function RedeemProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [readyToExit, setReadyToExit] = useState(false);

  const start = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("playing");
    setReadyToExit(false);
    setTimeout(() => router.replace(NO_PASS_PATH), NAVIGATE_AT_MS);
    setTimeout(() => setReadyToExit(true), EXIT_AT_MS);
  }, [phase, router]);

  useEffect(() => {
    if (phase === "playing" && readyToExit && pathname === NO_PASS_PATH) setPhase("leaving");
  }, [phase, readyToExit, pathname]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("idle"), 240);
    return () => window.clearTimeout(id);
  }, [phase]);

  return (
    <StartRedeemContext.Provider value={start}>
      {children}
      {phase !== "idle" && <RedeemOverlay leaving={phase === "leaving"} onDone={() => setPhase("idle")} />}
    </StartRedeemContext.Provider>
  );
}
