// Loading state shared across the locale tree. Matches the spec's
// presence-dot vocabulary — a held breath, not a spinner.
export default function Loading() {
  return (
    <section className="flex justify-center pt-16">
      <span className="presence-dot" aria-label="loading" />
    </section>
  );
}
