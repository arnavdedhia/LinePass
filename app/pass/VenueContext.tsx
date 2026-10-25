"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_VENUE_SLUG, getVenue, PASS_ROUTES, type Venue } from "./venues";

const VENUE_KEY = "linepass:venue";
const COVER_KEY = "linepass:cover";

type VenueContextValue = {
  venue: Venue;
  coverTitle: string | null;
  selectCover: (slug: string, title: string) => void;
  signedIn: boolean;
  markSignedIn: () => void;
};

const VenueContext = createContext<VenueContextValue | null>(null);

export function VenueProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [slug, setSlug] = useState(DEFAULT_VENUE_SLUG);
  const [coverTitle, setCoverTitle] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const savedVenue = sessionStorage.getItem(VENUE_KEY);
    if (savedVenue && getVenue(savedVenue)) setSlug(savedVenue);
    setCoverTitle(sessionStorage.getItem(COVER_KEY));
    setSignedIn(document.cookie.split("; ").includes("linepass_signed_in=1"));
    PASS_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  const selectCover = useCallback((nextSlug: string, title: string) => {
    setSlug(nextSlug);
    setCoverTitle(title);
    sessionStorage.setItem(VENUE_KEY, nextSlug);
    sessionStorage.setItem(COVER_KEY, title);
  }, []);

  const markSignedIn = useCallback(() => setSignedIn(true), []);

  const venue = getVenue(slug) ?? getVenue(DEFAULT_VENUE_SLUG)!;

  return (
    <VenueContext.Provider value={{ venue, coverTitle, selectCover, signedIn, markSignedIn }}>{children}</VenueContext.Provider>
  );
}

export function useSelectedVenue() {
  const value = useContext(VenueContext);
  if (!value) throw new Error("useSelectedVenue must be used inside VenueProvider");
  return value;
}
