"use client";

import { useEffect, useState } from "react";

export function usePerformanceMode() {
  const [isLowEnd, setIsLowEnd] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const lowEnd = prefersReduced || memory <= 2 || cores <= 2;

    setReduceMotion(prefersReduced);
    setIsLowEnd(lowEnd);
  }, []);

  return { isLowEnd, reduceMotion };
}
