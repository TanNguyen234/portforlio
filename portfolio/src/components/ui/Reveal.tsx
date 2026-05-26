"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = containerRef.current;
      if (!element) return;

      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 24,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          delay: delay,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="will-change-[transform,opacity,filter]">
      {children}
    </div>
  );
}
