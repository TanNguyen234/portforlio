"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BackgroundSync() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-accent]")
    );

    if (!sections.length) return;

    const parseHex = (hexStr: string) => {
      const hex = hexStr.replace("#", "").trim();
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return { r, g, b };
      }
      return { r: 0, g: 240, b: 255 }; // fallback cyan
    };

    const initialAccent = sections[0].dataset.accent || "#00f0ff";
    const initialRGB = parseHex(initialAccent);

    const activeColors = {
      hex: initialAccent,
      r: initialRGB.r,
      g: initialRGB.g,
      b: initialRGB.b,
    };

    const updateAccent = (colorObj: typeof activeColors) => {
      root.style.setProperty("--accent-current", colorObj.hex);
      root.style.setProperty(
        "--accent-glow",
        `rgba(${Math.round(colorObj.r)}, ${Math.round(colorObj.g)}, ${Math.round(colorObj.b)}, 0.22)`
      );
    };

    // Apply initial colors
    updateAccent(activeColors);

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const accent = section.dataset.accent;
      if (!accent) return;

      const targetColor = parseHex(accent);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            // Tween RGB values smoothly
            gsap.to(activeColors, {
              r: targetColor.r,
              g: targetColor.g,
              b: targetColor.b,
              duration: 0.8,
              ease: "power2.out",
              onUpdate: () => {
                const hexR = Math.round(activeColors.r).toString(16).padStart(2, "0");
                const hexG = Math.round(activeColors.g).toString(16).padStart(2, "0");
                const hexB = Math.round(activeColors.b).toString(16).padStart(2, "0");
                activeColors.hex = `#${hexR}${hexG}${hexB}`;
                updateAccent(activeColors);
              },
            });
          }
        },
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return null;
}
