"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface SpatialFieldProps {
  tier: GraphicsTier;
}

const PARTICLE_VERTEX_SHADER = `
  attribute float aScale;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uVelocity;

  void main() {
    vColor = color;
    
    // Organic floating oscillation
    vec3 pos = position;
    pos.y += sin(uTime * 0.7 + aPhase) * 0.2;
    pos.x += cos(uTime * 0.5 + aPhase) * 0.15;
    
    // Luminance pulsation
    float pulse = sin(uTime * 1.8 + aPhase * 2.0) * 0.35 + 0.65;
    vAlpha = pulse * (1.0 + abs(uVelocity) * 0.0004);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuated point size with perspective
    gl_PointSize = (aScale * (80.0 / -mvPosition.z)) * pulse;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uOpacity;

  void main() {
    // Render soft circular anti-aliased luminous particle disk
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    float soft = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor, soft * vAlpha * uOpacity);
  }
`;

export function SpatialField({ tier }: SpatialFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Scaled particle density: 360 for full, 150 for reduced, 0 for static
  const count = tier === "full" ? 360 : tier === "reduced" ? 150 : 0;

  const [positions, colors, scales, phases] = useMemo(() => {
    if (count === 0) {
      return [
        new Float32Array(0),
        new Float32Array(0),
        new Float32Array(0),
        new Float32Array(0),
      ];
    }

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const phs = new Float32Array(count);

    const teal = new THREE.Color("#2dd4bf");
    const cyan = new THREE.Color("#38bdf8");
    const graphite = new THREE.Color("#94a3b8");

    const pseudoRandom = (seed: number) => {
      const val = Math.sin(seed) * 10000;
      return val - Math.floor(val);
    };

    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      // Broad volume field: width 24, height 16, depth 14
      pos[i * 3] = (pseudoRandom(seed * 1.23) - 0.5) * 24;
      pos[i * 3 + 1] = (pseudoRandom(seed * 4.56) - 0.5) * 16;
      pos[i * 3 + 2] = (pseudoRandom(seed * 7.89) - 0.5) * 14 - 3;

      // Varied color palette: high-energy teal, ambient cyan, soft graphite
      const rand = pseudoRandom(seed * 9.12);
      const c = rand > 0.7 ? teal : rand > 0.4 ? cyan : graphite;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Random scale and phase
      scl[i] = pseudoRandom(seed * 3.45) * 0.055 + 0.025;
      phs[i] = pseudoRandom(seed * 5.67) * Math.PI * 2;
    }

    return [pos, col, scl, phs];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (count > 0) {
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    }
    return geo;
  }, [positions, colors, scales, phases, count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uOpacity: { value: tier === "full" ? 0.65 : 0.45 },
    }),
    [tier]
  );

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points || count === 0 || tier === "static") return;

    const t = state.clock.getElapsedTime();
    if (points.material && "uniforms" in points.material) {
      const mat = points.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uVelocity.value = sceneState.scrollVelocity;
    }

    // Slow ambient rotation
    points.rotation.y += delta * 0.025;

    // React to pointer and scroll progress
    const ptr = sceneState.pointer;
    points.position.x = THREE.MathUtils.damp(points.position.x, ptr.x * 0.4, 2, delta);
    points.position.y = THREE.MathUtils.damp(
      points.position.y,
      ptr.y * 0.25 + sceneState.globalScroll * 1.8,
      2,
      delta
    );
  });

  if (count === 0 || tier === "static") return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        vertexColors
        depthWrite={false}
      />
    </points>
  );
}
