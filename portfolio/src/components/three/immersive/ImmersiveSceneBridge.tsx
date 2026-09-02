"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  sceneState,
  updatePointerTarget,
  type SectionKey,
} from "./sceneState";

const SECTIONS: SectionKey[] = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
];

/**
 * Headless bridge component that tracks DOM section positions and pointer coordinates
 * via ScrollTrigger and writes directly into mutable `sceneState` WITHOUT causing React re-renders.
 */
export function ImmersiveSceneBridge() {
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Global scroll & velocity trigger
    const globalTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        sceneState.globalScroll = self.progress;
        sceneState.scrollVelocity = self.getVelocity();
      },
    });
    triggers.push(globalTrigger);

    // Section-specific geometry & progress triggers
    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 65%",
        end: "bottom 35%",
        onEnter: () => {
          sceneState.activeSection = id;
        },
        onEnterBack: () => {
          sceneState.activeSection = id;
        },
        onUpdate: (self) => {
          if (self.isActive) {
            sceneState.activeSection = id;
            sceneState.sectionProgress = self.progress;
          }
        },
      });
      triggers.push(trigger);
    });

    // Pointer move listener
    const handleMouseMove = (e: MouseEvent) => {
      updatePointerTarget(
        e.clientX,
        e.clientY,
        window.innerWidth,
        window.innerHeight
      );
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
