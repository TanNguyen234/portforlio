"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface SpatialFieldProps {
  tier: GraphicsTier;
}

export function SpatialField({ tier }: SpatialFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Sparse count: 160 for full, 70 for reduced, 0 for static
  const count = tier === "full" ? 160 : tier === "reduced" ? 70 : 0;

  const [positions, colors] = useMemo(() => {
    if (count === 0) {
      return [new Float32Array(0), new Float32Array(0)];
    }

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const teal = new THREE.Color("#14b8a6");
    const graphite = new THREE.Color("#94a3b8");

    const pseudoRandom = (seed: number) => {
      const val = Math.sin(seed) * 10000;
      return val - Math.floor(val);
    };

    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      // Spatial volume: width 18, height 12, depth 10
      pos[i * 3] = (pseudoRandom(seed * 1.23) - 0.5) * 18;
      pos[i * 3 + 1] = (pseudoRandom(seed * 4.56) - 0.5) * 12;
      pos[i * 3 + 2] = (pseudoRandom(seed * 7.89) - 0.5) * 10 - 2;

      // Color variation between subtle teal and slate-silver
      const c = pseudoRandom(seed * 9.12) > 0.65 ? teal : graphite;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (count > 0) {
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    return geo;
  }, [positions, colors, count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points || count === 0 || tier === "static") return;

    // Slow ambient rotation
    points.rotation.y += delta * 0.02;

    // Gentle reaction to pointer and scroll progress
    const ptr = sceneState.pointer;
    points.position.x = THREE.MathUtils.damp(points.position.x, ptr.x * 0.3, 2, delta);
    points.position.y = THREE.MathUtils.damp(
      points.position.y,
      ptr.y * 0.2 + sceneState.globalScroll * 1.5,
      2,
      delta
    );
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={tier === "full" ? 0.055 : 0.045}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
