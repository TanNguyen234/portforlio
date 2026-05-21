"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ThreeDCard({ children, className = "", onClick }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    // Reset styles
    gsap.set(card, {
      transformPerspective: 1200,
      transformStyle: "preserve-3d",
      rotateX: 0,
      rotateY: 0,
      z: 0,
    });
    gsap.set(glare, { opacity: 0, x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Get mouse position relative to card
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate rotation (-15 to 15 degrees)
      const rX = -((mouseY - height / 2) / (height / 2)) * 10;
      const rY = ((mouseX - width / 2) / (width / 2)) * 10;

      // Calculate glare position
      const glareX = (mouseX / width) * 100;
      const glareY = (mouseY / height) * 100;

      gsap.to(card, {
        rotateX: rX,
        rotateY: rY,
        scale: 1.03,
        z: 10,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(glare, {
        opacity: 0.4,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        z: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(glare, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`relative cursor-pointer transition-shadow duration-300 hover:shadow-2xl hover:shadow-[color:var(--accent-current)]/5 ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glare Overlay */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay transition-opacity duration-300"
      />
      {/* Content wrapper with perspective */}
      <div className="relative z-10 h-full w-full" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
