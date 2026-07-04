"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * Hero — kinoreifer Vollbild-Einstieg mit sanftem Parallax und Scroll-Hinweis.
 * `image` ist optional: fehlt es (oder lädt es nicht), bleibt ein
 * stimmungsvoller Farbverlauf als Fallback stehen.
 */
export function Hero({
  title,
  subtitle,
  image,
  footerNote,
}: {
  title: string;
  subtitle: string;
  image?: string;
  footerNote?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Hintergrund: Bild (falls vorhanden) + immer ein Farbverlauf darunter */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black" />
      {image && (
        <motion.div style={{ y }} className="absolute inset-0 opacity-50">
          {/* Inline-Style, damit beliebige Bild-URLs / Drive-Links funktionieren. */}
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl font-bold tracking-tight text-white sm:text-8xl md:text-9xl"
          style={{ fontFamily: "var(--font-cabin)" }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Scroll-Hinweis */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        {footerNote && (
          <p className="mb-4 text-center text-[11px] uppercase tracking-[0.25em] text-white/40">
            {footerNote}
          </p>
        )}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-10 w-6 rounded-full border border-white/30"
        >
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
