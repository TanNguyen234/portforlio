"use client";

import { useEffect } from "react";

export default function ScrollVelocity() {
  useEffect(() => {
    const root = document.documentElement;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let rafId = 0;

    root.style.setProperty("--motion-ready", "1");

    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - lastY);
      const dt = Math.max(now - lastTime, 16);
      const velocity = Math.min(dy / dt, 2.5);

      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      lastY = y;
      lastTime = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return null;
}
