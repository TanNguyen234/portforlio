import { TechIcon } from "@/components/icons/TechIcon";

export default function GlassBadge({
  label,
  className = "",
  showIcon = true,
}: {
  label: string;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-current)]/25 bg-[color:var(--accent-current)]/10 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-white/85 ${className}`}
    >
      {showIcon && <TechIcon name={label} className="h-3 w-3 text-teal-300 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

