import { notFound } from "next/navigation";
import { getVenue, venues } from "../../venues";
import BuyPass from "./BuyPass";

export const dynamicParams = false;

export function generateStaticParams() {
  return venues.map((venue) => ({ slug: venue.slug }));
}

export default function BuyPassPage({ params }: { params: { slug: string } }) {
  const venue = getVenue(params.slug);
  if (!venue) notFound();
  return <BuyPass slug={venue.slug} />;
}
