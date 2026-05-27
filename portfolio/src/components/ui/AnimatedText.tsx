"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const elements = containerRef.current?.querySelectorAll(".animated-word");
      if (!elements || elements.length === 0) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 18,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.06,
          delay: delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="animated-word inline-block will-change-[transform,opacity,filter]"
        >
          {word}
        </span>
      ))}
    </span>
  );
}
