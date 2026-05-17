"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import BackgroundSync from "@/components/effects/BackgroundSync";
import CursorGlow from "@/components/effects/CursorGlow";
import CursorTrail from "@/components/effects/CursorTrail";
import ScrollVelocity from "@/components/effects/ScrollVelocity";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <LocaleProvider>
      {children}
      <BackgroundSync />
      <ScrollVelocity />
      <CursorGlow />
      <CursorTrail />
    </LocaleProvider>
  );
}
