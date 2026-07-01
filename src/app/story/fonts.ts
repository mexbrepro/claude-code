import { Fraunces, Source_Serif_4, Inter } from "next/font/google";

// Düster-dramatisch: hohe Kontraste, editoriale Serife mit Charakter.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Clean & editorial: ruhige Zeitungs-Serife.
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

// Sans für UI-Chrome, Labels, Fließtext in beiden Varianten.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
