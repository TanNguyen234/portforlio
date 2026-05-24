"use client";

import { useEffect, useRef } from "react";
import { usePerformanceMode } from "@/lib/performance";

type Decal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  size: number;
  radius: number; // For collision bounding circle
  color: string;
  opacity: number;
};

export default function PhysicsDecals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const symbols = [
      "{ }", "[ ]", "SYS_RUN", "NODE_L8", "SEC_PASS", 
      "ML_INIT", "/!\\", "0x3F", "NOMINAL", "<- BUS", 
      "DATA_IN", "-> OUT", "[CODE]"
    ];

    const colors = ["#00f0ff", "#ff007f", "#bc13fe", "#ffe600", "#39ff14"];
    const decals: Decal[] = [];
    const count = 15;

    // Initialize decals in layout margins (avoiding the central main content block)
    for (let i = 0; i < count; i++) {
      const isLeft = Math.random() < 0.5;
      const x = isLeft 
        ? Math.random() * (width * 0.18) 
        : width - Math.random() * (width * 0.18);
      const y = Math.random() * height;
      const text = symbols[i % symbols.length];
      const size = 9 + Math.floor(Math.random() * 4);
      const radius = text.length * 3.8 + 6;

      decals.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        text,
        size,
        radius,
        color: colors[i % colors.length],
        opacity: 0.12 + Math.random() * 0.12,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const resolveCollisions = () => {
      for (let i = 0; i < decals.length; i++) {
        for (let j = i + 1; j < decals.length; j++) {
          const d1 = decals[i];
          const d2 = decals[j];
          const dx = d2.x - d1.x;
          const dy = d2.y - d1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = d1.radius + d2.radius;

          if (dist < minDist) {
            // Overlap detected: perform elastic collision bounce response
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const vx1 = d1.vx * cos + d1.vy * sin;
            const vy1 = d1.vy * cos - d1.vx * sin;
            const vx2 = d2.vx * cos + d2.vy * sin;
            const vy2 = d2.vy * cos - d2.vx * sin;

            // Simple mass elastic swap velocities
            const vx1Final = vx2;
            const vx2Final = vx1;

            // Rotate back
            d1.vx = vx1Final * cos - vy1 * sin;
            d1.vy = vy1 * cos + vx1Final * sin;
            d2.vx = vx2Final * cos - vy2 * sin;
            d2.vy = vy2 * cos + vx2Final * sin;

            // Separate overlapping elements
            const overlap = minDist - dist;
            const sepX = (overlap / 2) * cos;
            const sepY = (overlap / 2) * sin;
            d1.x -= sepX;
            d1.y -= sepY;
            d2.x += sepX;
            d2.y += sepY;
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse interactive push vector
      if (mouse.active) {
        decals.forEach((d) => {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 115) {
            // Apply cursor repulsion acceleration force
            const force = (115 - dist) / 115;
            d.vx += (dx / dist) * force * 0.06;
            d.vy += (dy / dist) * force * 0.06;
          }
        });
      }

      // Update positions and handle border walls boundary bouncing
      decals.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        // Friction damping to return to natural drifting speed
        d.vx *= 0.98;
        d.vy *= 0.98;

        const maxSpeed = 1.5;
        const currentSpeed = Math.hypot(d.vx, d.vy);
        if (currentSpeed > maxSpeed) {
          d.vx = (d.vx / currentSpeed) * maxSpeed;
          d.vy = (d.vy / currentSpeed) * maxSpeed;
        }

        // Left/Right margin bounds (restrict decals to floating on side gutters)
        const leftWallLimit = width * 0.22;
        const rightWallLimit = width * 0.78;

        if (d.x < d.radius) {
          d.x = d.radius;
          d.vx *= -1;
        } else if (d.x > width - d.radius) {
          d.x = width - d.radius;
          d.vx *= -1;
        }

        // Prevent decals from wandering into the center content column
        if (d.x > leftWallLimit && d.x < width / 2 && d.vx > 0) {
          d.vx *= -1;
        } else if (d.x < rightWallLimit && d.x > width / 2 && d.vx < 0) {
          d.vx *= -1;
        }

        if (d.y < d.radius) {
          d.y = d.radius;
          d.vy *= -1;
        } else if (d.y > height - d.radius) {
          d.y = height - d.radius;
          d.vy *= -1;
        }
      });

      // Handle custom shape overlaps
      resolveCollisions();

      // Render decals
      decals.forEach((d) => {
        const rootStyle = typeof document !== "undefined" ? document.documentElement.style : null;
        const activeAccent = rootStyle?.getPropertyValue("--accent-current")?.trim();

        // Render bracket outlines
        ctx.save();
        ctx.fillStyle = activeAccent && Math.random() < 0.15 ? activeAccent : d.color;
        ctx.globalAlpha = d.opacity;
        ctx.font = `italic bold ${d.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Optional shadow glow
        ctx.shadowBlur = 4;
        ctx.shadowColor = ctx.fillStyle as string;

        ctx.fillText(d.text, d.x, d.y);
        ctx.restore();
      });

      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] w-full h-full"
      style={{ mixBlendMode: "screen" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
