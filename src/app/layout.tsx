import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynamic Companion",
  description: "An instrument for hearing yourself.",
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  width: "device-width",
  initialScale: 1,
};

// Locale-aware <html lang> is set inside the [locale] segment. Here we
// fall through cleanly so the segment can take over.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
