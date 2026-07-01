"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * StatCounter — zählt eine Zahl hoch, sobald sie sichtbar wird.
 * Verwendet für eindrückliche Kennzahlen (Verkehrstote, Meter, Prozent …).
 */
export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted = Number.isInteger(value)
    ? Math.round(display).toLocaleString("de-DE")
    : display.toFixed(1);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-5xl font-semibold tabular-nums text-white sm:text-6xl md:text-7xl">
        {formatted}
        <span className="text-amber-400">{suffix}</span>
      </div>
      <p className="mx-auto mt-3 max-w-[22ch] text-sm leading-snug text-white/60">
        {label}
      </p>
    </div>
  );
}
