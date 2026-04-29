"use client";

import { useEffect } from "react";

// The error boundary is also quiet. We log the digest so the user can
// reference it if they reach out, but we don't dramatize.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[locale] error", error);
  }, [error]);

  return (
    <section className="flex flex-col gap-4 pt-12">
      <p className="user-words text-[15px] text-ink">Something interrupted.</p>
      <div>
        <button
          onClick={reset}
          className="rounded-md bg-ground-700 px-4 py-2 text-sm text-ground-50"
        >
          Try again
        </button>
      </div>
      {error.digest && (
        <p className="text-xs text-ink-muted">{error.digest}</p>
      )}
    </section>
  );
}
