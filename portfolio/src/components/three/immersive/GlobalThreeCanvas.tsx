"use client";

import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AICoreObject } from "./AICoreObject";
import { SpatialField } from "./SpatialField";
import { SceneCameraController } from "./SceneCameraController";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { updateScrollProgress, updatePointerTarget } from "./sceneState";
import { useVisualMode } from "@/components/providers/VisualModeProvider";

export default function GlobalThreeCanvas() {
  const { graphicsTier, setGraphicsTier } = useVisualMode();

  // Bind non-react global scroll and pointer tracking
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const onScroll = () => {
      const currentY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const velocity = (currentY - lastScrollY) / dt;

      lastScrollY = currentY;
      lastTime = now;

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, currentY / max));
      updateScrollProgress(progress, velocity * 100);
    };

    const onPointerMove = (e: MouseEvent) => {
      updatePointerTarget(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    // Initial check
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
    };
  }, []);

  // Graceful fallback for static / unsupported tier
  if (graphicsTier === "static") {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#020203] via-[#05080c] to-[#020203] opacity-80"
        aria-hidden="true"
      />
    );
  }

  const dpr: [number, number] = graphicsTier === "full" ? [1, 1.5] : [1, 1.25];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ width: "100vw", height: "100dvh" }}
      aria-hidden="true"
    >
      <WebGLErrorBoundary
        onError={() => {
          // Gracefully degrade graphics tier to static on runtime error
          setGraphicsTier("static");
        }}
        fallback={
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#020203] via-[#05080c] to-[#020203] opacity-80"
            aria-hidden="true"
          />
        }
      >
        <Canvas
          camera={{ fov: 45, position: [0, 0, 7.5], near: 0.1, far: 50 }}
          dpr={dpr}
          gl={{
            antialias: graphicsTier === "full",
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0); // Transparent canvas background
          }}
        >
          {/* Spatial Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={0.7} color="#f8fafc" />
          <pointLight position={[2, 2, 3]} intensity={1.2} color="#14b8a6" distance={12} />
          <pointLight position={[-3, -2, 2]} intensity={0.6} color="#0284c7" distance={10} />

          {/* Orchestrated 3D Entities */}
          <SceneCameraController tier={graphicsTier} />
          <AICoreObject tier={graphicsTier} />
          <SpatialField tier={graphicsTier} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
