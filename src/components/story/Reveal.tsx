"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — lässt Inhalt sanft einblenden, sobald er in den Blick scrollt.
 * Template-Baustein: einfach beliebigen Inhalt hineinlegen.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
