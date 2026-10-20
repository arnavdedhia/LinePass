import { RedeemProvider } from "./RedeemTransition";

export default function PassLayout({ children }: { children: React.ReactNode }) {
  return <RedeemProvider>{children}</RedeemProvider>;
}
