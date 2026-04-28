"use client";

import { useEffect } from "react";

// Client-side ping that records the card read. Kept tiny so the
// library/[slug] page stays static-renderable.
export function CardReadTracker({ cardId }: { cardId: string }) {
  useEffect(() => {
    void fetch("/api/cards/read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cardId, context: "library_open" }),
    }).catch(() => {
      /* silent */
    });
  }, [cardId]);
  return null;
}
