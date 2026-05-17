"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePerformanceMode } from "@/lib/performance";

type Node = {
  label: string;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  x: number;
  y: number;
};

const createNodes = (labels: string[]): Node[] =>
  labels.map((label, index) => ({
    label,
    angle: (index / labels.length) * Math.PI * 2,
    radius: 120 + Math.random() * 120,
    speed: 0.0008 + Math.random() * 0.0009,
    size: 6 + Math.random() * 6,
    x: 0,
    y: 0,
  }));

export default function SkillField({ labels }: { labels: string[] }) {
  const { isLowEnd } = usePerformanceMode();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const nodes = useMemo(() => createNodes(labels), [labels]);

  useEffect(() => {
    if (isLowEnd) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let centerX = 0;
    let centerY = 0;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(5, 10, 20, 0.5)";
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.angle += node.speed * time;
        node.x = centerX + Math.cos(node.angle) * node.radius;
        node.y = centerY + Math.sin(node.angle) * (node.radius * 0.6);
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const alpha = 1 - dist / 140;
            ctx.strokeStyle = `rgba(124, 244, 255, ${alpha * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(124, 244, 255, 0.65)";
        ctx.shadowColor = "rgba(124, 244, 255, 0.4)";
        ctx.shadowBlur = 12;
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "11px IBM Plex Sans, sans-serif";
      ctx.textAlign = "center";
      nodes.forEach((node) => {
        ctx.fillText(node.label, node.x, node.y - node.size - 8);
      });

      rafId = requestAnimationFrame((t) => draw(t * 0.5));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    rafId = requestAnimationFrame((t) => draw(t * 0.5));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isLowEnd, nodes]);

  if (isLowEnd) {
    return (
      <div className="skill-field skill-field--lite">
        {labels.slice(0, 10).map((label) => (
          <span key={label} className="orbital-tag">
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="skill-field">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
