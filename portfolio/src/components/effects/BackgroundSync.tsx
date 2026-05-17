"use client";

import { useEffect } from "react";

export default function BackgroundSync() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-accent]")
    );

    if (!sections.length) {
      return;
    }

    const updateAccent = (value?: string) => {
      if (!value) return;
      root.style.setProperty("--accent-current", value);

      const hex = value.replace("#", "").trim();
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        root.style.setProperty("--accent-glow", `rgba(${r}, ${g}, ${b}, 0.22)`);
      }
    };

    updateAccent(sections[0].dataset.accent);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const accent = (entry.target as HTMLElement).dataset.accent;
            updateAccent(accent);
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: "-20% 0px -45% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
