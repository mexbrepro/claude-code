import { Cabin, Lora } from "next/font/google";

// Überschriften, Labels, UI-Chrome: kräftige, serifenlose Grotesk.
export const cabin = Cabin({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cabin",
  display: "swap",
});

// Lesetext: ruhige Serife für Fließtext und Zitate.
export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});
