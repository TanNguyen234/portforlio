"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { usePerformanceMode } from "@/lib/performance";

const createNodes = (count: number) => {
  const nodes: { position: [number, number, number] }[] = [];
  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = 2.4 + Math.random() * 0.6;
    nodes.push({
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ],
    });
  }
  return nodes;
};

function SkillNodes({ labels }: { labels: string[] }) {
  const groupRef = useRef<Group>(null);
  const nodes = useMemo(() => createNodes(labels.length), [labels.length]);

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    groupRef.current.rotation.x = mouse.y * 0.2;
  });

  return (
    <group ref={groupRef}>
      {labels.map((label, index) => {
        const { position } = nodes[index];
        return (
          <Float
            key={label}
            speed={1.2}
            floatIntensity={0.8}
            rotationIntensity={0.2}
          >
            <mesh position={position}>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshStandardMaterial
                color="#7cf4ff"
                emissive="#4fd6e4"
                emissiveIntensity={0.4}
                roughness={0.3}
              />
              <Html distanceFactor={8} center>
                <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                  {label}
                </span>
              </Html>
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function SkillsScene({
  labels,
  fallbackLabel,
}: {
  labels: string[];
  fallbackLabel: string;
}) {
  const { isLowEnd } = usePerformanceMode();

  if (isLowEnd) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5">
        <p className="text-sm text-white/70">{fallbackLabel}</p>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 5]} intensity={1.1} color="#7cf4ff" />
      <pointLight position={[-3, -2, 4]} intensity={0.8} color="#7cffc2" />
      <SkillNodes labels={labels} />
    </Canvas>
  );
}
