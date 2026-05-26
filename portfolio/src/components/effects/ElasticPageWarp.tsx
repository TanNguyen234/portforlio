"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformanceMode } from "@/lib/performance";

export default function ElasticPageWarp() {
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) return;

    // Target elements to skew and scale during fast scrolling
    const skewElements = gsap.utils.toArray(
      ".section-shell, #projects, .surface-grid, .projects-container"
    );

    let scrollTimeout: NodeJS.Timeout;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity(); // Speed in px/second (positive or negative)
        
        // Map scroll velocity to a subtle skew angle (-4 to 4 degrees)
        const skew = gsap.utils.clamp(-4, 4, velocity / 750);
        
        // Map velocity to scale vertically to prevent showing white background gutters
        const scale = 1 + Math.min(0.04, Math.abs(velocity / 12000));

        gsap.to(skewElements, {
          skewY: skew,
          scaleY: scale,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Debounce to reset and spring back to normal when scrolling ceases
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          gsap.to(skewElements, {
            skewY: 0,
            scaleY: 1,
            duration: 0.6,
            ease: "elastic.out(1, 0.7)",
            overwrite: "auto",
          });
        }, 120);
      },
    });

    return () => {
      st.kill();
      clearTimeout(scrollTimeout);
      // Reset transformations
      gsap.set(skewElements, { skewY: 0, scaleY: 1 });
    };
  }, [isLowEnd, reduceMotion]);

  return null;
}
