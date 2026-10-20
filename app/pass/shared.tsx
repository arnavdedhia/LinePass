"use client";

import { Lato } from "next/font/google";
import { useEffect, useState } from "react";

export const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });

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
