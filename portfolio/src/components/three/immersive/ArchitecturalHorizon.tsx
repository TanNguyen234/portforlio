"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface HorizonProps {
  tier: GraphicsTier;
}

const HORIZON_VERTEX_SHADER = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uScroll;

  void main() {
    vUv = uv;
    
    // Procedural mathematical wave undulation
    vec3 pos = position;
    float dist = length(pos.xy);
    float wave = sin(pos.x * 0.25 + uTime * 0.5) * cos(pos.y * 0.25 + uTime * 0.4) * 0.45;
    wave += sin(dist * 0.4 - uTime * 0.6 + uScroll * 3.0) * 0.2;
    
    pos.z += wave;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const HORIZON_FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uGridColor;
  uniform vec3 uHighlightColor;
  uniform float uOpacity;

  void main() {
    // Coordinate grid lines computation
    vec2 grid = abs(fract(vUv * 36.0 - 0.5) - 0.5) / fwidth(vUv * 36.0);
    float line = min(grid.x, grid.y);
    float gridIntensity = 1.0 - min(line, 1.0);

    // Radial attenuation (soft horizon falloff towards edges)
    float distFromCenter = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, distFromCenter) * uOpacity;

    // Elevation color modulation
    vec3 col = mix(uGridColor, uHighlightColor, smoothstep(-0.3, 0.5, vElevation));
    
    // Enhanced coordinate points at line intersections
    float points = smoothstep(0.2, 0.9, gridIntensity);

    gl_FragColor = vec4(col, (gridIntensity * 0.6 + points * 0.4) * alpha);
  }
`;

export function ArchitecturalHorizon({ tier }: HorizonProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Performance-scaled grid geometry
  const segments = tier === "full" ? 48 : 28;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uGridColor: { value: new THREE.Color("#0c3f44") },
      uHighlightColor: { value: new THREE.Color("#14b8a6") },
      uOpacity: { value: tier === "full" ? 0.35 : 0.2 },
    }),
    [tier]
  );

  useFrame((state, delta) => {
    if (tier === "static") return;

    const mesh = meshRef.current;
    if (mesh && mesh.material && "uniforms" in mesh.material) {
      const mat = mesh.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.getElapsedTime();
      mat.uniforms.uScroll.value = sceneState.globalScroll;
    }

    if (mesh) {
      // Gentle tilt reacting to pointer
      const ptr = sceneState.pointer;
      mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, ptr.x * 0.04, 2, delta);
      mesh.position.y = THREE.MathUtils.damp(
        mesh.position.y,
        -3.4 + sceneState.globalScroll * 0.4,
        2,
        delta
      );
    }
  });

  if (tier === "static") return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, -3.4, -4.5]}
      rotation={[-Math.PI / 2.2, 0, 0]}
    >
      <planeGeometry args={[28, 28, segments, segments]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={HORIZON_VERTEX_SHADER}
        fragmentShader={HORIZON_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
