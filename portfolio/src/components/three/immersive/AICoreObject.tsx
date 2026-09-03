"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface AICoreProps {
  tier: GraphicsTier;
}

// Advanced Holo-Fresnel Shader with Chromatic Dispersion & Neural Pulse
const HOLO_FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uPulse;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Multi-frequency topological breathing
    float wave = sin(position.y * 4.0 + uTime * 1.8) * cos(position.x * 3.5 + uTime * 1.2);
    vec3 displaced = position + normal * (wave * (0.035 + uPulse * 0.04));
    
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;
    
    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const HOLO_FRESNEL_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;
  uniform float uIntensity;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Two-stage refractive fresnel curve
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.8);
    float innerGlow = pow(1.0 - max(0.0, dot(viewDir, normal)), 1.2);
    
    // Dynamic spectral chromatic gradient
    float colorPhase = sin(vWorldPosition.y * 1.5 + uTime * 0.6) * 0.5 + 0.5;
    vec3 baseGradient = mix(uColorA, uColorB, colorPhase);
    vec3 spectralRim = mix(baseGradient, uColorC, fresnel);
    
    vec3 finalColor = spectralRim * (innerGlow * 0.6 + fresnel * 1.4 * uIntensity);
    float alpha = clamp(0.18 + fresnel * 0.72, 0.0, 0.95);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function AICoreObject({ tier }: AICoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const plexusPointsRef = useRef<THREE.Points>(null);
  const plexusLinesRef = useRef<THREE.LineSegments>(null);
  const equatorialRingRef = useRef<THREE.Mesh>(null);
  const polarRingRef = useRef<THREE.Mesh>(null);
  const gyroRingRef = useRef<THREE.Mesh>(null);
  const shardsGroupRef = useRef<THREE.Group>(null);

  // Performance-based complexity scaling
  const nodeCount = tier === "full" ? 42 : 22;
  const shardCount = tier === "full" ? 12 : 6;

  // Shader Uniforms
  const holoUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uColorA: { value: new THREE.Color("#042f2e") }, // Obsidian Teal
      uColorB: { value: new THREE.Color("#0ea5e9") }, // Cyber Cyan
      uColorC: { value: new THREE.Color("#a855f7") }, // Quantum Violet
      uIntensity: { value: 1.5 },
    }),
    []
  );

  // 1. Synaptic Plexus: 3D Fibonacci Lattice Nodes and Synaptic Connections
  const { nodePositions, linePositions } = useMemo(() => {
    const positions: number[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const sphereR = 1.45 + (i % 3) * 0.08;
      const x = Math.cos(theta) * radius * sphereR;
      const z = Math.sin(theta) * radius * sphereR;
      const py = y * sphereR;

      positions.push(x, py, z);
    }

    // Connect nodes within proximity threshold to form neural synapses
    const lines: number[] = [];
    const maxDist = tier === "full" ? 0.95 : 1.15;

    for (let i = 0; i < nodeCount; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      for (let j = i + 1; j < nodeCount; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];

        const dist = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
        if (dist < maxDist) {
          lines.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }

    return {
      nodePositions: new Float32Array(positions),
      linePositions: new Float32Array(lines),
    };
  }, [nodeCount, tier]);

  // 2. Quantum Tensor Shards: Orbiting polyhedrons
  const shards = useMemo(() => {
    const list = [];
    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 2.1 + (i % 3) * 0.35;
      const speed = 0.6 + (i % 2) * 0.5;
      const inclination = ((i % 4) - 1.5) * 0.5;
      const scale = 0.06 + (i % 3) * 0.035;
      const color = i % 3 === 0 ? "#2dd4bf" : i % 3 === 1 ? "#38bdf8" : "#c084fc";
      list.push({ angle, radius, speed, inclination, scale, color });
    }
    return list;
  }, [shardCount]);

  // Dynamic frame loop with section morphing & pointer reactions
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || tier === "static") return;

    const t = state.clock.getElapsedTime();

    // Update shader uniforms
    holoUniforms.uTime.value = t;

    // Smooth pointer damping
    const ptr = sceneState.pointer;
    ptr.x = THREE.MathUtils.damp(ptr.x, ptr.targetX, 4, delta);
    ptr.y = THREE.MathUtils.damp(ptr.y, ptr.targetY, 4, delta);

    // Continuous scroll progress and section dynamics
    const activeSec = sceneState.activeSection;
    const progress = sceneState.sectionProgress;
    const velocity = sceneState.scrollVelocity;
    const projectIdx = sceneState.activeProjectIndex;

    // Target spatial parameters per section
    let targetX = 1.7;
    let targetY = 0.0;
    let targetZ = 0.0;
    let targetScale = 1.15;
    let shellSeparation = 0.0;
    let ringTension = 0.0;
    let pulseSpeed = 2.5;

    switch (activeSec) {
      case "hero":
        targetX = 1.7;
        targetY = 0.0;
        targetZ = 0.0;
        targetScale = 1.2;
        shellSeparation = 0.0;
        ringTension = 0.0;
        pulseSpeed = 2.4;
        break;

      case "about":
        targetX = 2.15;
        targetY = 0.3;
        targetZ = -1.2;
        targetScale = 1.28;
        shellSeparation = 0.32;
        ringTension = 0.4;
        pulseSpeed = 2.8;
        break;

      case "experience":
        targetX = -1.85;
        targetY = -0.2;
        targetZ = -2.0;
        targetScale = 0.98;
        shellSeparation = 0.18;
        ringTension = 0.75;
        pulseSpeed = 2.2;
        break;

      case "projects":
        targetX = 0.0 + (projectIdx - 1) * 0.4;
        targetY = -0.55;
        targetZ = -3.2;
        targetScale = 0.92;
        shellSeparation = 0.12;
        ringTension = 0.95;
        pulseSpeed = 1.9;
        break;

      case "skills":
        targetX = 1.85;
        targetY = -0.2;
        targetZ = -1.5;
        targetScale = 1.08;
        shellSeparation = 0.42;
        ringTension = 0.55;
        pulseSpeed = 3.2;
        break;

      case "contact":
        targetX = 0.0;
        targetY = 0.15;
        targetZ = -1.1;
        targetScale = 1.05;
        shellSeparation = 0.05;
        ringTension = 0.15;
        pulseSpeed = 1.6;
        break;
    }

    targetY += Math.sin(progress * Math.PI) * 0.15;
    targetX += ptr.x * 0.35;
    targetY += ptr.y * 0.25;

    // Smooth position & scale damping
    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.2, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.2, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.2, delta);

    const currentScale = THREE.MathUtils.damp(group.scale.x, targetScale, 3.0, delta);
    group.scale.set(currentScale, currentScale, currentScale);

    // Continuous orbital rotation with scroll velocity injection
    const spinRate = delta * (0.18 + Math.abs(velocity) * 0.00018);
    group.rotation.y += spinRate;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, ptr.y * 0.22, 3, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -ptr.x * 0.16, 3, delta);

    // Dynamic Nucleus Breathing & Chromatic Pulse
    const pulseFactor = Math.sin(t * pulseSpeed) * 0.5 + 0.5;
    holoUniforms.uPulse.value = pulseFactor;

    if (nucleusRef.current) {
      nucleusRef.current.rotation.x += delta * 0.45;
      nucleusRef.current.rotation.y += delta * 0.65;
      const nucScale = 1.0 + Math.sin(t * pulseSpeed * 1.5) * 0.08;
      nucleusRef.current.scale.set(nucScale, nucScale, nucScale);
    }

    // Outer Shell Expansion (Morphing)
    if (coreMeshRef.current) {
      const shellScale = THREE.MathUtils.damp(
        coreMeshRef.current.scale.x,
        1.0 + shellSeparation,
        3.0,
        delta
      );
      coreMeshRef.current.scale.set(shellScale, shellScale, shellScale);
    }

    // Synaptic Plexus Sparkle & Rotation
    if (plexusPointsRef.current) {
      plexusPointsRef.current.rotation.y -= delta * 0.12;
      plexusPointsRef.current.rotation.z += delta * 0.08;
    }
    if (plexusLinesRef.current) {
      plexusLinesRef.current.rotation.y -= delta * 0.12;
      plexusLinesRef.current.rotation.z += delta * 0.08;
    }

    // Tri-Axial Astrolabe Counter-Rotations
    if (equatorialRingRef.current) {
      equatorialRingRef.current.rotation.z += delta * (0.45 + ringTension * 0.3);
      equatorialRingRef.current.rotation.x = Math.sin(t * 0.8) * 0.12;
    }
    if (polarRingRef.current) {
      polarRingRef.current.rotation.x -= delta * (0.38 + ringTension * 0.2);
      polarRingRef.current.rotation.y += delta * 0.25;
    }
    if (gyroRingRef.current) {
      gyroRingRef.current.rotation.y += delta * 0.32;
      gyroRingRef.current.rotation.z -= delta * 0.28;
    }

    // Shards Orbital Inertia
    if (shardsGroupRef.current) {
      shardsGroupRef.current.rotation.y += delta * 0.35;
      shardsGroupRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[1.7, 0, 0]}>
      {/* 1. Hyperdimensional Faceted Crystalline Shell */}
      <mesh ref={coreMeshRef}>
        <dodecahedronGeometry args={[1.32, 0]} />
        <shaderMaterial
          uniforms={holoUniforms}
          vertexShader={HOLO_FRESNEL_VERTEX_SHADER}
          fragmentShader={HOLO_FRESNEL_FRAGMENT_SHADER}
          transparent
          wireframe={tier !== "full"}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Inner Quantum Torus Knot Nucleus */}
      <mesh ref={nucleusRef}>
        <torusKnotGeometry args={[0.42, 0.085, 48, 12, 2, 3]} />
        <meshStandardMaterial
          color="#0f766e"
          emissive="#2dd4bf"
          emissiveIntensity={tier === "full" ? 1.6 : 1.0}
          roughness={0.15}
          metalness={0.88}
          wireframe={tier !== "full"}
        />
      </mesh>

      {/* 3. Interactive Synaptic Plexus (Neural Graph) */}
      <group>
        {/* Nodes (Synaptic Points) */}
        <points ref={plexusPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[nodePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={tier === "full" ? 0.055 : 0.04}
            color="#38bdf8"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Filaments (Synaptic Electrical Lines) */}
        <lineSegments ref={plexusLinesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#14b8a6"
            transparent
            opacity={tier === "full" ? 0.32 : 0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* 4. Tri-Axial Segmented Astrolabe Rings */}
      {/* Equatorial Astrolabe Ring */}
      <mesh ref={equatorialRingRef}>
        <torusGeometry args={[1.92, 0.012, 8, 48]} />
        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Polar Inclination Ring (45 degree golden tilt) */}
      <mesh ref={polarRingRef} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.18, 0.009, 8, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Gyroscopic Telemetry Ring */}
      <mesh ref={gyroRingRef} rotation={[-Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[2.42, 0.007, 8, 48]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Floating Cosmic Tensor Shards */}
      <group ref={shardsGroupRef}>
        {shards.map((shard, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(shard.angle) * shard.radius,
              Math.sin(shard.angle * 2) * shard.inclination,
              Math.sin(shard.angle) * shard.radius,
            ]}
            rotation={[shard.angle, shard.angle * 1.5, 0]}
          >
            <octahedronGeometry args={[shard.scale, 0]} />
            <meshStandardMaterial
              color={shard.color}
              emissive={shard.color}
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
