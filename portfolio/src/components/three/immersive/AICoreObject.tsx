"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface AICoreProps {
  tier: GraphicsTier;
}

// Mathematically correct view-space Fresnel shader
const FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform float uDisplacement;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Controlled geometric vertex breath
    vec3 pos = position + normal * (sin(position.y * 3.5 + uTime * 1.4) * (0.025 + uDisplacement * 0.035));
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRESNEL_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform vec3 uFresnelColor;
  uniform vec3 uBaseColor;
  uniform float uIntensity;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // View-space Fresnel computation
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.5);
    vec3 color = mix(uBaseColor, uFresnelColor, fresnel * uIntensity);
    
    gl_FragColor = vec4(color, 0.7 + fresnel * 0.3);
  }
`;

export function AICoreObject({ tier }: AICoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const cageMeshRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satellitesGroupRef = useRef<THREE.Group>(null);

  // Performance-adjusted geometry detail
  const detail = tier === "full" ? 2 : 1;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplacement: { value: 0 },
      uFresnelColor: { value: new THREE.Color("#14b8a6") },
      uBaseColor: { value: new THREE.Color("#03070b") },
      uIntensity: { value: 1.35 },
    }),
    []
  );

  // Procedural satellite orbital parameters
  const satellites = useMemo(() => {
    const items = [];
    const count = tier === "full" ? 8 : 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.3 + (i % 3) * 0.35;
      const speed = 0.8 + (i % 2) * 0.4;
      const inclination = ((i % 4) - 1.5) * 0.4;
      items.push({ angle, radius, speed, inclination, color: i % 2 === 0 ? "#2dd4bf" : "#38bdf8" });
    }
    return items;
  }, [tier]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (tier === "static") return;

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
    const activeSec = sceneState.activeSection;
    const progress = sceneState.sectionProgress;
    const velocity = sceneState.scrollVelocity;
    const projectIdx = sceneState.activeProjectIndex;

    // Continuous parameter morphing across sections
    let targetX = 1.7;
    let targetY = 0.0;
    let targetZ = 0.0;
    let targetScale = 1.15;
    let shellSeparation = 0.0;
    let ringTension = 0.0;
    let pulseRate = 2.4;

    switch (activeSec) {
      case "hero":
        targetX = 1.7;
        targetY = 0.0;
        targetZ = 0.0;
        targetScale = 1.18;
        shellSeparation = 0.0;
        ringTension = 0.0;
        pulseRate = 2.4;
        break;

      case "about":
        targetX = 2.2;
        targetY = 0.35;
        targetZ = -1.2;
        targetScale = 1.28;
        shellSeparation = 0.28;
        ringTension = 0.35;
        pulseRate = 2.8;
        break;

      case "experience":
        targetX = -1.9;
        targetY = -0.2;
        targetZ = -2.2;
        targetScale = 0.95;
        shellSeparation = 0.15;
        ringTension = 0.7;
        pulseRate = 2.2;
        break;

      case "projects":
        targetX = 0.0 + (projectIdx - 1) * 0.35;
        targetY = -0.55;
        targetZ = -3.4;
        targetScale = 0.88;
        shellSeparation = 0.08;
        ringTension = 0.95;
        pulseRate = 1.8;
        break;

      case "skills":
        targetX = 1.8;
        targetY = -0.25;
        targetZ = -1.6;
        targetScale = 1.05;
        shellSeparation = 0.38;
        ringTension = 0.5;
        pulseRate = 3.0;
        break;

      case "contact":
        targetX = 0.0;
        targetY = 0.15;
        targetZ = -1.2;
        targetScale = 1.0;
        shellSeparation = 0.0;
        ringTension = 0.1;
        pulseRate = 1.6;
        break;
    }

    targetY += Math.sin(progress * Math.PI) * 0.15;
    targetX += ptr.x * 0.35;
    targetY += ptr.y * 0.25;

    // Damp position & scale
    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.2, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.2, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.2, delta);

    const currentScale = THREE.MathUtils.damp(group.scale.x, targetScale, 3.0, delta);
    group.scale.set(currentScale, currentScale, currentScale);

    // Shell separation morphing
    if (outerMeshRef.current) {
      const outerScale = THREE.MathUtils.damp(
        outerMeshRef.current.scale.x,
        1.0 + shellSeparation,
        3.0,
        delta
      );
      outerMeshRef.current.scale.set(outerScale, outerScale, outerScale);
    }
    if (cageMeshRef.current) {
      const cageScale = THREE.MathUtils.damp(
        cageMeshRef.current.scale.x,
        1.0 + shellSeparation * 1.18,
        3.0,
        delta
      );
      cageMeshRef.current.scale.set(cageScale, cageScale, cageScale);
    }

    // Gyroscopic rotations
    group.rotation.y += delta * 0.16 + Math.abs(velocity) * 0.00018;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, ptr.y * 0.18, 3, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -ptr.x * 0.12, 3, delta);

    // 3 Concentric Gimbal Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * (0.32 - ringTension * 0.15);
      ring1Ref.current.rotation.y += delta * (0.22 + ringTension * 0.1);
      const r1 = THREE.MathUtils.damp(ring1Ref.current.scale.z, 1.0 - ringTension * 0.5, 3.0, delta);
      ring1Ref.current.scale.set(1, 1, r1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * (0.36 - ringTension * 0.15);
      ring2Ref.current.rotation.z += delta * (0.24 + ringTension * 0.08);
      const r2 = THREE.MathUtils.damp(ring2Ref.current.scale.x, 1.0 - ringTension * 0.4, 3.0, delta);
      ring2Ref.current.scale.set(r2, 1, 1);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.28;
      ring3Ref.current.rotation.z -= delta * 0.32;
    }

    // Inner core pulse
    if (innerCoreRef.current) {
      const pulse = 1.0 + Math.sin(t * pulseRate) * (0.05 + shellSeparation * 0.04);
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Satellite orbital animations
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y += delta * 0.4;
      satellitesGroupRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[1.7, 0, 0]}>
      {/* Outer Faceted Geometric Shell */}
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
      <mesh ref={cageMeshRef}>
        <icosahedronGeometry args={[1.38, detail]} />
        <meshBasicMaterial
          color="#2dd4bf"
          wireframe
          transparent
          opacity={tier === "full" ? 0.22 : 0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Multi-Axis Gimbal Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.85, 0.012, 12, 48]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Multi-Axis Gimbal Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.1, 0.009, 12, 48]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* Multi-Axis Gimbal Ring 3 */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[2.35, 0.007, 12, 48]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* Satellite Quantum Data Nodes */}
      <group ref={satellitesGroupRef}>
        {satellites.map((sat, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(sat.angle) * sat.radius,
              Math.sin(sat.angle * 2) * sat.inclination,
              Math.sin(sat.angle) * sat.radius,
            ]}
          >
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={sat.color} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Inner Glowing Intelligence Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#0f766e"
          emissive="#14b8a6"
          emissiveIntensity={0.75}
          roughness={0.18}
          metalness={0.85}
        />
      </mesh>
    </group>
  );
}
