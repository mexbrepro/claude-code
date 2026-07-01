"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ReadingProgress — dünner Fortschrittsbalken am oberen Rand, der zeigt,
 * wie weit man in der Geschichte gescrollt ist.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
    />
  );
}
