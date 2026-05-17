"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3" });

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", handleLeave);

    return () => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  const baseClass = `group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 ${className}`;

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        className={baseClass}
        data-sound="hover"
        href={href}
        target={target}
        rel={rel}
      >
        <span className="relative z-10">{children}</span>
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent-current)]/30 via-white/0 to-[color:var(--accent-current)]/20" />
        </span>
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      className={baseClass}
      data-sound="hover"
      type="button"
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent-current)]/30 via-white/0 to-[color:var(--accent-current)]/20" />
      </span>
    </button>
  );
}
