"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_VENUE_SLUG, getVenue, PASS_ROUTES, type Venue } from "./venues";

const STORAGE_KEY = "linepass:venue";

type VenueContextValue = { venue: Venue; selectVenue: (slug: string) => void };

const VenueContext = createContext<VenueContextValue | null>(null);

export function VenueProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [slug, setSlug] = useState(DEFAULT_VENUE_SLUG);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved && getVenue(saved)) setSlug(saved);
    PASS_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  const selectVenue = useCallback((next: string) => {
    setSlug(next);
    sessionStorage.setItem(STORAGE_KEY, next);
  }, []);

  const venue = getVenue(slug) ?? getVenue(DEFAULT_VENUE_SLUG)!;

  return <VenueContext.Provider value={{ venue, selectVenue }}>{children}</VenueContext.Provider>;
}

export function useSelectedVenue() {
  const value = useContext(VenueContext);
  if (!value) throw new Error("useSelectedVenue must be used inside VenueProvider");
  return value;
}
