"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import BackgroundSync from "@/components/effects/BackgroundSync";
import CursorGlow from "@/components/effects/CursorGlow";
import CursorTrail from "@/components/effects/CursorTrail";
import ScrollVelocity from "@/components/effects/ScrollVelocity";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import BootScreen from "@/components/effects/BootScreen";
import HudOverlay from "@/components/effects/HudOverlay";
import NeuralNet from "@/components/effects/NeuralNet";
import HackingTerminal from "@/components/effects/HackingTerminal";
import CircuitBoard from "@/components/effects/CircuitBoard";
import PhysicsDecals from "@/components/effects/PhysicsDecals";
import CyberWidgets from "@/components/effects/CyberWidgets";
import { playHoverSound, playClickSound } from "@/lib/audio";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setBooting(false);
    }
  }, []);

  // Global hover and click audio listener hookups
  useEffect(() => {
    if (booting) return;

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const closestInteractive = target.closest("a, button, [data-sound='hover'], .cyber-card-wrapper");
      if (closestInteractive) {
        playHoverSound();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const closestInteractive = target.closest("a, button, [data-sound='hover'], .cyber-card-wrapper");
      if (closestInteractive) {
        playClickSound();
      }
    };

    document.addEventListener("mouseover", handleHover);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("click", handleClick);
    };
  }, [booting]);

  return (
    <LocaleProvider>
      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <>
          {children}
          <BackgroundSync />
          <ScrollVelocity />
          <CursorGlow />
          <CursorTrail />
          <HudOverlay />
          <NeuralNet />
          <HackingTerminal />
          <CircuitBoard />
          <PhysicsDecals />
          <CyberWidgets />
        </>
      )}
    </LocaleProvider>
  );
}
