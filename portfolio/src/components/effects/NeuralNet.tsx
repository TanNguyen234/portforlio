"use client";

import { useEffect, useRef } from "react";
import { usePerformanceMode } from "@/lib/performance";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

export default function NeuralNet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000, active: false };
    let rafId = 0;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 15000), 85);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 1.2 + Math.random() * 1.8,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-current').trim() || "#00f0ff";

      // 1. Move and link particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Magnet attraction pull
        if (mouse.active) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            p1.x += dx * 0.012;
            p1.y += dy * 0.012;
          }
        }

        // Draw connections between nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 105) {
            const alpha = (1 - dist / 105) * 0.12;
            ctx.strokeStyle = accent;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;

      // 2. Render particle node circles
      particles.forEach((p) => {
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render connection bridges to cursor
      if (mouse.active) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.2;
            ctx.strokeStyle = accent;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      ctx.globalAlpha = 1.0;
      rafId = requestAnimationFrame(draw);
    };

    resize();
    init();

    const handleResize = () => {
      resize();
      init();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) return null;

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-[-10] w-full h-full opacity-55"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
