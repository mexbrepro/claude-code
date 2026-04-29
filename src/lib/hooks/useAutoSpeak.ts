"use client";

import { useEffect, useState } from "react";

// Cached for the lifetime of the page so each component doesn't refetch.
let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

async function fetchPref(): Promise<boolean> {
  if (cached !== null) return cached;
  if (inflight) return inflight;
  inflight = fetch("/api/settings")
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { autoSpeak?: boolean } | null) => {
      const v = !!d?.autoSpeak;
      cached = v;
      return v;
    })
    .catch(() => false);
  return inflight;
}

export function useAutoSpeak(): boolean {
  const [auto, setAuto] = useState(cached ?? false);
  useEffect(() => {
    let alive = true;
    void fetchPref().then((v) => {
      if (alive) setAuto(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return auto;
}
