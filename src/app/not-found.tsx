import Link from "next/link";

// Spec §10: nothing snaps, nothing pops. The 404 is a quiet door back.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ground-50 text-ink antialiased">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">404</p>
          <h1 className="user-words text-2xl text-ink">Nothing here.</h1>
          <Link href="/" className="text-ink hover:text-signal">
            ←
          </Link>
        </main>
      </body>
    </html>
  );
}
