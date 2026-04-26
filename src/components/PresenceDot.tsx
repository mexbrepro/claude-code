// The visual equivalent of a held breath. Heart of the silence rule.
export function PresenceDot({ active }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={
        active
          ? "presence-dot"
          : "inline-block h-2 w-2 rounded-full bg-ground-300"
      }
    />
  );
}
