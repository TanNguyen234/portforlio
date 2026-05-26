"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePerformanceMode } from "@/lib/performance";

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  onClick?: () => void;
}

export default function CyberCard({
  children,
  className = "",
  accentColor,
  onClick,
}: CyberCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [binaryStream, setBinaryStream] = useState<string[]>([]);
  const { isLowEnd } = usePerformanceMode();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      const stream = Array.from({ length: 14 }, () =>
        Math.random() > 0.5 ? "1" : "0"
      );
      setBinaryStream(stream);
    }, 100);
    return () => clearInterval(interval);
  }, [isHovered]);

  // GSAP 3D Interactive Tilt & Inner Content Parallax
  useGSAP(
    () => {
      const card = containerRef.current;
      if (!card || isLowEnd) return;

      // Tween hooks for smooth updates
      const xTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
      const yTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
      
      const innerToX = gsap.quickTo(".cyber-card-inner-content", "x", { duration: 0.45, ease: "power2.out" });
      const innerToY = gsap.quickTo(".cyber-card-inner-content", "y", { duration: 0.45, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const px = (x / rect.width - 0.5) * 2; // -1 to 1 range
        const py = (y / rect.height - 0.5) * 2; // -1 to 1 range

        // Tilt the card
        xTo(px * 10); // Max 10 degrees yaw rotation
        yTo(py * -10); // Max 10 degrees pitch rotation

        // Parallax shift the content inside in the opposite direction
        innerToX(px * -5);
        innerToY(py * -5);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
        innerToX(0);
        innerToY(0);
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef, dependencies: [isLowEnd, dimensions] }
  );

  const w = dimensions.width;
  const h = dimensions.height;
  const c = 16; // Chamfer corner size

  // Generate SVG coordinates for exact chamfer outline
  const svgPath = w && h 
    ? `M 1.5 ${c} L ${c} 1.5 L ${w - c} 1.5 L ${w - 1.5} ${c} L ${w - 1.5} ${h - c} L ${w - c} ${h - 1.5} L ${c} ${h - 1.5} L 1.5 ${h - c} Z`
    : "";

  const customAccent = accentColor || "var(--accent-current)";

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`cyber-card-wrapper relative group/card w-full h-full ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        "--accent-current": customAccent,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      } as React.CSSProperties}
    >
      {/* Target Reticles (HUD corner brackets) */}
      {!isLowEnd && (
        <>
          <div className="hud-bracket hud-bracket-tl" />
          <div className="hud-bracket hud-bracket-tr" />
          <div className="hud-bracket hud-bracket-bl" />
          <div className="hud-bracket hud-bracket-br" />
        </>
      )}

      {/* Shadow glow on hover */}
      <div 
        className="absolute inset-0 bg-transparent rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          boxShadow: `0 0 35px -5px ${customAccent}25`,
        }}
      />

      {/* SVG Outline & Radar Laser Beam */}
      {w > 0 && h > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox={`0 0 ${w} ${h}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wireframe blueprint layer */}
          <motion.path
            d={svgPath}
            stroke={customAccent}
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0.12 }}
            animate={isInView ? { pathLength: 1, opacity: isHovered ? 0.5 : 0.22 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Sweeping laser laser border beam */}
          {!isLowEnd && (
            <path
              d={svgPath}
              stroke={`url(#beam-grad-${customAccent.replace(/[^a-zA-Z0-9]/g, "")})`}
              strokeWidth={2}
              className="border-beam-path"
              strokeLinecap="round"
              opacity={isHovered ? 1 : 0.5}
            />
          )}

          <defs>
            <linearGradient id={`beam-grad-${customAccent.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={customAccent} stopOpacity="1" />
              <stop offset="20%" stopColor={customAccent} stopOpacity="0.8" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="70%" stopColor={customAccent} stopOpacity="0.2" />
              <stop offset="100%" stopColor={customAccent} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Clipped Inner solid background container */}
      <motion.div
        className="cyber-card-clip w-full h-full p-[1px]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div 
          className="w-full h-full bg-black/60 backdrop-blur-md rounded-[inherit] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
          style={{
            background: isHovered 
              ? `linear-gradient(135deg, ${customAccent}07 0%, rgba(10, 5, 21, 0.9) 60%, rgba(5, 2, 10, 0.95) 100%)`
              : "rgba(10, 5, 21, 0.8)",
          }}
        >
          {/* Hologram scanline laser sweeps down as card constructs */}
          {isInView && (
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--accent-current)] to-transparent opacity-80 z-20 pointer-events-none"
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: 0.15 }}
            />
          )}

          {/* Grid lines pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

          {/* Integrated Circuit Paths Background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] group-hover/card:opacity-[0.14] transition-all duration-500 z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 20 40 L 80 40 L 100 60 L 100 120"
              stroke={customAccent}
              strokeWidth="1"
              fill="none"
              strokeDasharray={isHovered ? "none" : "4 4"}
              className="transition-all duration-500"
            />
            <path
              d="M 40 180 L 100 180 L 120 160 L 180 160"
              stroke={customAccent}
              strokeWidth="1"
              fill="none"
              strokeDasharray={isHovered ? "none" : "4 4"}
              className="transition-all duration-500"
            />
            {/* Circuit nodes */}
            <circle cx="20" cy="40" r="3" fill={customAccent} opacity={isHovered ? 0.9 : 0.4} />
            <circle cx="100" cy="120" r="3" fill={customAccent} opacity={isHovered ? 0.9 : 0.4} />
            <circle cx="40" cy="180" r="3" fill={customAccent} opacity={isHovered ? 0.9 : 0.4} />
            <circle cx="180" cy="160" r="3" fill={customAccent} opacity={isHovered ? 0.9 : 0.4} />
            
            {/* Animating data pulse sweep */}
            {isHovered && (
              <>
                <motion.circle
                  r="2.2"
                  fill="#ffffff"
                  style={{
                    offsetPath: `path("M 20 40 L 80 40 L 100 60 L 100 120")`,
                  }}
                  animate={{
                    offsetDistance: ["0%", "100%"]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.circle
                  r="2.2"
                  fill="#ffffff"
                  style={{
                    offsetPath: `path("M 40 180 L 100 180 L 120 160 L 180 160")`,
                  }}
                  animate={{
                    offsetDistance: ["0%", "100%"]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5,
                  }}
                />
              </>
            )}
          </svg>

          {/* Laser Sweep Scan Line */}
          {isHovered && (
            <div
              className="absolute inset-x-0 h-[2.5px] pointer-events-none z-20"
              style={{
                background: `linear-gradient(90deg, transparent, ${customAccent}, transparent)`,
                boxShadow: `0 0 10px ${customAccent}, 0 0 4px ${customAccent}`,
                animation: "laser-sweep 2.2s linear infinite",
                top: 0,
              }}
            />
          )}

          {/* Content layer that flickers/warms up like neon */}
          <div className={`${isInView ? "neon-flicker" : ""} cyber-card-inner-content relative z-10 w-full h-full flex flex-col will-change-transform`}>
            {children}
          </div>

          {/* Matrix Binary Stream on right border */}
          {isHovered && binaryStream.length > 0 && (
            <div className="absolute right-3 top-8 bottom-8 w-2 overflow-hidden pointer-events-none text-[8px] leading-[10px] text-[color:var(--accent-current)]/30 font-mono flex flex-col justify-start select-none z-0">
              {binaryStream.map((char, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
