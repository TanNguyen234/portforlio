"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { usePerformanceMode } from "@/lib/performance";

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    const time = clock.getElapsedTime();

    // Map pointer [-1, 1] to scene coordinates
    const targetX = pointer.x * 12;
    const targetY = pointer.y * 12;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Distance to mouse pointer in 2D space
      const distToMouse = Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
      const mouseForce = Math.max(0, 7 - distToMouse) * 0.45;

      // Compound sine waves for organic terrain flow
      const baseWave =
        Math.sin(x * 0.22 + time * 1.2) * Math.cos(y * 0.18 + time * 1.0) * 0.6 +
        Math.sin(x * 0.08 - y * 0.08 + time * 0.5) * 0.8;

      // Mouse indentation/ripple effect
      const mouseRipple = Math.sin(distToMouse * 0.7 - time * 2.8) * mouseForce * 0.5;

      pos.setZ(i, baseWave + mouseRipple);
    }
    pos.needsUpdate = true;

    // Smooth rotational response to mouse cursor
    meshRef.current.rotation.z = pointer.x * 0.06;
    meshRef.current.rotation.x = -Math.PI / 2.8 + pointer.y * 0.04;
  });

  return (
    <mesh ref={meshRef} position={[0, -2.2, -3]} rotation={[-Math.PI / 2.8, 0, 0]}>
      <planeGeometry args={[28, 28, 55, 55]} />
      <meshStandardMaterial
        wireframe
        color="#7cf4ff"
        transparent
        opacity={0.16}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function FloatingParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1200;

  const [positions, initialPositions] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const initPosArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12 - 2;

      posArr[i * 3] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;

      initPosArr[i * 3] = x;
      initPosArr[i * 3 + 1] = y;
      initPosArr[i * 3 + 2] = z;
    }
    return [posArr, initPosArr];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const time = clock.getElapsedTime();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    pointsRef.current.rotation.y = time * 0.01 + pointer.x * 0.04;
    pointsRef.current.rotation.x = pointer.y * 0.02;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const initX = initialPositions[idx];
      const initY = initialPositions[idx + 1];

      // Subtle atmospheric drift
      const xOffset = Math.sin(time * 0.12 + initY) * 0.25;
      const yOffset = Math.cos(time * 0.16 + initX) * 0.25 - scrollY * 0.0018;

      posAttr.setX(i, initX + xOffset);
      posAttr.setY(i, initY + yOffset);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#7cffc2"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function InteractiveLights() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ pointer }) => {
    if (!lightRef.current) return;
    // Primary spotlight follows pointer dynamically
    lightRef.current.position.x = pointer.x * 12;
    lightRef.current.position.y = pointer.y * 8;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight ref={lightRef} position={[0, 0, 4]} intensity={2.0} color="#7cf4ff" />
      <pointLight position={[8, 5, -3]} intensity={1.5} color="#7cffc2" />
      <pointLight position={[-8, -5, -3]} intensity={1.2} color="#ffb869" />
    </>
  );
}

export default function BlocksBackdrop() {
  const { isLowEnd } = usePerformanceMode();

  if (isLowEnd) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-75">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.4]}>
        <InteractiveLights />
        <WaveGrid />
        <FloatingParticleField />
      </Canvas>
    </div>
  );
}
