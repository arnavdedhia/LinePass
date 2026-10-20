export type Venue = {
  slug: string;
  name: string;
  address: string;
  image: string;
  logo: string;
  hours: string;
  coverPrice: number;
  glow: string;
};

export const venues: Venue[] = [
  {
    slug: "kams",
    name: "KAMS",
    address: "102 E Green St, Champaign",
    image: "/kams-venue.jpg",
    logo: "/kams-venue.jpg",
    hours: "Open until 2:00 AM",
    coverPrice: 10,
    glow: "rgba(226, 104, 34, 0.32)"
  },
  {
    slug: "red-lion",
    name: "Red Lion",
    address: "211 E Green St, Champaign",
    image: "/red-lion-venue.jpg",
    logo: "/red-lion-logo.jpg",
    hours: "Open until 2:00 AM",
    coverPrice: 10,
    glow: "rgba(150, 40, 80, 0.3)"
  }
];

export const DEFAULT_VENUE_SLUG = "red-lion";

export function getVenue(slug: string) {
  return venues.find((venue) => venue.slug === slug);
}

export const PASS_ROUTES = ["/pass", "/pass/staff", "/pass/none", "/pass/home", ...venues.map((venue) => `/pass/venues/${venue.slug}`)];
