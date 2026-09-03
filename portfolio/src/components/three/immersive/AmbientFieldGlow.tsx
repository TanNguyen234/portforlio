"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface AmbientGlowProps {
  tier: GraphicsTier;
}

const GLOW_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;
  uniform vec2 uCorePos;
  uniform float uIntensity;

  void main() {
    // Dynamic radial glow originating near the AI Core
    vec2 center = vec2(0.5) + uCorePos * 0.08;
    float dist = distance(vUv, center);
    
    // Soft organic breathing pulse
    float pulse = sin(uTime * 0.7) * 0.06 + 1.0;
    float glow = exp(-dist * 2.8 / pulse) * uIntensity;
    
    // Cosmic triple chromatic gradient
    float wave = sin(vUv.x * 2.0 + uTime * 0.3) * 0.5 + 0.5;
    vec3 gradient = mix(uColorA, uColorB, wave);
    vec3 color = mix(gradient, uColorC, vUv.y * 0.7 + sin(uTime * 0.2) * 0.15);
    
    gl_FragColor = vec4(color, glow * 0.48);
  }
`;

export function AmbientFieldGlow({ tier }: AmbientGlowProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCorePos: { value: new THREE.Vector2(0.5, 0) },
      uColorA: { value: new THREE.Color("#032b28") }, // Deep Emerald Obsidian
      uColorB: { value: new THREE.Color("#071f38") }, // Deep Cyber Midnight
      uColorC: { value: new THREE.Color("#1a0933") }, // Quantum Deep Violet
      uIntensity: { value: tier === "full" ? 0.85 : 0.55 },
    }),
    [tier]
  );

  useFrame((state) => {
    if (tier === "static") return;

    const mesh = meshRef.current;
    if (mesh && mesh.material && "uniforms" in mesh.material) {
      const mat = mesh.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Shift glow center based on pointer and active section
      const ptr = sceneState.pointer;
      mat.uniforms.uCorePos.value.set(ptr.x * 0.5 + 0.4, ptr.y * 0.3);
    }
  });

  if (tier === "static") return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[26, 18]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={GLOW_VERTEX_SHADER}
        fragmentShader={GLOW_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
