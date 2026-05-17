"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { usePerformanceMode } from "@/lib/performance";

const createBlocks = (count: number) => {
  return Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
    ] as [number, number, number],
    scale: 0.25 + Math.random() * 0.6,
    speed: 0.4 + Math.random() * 0.6,
  }));
};

function FloatingBlocks() {
  const groupRef = useRef<Group>(null);
  const blocks = useMemo(() => createBlocks(18), []);

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.06;
    groupRef.current.rotation.x = mouse.y * 0.08;
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, index) => (
        <Float
          key={`block-${index}`}
          speed={block.speed}
          floatIntensity={0.8}
          rotationIntensity={0.6}
        >
          <mesh position={block.position} scale={block.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#7cf4ff"
              emissive="#2cc4d7"
              emissiveIntensity={0.25}
              roughness={0.2}
              metalness={0.7}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function BlocksBackdrop() {
  const { isLowEnd } = usePerformanceMode();

  if (isLowEnd) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.4]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 6]} intensity={1.2} color="#7cffc2" />
        <pointLight position={[-6, -4, 4]} intensity={0.8} color="#ffb869" />
        <FloatingBlocks />
      </Canvas>
    </div>
  );
}
