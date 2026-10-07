import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinePass",
  description: "A daily guest pass for participating venues."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link className="text-xl font-bold text-ink" href="/pass">LinePass</Link>
            <Link className="text-sm font-medium text-slate-600 hover:text-ink" href="/login">Log in</Link>
          </nav>
        </header>
        <main className="mx-auto min-h-[calc(100vh-73px)] max-w-3xl px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
