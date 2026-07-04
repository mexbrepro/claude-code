"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Step = { label: string; big: string; body: string };

/**
 * StickyScrolly — klassisches Scrollytelling-Template:
 * Links bleibt eine große Grafik stehen (sticky), rechts scrollen die
 * Schritte durch. Der aktive Schritt steuert, was links angezeigt wird.
 */
export function StickyScrolly({
  heading,
  steps,
}: {
  heading?: string;
  steps: Step[];
}) {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      {heading && (
        <h3 className="mb-8 text-center text-sm uppercase tracking-[0.3em] text-white/40">
          {heading}
        </h3>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sticky-Grafik */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <div
                    className="text-xs uppercase tracking-widest text-amber-400"
                    style={{ fontFamily: "var(--font-cabin)" }}
                  >
                    {steps[active]?.label}
                  </div>
                  <div
                    className="mt-2 text-7xl font-bold tabular-nums text-white"
                    style={{ fontFamily: "var(--font-cabin)" }}
                  >
                    {steps[active]?.big}
                  </div>
                </motion.div>
              </div>
              {/* Fortschritts-Ring */}
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  stroke="rgb(251 191 36)"
                  strokeWidth="0.5"
                  strokeDasharray={`${((active + 1) / steps.length) * 308} 308`}
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll-Schritte */}
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <ScrollyStep
              key={i}
              step={step}
              index={i}
              activeIndex={active}
              onEnter={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollyStep({
  step,
  index,
  activeIndex,
  onEnter,
}: {
  step: Step;
  index: number;
  activeIndex: number;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView && activeIndex !== index) onEnter();
  }, [inView, activeIndex, index, onEnter]);

  return (
    <div
      ref={ref}
      className="flex min-h-[70vh] flex-col justify-center py-10"
    >
      {/* Mobile: Kennzahl direkt anzeigen (keine Sticky-Grafik) */}
      <div className="lg:hidden">
        <div
          className="text-xs uppercase tracking-widest text-amber-400"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {step.label}
        </div>
        <div
          className="text-6xl font-bold tabular-nums text-white"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {step.big}
        </div>
      </div>
      <p
        className={cn(
          "mt-4 max-w-md text-lg leading-relaxed transition-colors duration-500 lg:text-xl",
          inView ? "text-white" : "text-white/40",
        )}
      >
        {step.body}
      </p>
    </div>
  );
}
