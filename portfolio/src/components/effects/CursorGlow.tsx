"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePerformanceMode } from "@/lib/performance";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) {
      return;
    }

    const element = glowRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3" });

    const handleMove = (event: MouseEvent) => {
      xTo(event.clientX - window.innerWidth / 2);
      yTo(event.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-1/2 top-1/2 z-30 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(124,244,255,0.18),_transparent_60%)] blur-3xl"
      aria-hidden="true"
    />
  );
}
