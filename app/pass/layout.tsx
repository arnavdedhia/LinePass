import { RedeemProvider } from "./RedeemTransition";
import { VenueProvider } from "./VenueContext";

export default function PassLayout({ children }: { children: React.ReactNode }) {
  return (
    <VenueProvider>
      <RedeemProvider>{children}</RedeemProvider>
    </VenueProvider>
  );
}
