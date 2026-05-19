"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GridDistortion() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const xTo = gsap.quickTo(grid, "--grid-x", {
      duration: 0.6,
      ease: "power3",
      units: "%",
    });
    const yTo = gsap.quickTo(grid, "--grid-y", {
      duration: 0.6,
      ease: "power3",
      units: "%",
    });

    const handleMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      xTo(x);
      yTo(y);
    };

    const handleLeave = () => {
      xTo(50);
      yTo(30);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="pointer-events-none fixed inset-0 z-0 surface-grid"
      aria-hidden="true"
    />
  );
}
