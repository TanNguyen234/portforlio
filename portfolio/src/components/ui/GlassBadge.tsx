export default function GlassBadge({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full border border-[color:var(--accent-current)]/25 bg-[color:var(--accent-current)]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/85 ${className}`}
    >
      {label}
    </span>
  );
}
