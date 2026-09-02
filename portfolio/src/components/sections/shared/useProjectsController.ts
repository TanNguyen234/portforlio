"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectsControllerOptions {
  projectCount: number;
  onActiveProjectChange?: (index: number) => void;
}

export function useProjectsController({
  projectCount,
  onActiveProjectChange,
}: ProjectsControllerOptions) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    if (active === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const scroller = scrollerRef.current;
      if (!trigger || !scroller) return;

      const calculateScrollAmount = () => {
        return -(scroller.scrollWidth - window.innerWidth);
      };

      gsap.fromTo(
        scroller,
        { x: 0 },
        {
          x: calculateScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            pin: true,
            start: "top top",
            end: () => `+=${scroller.scrollWidth - window.innerWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (onActiveProjectChange && projectCount > 0) {
                const idx = Math.min(
                  projectCount - 1,
                  Math.max(0, Math.floor(self.progress * projectCount))
                );
                onActiveProjectChange(idx);
              }
            },
          },
        }
      );
    },
    { scope: triggerRef }
  );

  const closeDrawer = () => setActive(null);

  return {
    active,
    setActive,
    closeDrawer,
    triggerRef,
    scrollerRef,
  };
}
