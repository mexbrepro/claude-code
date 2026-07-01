import type { Metadata, Viewport } from "next";
import "../globals.css";
import { story } from "./story.config";

export const metadata: Metadata = {
  title: `${story.meta.title} — ${story.meta.footerNote}`,
  description: story.meta.subtitle,
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

/**
 * Eigenständiges Layout für den immersiven Story-Bereich. Das Root-Layout
 * rendert bewusst nur ein Fragment, daher liefern wir hier <html>/<body>
 * selbst — mit dunklem, kinoreifem Theme, unabhängig von der Companion-App.
 */
export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" style={{ colorScheme: "dark" }}>
      <body className="min-h-screen bg-black text-white antialiased [text-rendering:optimizeLegibility]">
        {children}
      </body>
    </html>
  );
}
