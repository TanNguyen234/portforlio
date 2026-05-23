"use client";

import { useEffect, useRef } from "react";
import { usePerformanceMode } from "@/lib/performance";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;
    const particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 1,
      });
    };

    const onMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      for (let i = 0; i < 6; i += 1) {
        spawn(clientX, clientY);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= 0.02;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 
          ? `rgba(0, 240, 255, ${p.life * 0.45})`
          : `rgba(255, 0, 127, ${p.life * 0.45})`;
        ctx.arc(p.x, p.y, 3 + (1 - p.life) * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  );
}
