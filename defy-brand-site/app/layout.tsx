import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://defyandbrandevents.be"),
  title: { default: "Defy & Brand Events", template: "%s — Defy & Brand Events" },
  applicationName: "Defy & Brand Events",
  robots: { index: true, follow: true },
  icons: { icon: "/assets/mark-fluo.svg" },
};

export const viewport: Viewport = { themeColor: "#23262b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // <html lang> is set per-locale in app/[lang]/layout.tsx via the LangAttr client component.
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
