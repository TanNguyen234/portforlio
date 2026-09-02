"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface AICoreProps {
  tier: GraphicsTier;
}

const FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    // Subtle mathematical vertex breath
    vec3 pos = position + normal * (sin(position.y * 4.0 + uTime * 1.5) * 0.025);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRESNEL_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 uFresnelColor;
  uniform vec3 uBaseColor;
  uniform float uIntensity;
  void main() {
    // Fresnel calculation from view direction
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.8);
    vec3 color = mix(uBaseColor, uFresnelColor, fresnel * uIntensity);
    gl_FragColor = vec4(color, 0.72 + fresnel * 0.28);
  }
`;

export function AICoreObject({ tier }: AICoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Performance-adjusted geometry detail
  const detail = tier === "full" ? 2 : 1;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFresnelColor: { value: new THREE.Color("#14b8a6") },
      uBaseColor: { value: new THREE.Color("#05080a") },
      uIntensity: { value: 1.2 },
    }),
    []
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (tier === "static") {
      // Keep completely still for static / reduced-motion tier
      return;
    }

    const t = state.clock.getElapsedTime();
    const mesh = outerMeshRef.current;
    if (mesh && mesh.material && "uniforms" in mesh.material) {
      const mat = mesh.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = t;
    }

    // Smooth pointer damping
    const ptr = sceneState.pointer;
    ptr.x = THREE.MathUtils.damp(ptr.x, ptr.targetX, 4, delta);
    ptr.y = THREE.MathUtils.damp(ptr.y, ptr.targetY, 4, delta);

    // Continuous scroll progress and section dynamics
    const scroll = sceneState.globalScroll;
    const velocity = sceneState.scrollVelocity;

    // Target positions based on continuous scroll
    // Hero: [1.8, 0, 0] -> About: [2.2, 0.4, -1] -> Projects: [0, -0.5, -4] -> Contact: [0, 0, -0.5]
    let targetX = 1.6;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1.1;

    if (scroll < 0.25) {
      // Hero to About transition
      const p = scroll / 0.25;
      targetX = THREE.MathUtils.lerp(1.6, 2.2, p);
      targetY = THREE.MathUtils.lerp(0, 0.3, p);
      targetZ = THREE.MathUtils.lerp(0, -1.2, p);
      targetScale = THREE.MathUtils.lerp(1.1, 1.3, p);
    } else if (scroll < 0.55) {
      // About to Experience
      const p = (scroll - 0.25) / 0.3;
      targetX = THREE.MathUtils.lerp(2.2, -1.8, p);
      targetY = THREE.MathUtils.lerp(0.3, -0.2, p);
      targetZ = THREE.MathUtils.lerp(-1.2, -2.5, p);
      targetScale = THREE.MathUtils.lerp(1.3, 0.95, p);
    } else if (scroll < 0.8) {
      // Experience to Projects
      const p = (scroll - 0.55) / 0.25;
      targetX = THREE.MathUtils.lerp(-1.8, 0, p);
      targetY = THREE.MathUtils.lerp(-0.2, -0.6, p);
      targetZ = THREE.MathUtils.lerp(-2.5, -3.8, p);
      targetScale = THREE.MathUtils.lerp(0.95, 0.85, p);
    } else {
      // Skills to Contact
      const p = (scroll - 0.8) / 0.2;
      targetX = THREE.MathUtils.lerp(0, 0, p);
      targetY = THREE.MathUtils.lerp(-0.6, 0.1, p);
      targetZ = THREE.MathUtils.lerp(-3.8, -1.5, p);
      targetScale = THREE.MathUtils.lerp(0.85, 1.0, p);
    }

    // Add gentle pointer offset
    targetX += ptr.x * 0.4;
    targetY += ptr.y * 0.3;

    // Damp transform
    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.5, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.5, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.5, delta);

    const s = THREE.MathUtils.damp(group.scale.x, targetScale, 3, delta);
    group.scale.set(s, s, s);

    // Autonomous slow rotation + tilt
    group.rotation.y += delta * 0.18 + Math.abs(velocity) * 0.0002;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, ptr.y * 0.2, 3, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -ptr.x * 0.15, 3, delta);

    // Subtle counter-rotation for internal orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.35;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.4;
      ring2Ref.current.rotation.z += delta * 0.25;
    }

    // Inner core heartbeat pulse
    if (innerCoreRef.current) {
      const pulse = 1.0 + Math.sin(t * 2.8) * 0.06;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} position={[1.6, 0, 0]}>
      {/* Outer Faceted Geometric Shell with Declarative ShaderMaterial */}
      <mesh ref={outerMeshRef}>
        <icosahedronGeometry args={[1.35, detail]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={FRESNEL_VERTEX_SHADER}
          fragmentShader={FRESNEL_FRAGMENT_SHADER}
          transparent
          wireframe={tier !== "full"}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Wireframe Cage Layer */}
      <mesh>
        <icosahedronGeometry args={[1.38, detail]} />
        <meshBasicMaterial
          color="#2dd4bf"
          wireframe
          transparent
          opacity={tier === "full" ? 0.25 : 0.15}
        />
      </mesh>

      {/* Concentric Technical Data Orbit Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.85, 0.012, 12, 48]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} />
      </mesh>

      {/* Concentric Technical Data Orbit Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.1, 0.008, 12, 48]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.2} />
      </mesh>

      {/* Inner Glowing Intelligence Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#0f766e"
          emissive="#14b8a6"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
