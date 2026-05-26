"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import ElasticPageWarp from "@/components/effects/ElasticPageWarp";
import { playHoverSound, playClickSound } from "@/lib/audio";

gsap.registerPlugin(ScrollTrigger);

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

  // Initialize Lenis smooth scroll and link it to GSAP ScrollTrigger
  useEffect(() => {
    if (booting) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [booting]);

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
          <ElasticPageWarp />
        </>
      )}
    </LocaleProvider>
  );
}
