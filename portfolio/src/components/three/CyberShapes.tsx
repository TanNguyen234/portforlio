"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceMode } from "@/lib/performance";

function DraggableMesh({ geomType }: { geomType: "icosahedron" | "octahedron" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });
  const spinVelocity = useRef({ x: 0.012, y: 0.012 });
  const translationVelocity = useRef({ x: 0.004, y: -0.003 });
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ pointer }) => {
    if (!meshRef.current) return;

    if (!isDragging.current) {
      // Rotation spin
      meshRef.current.rotation.x += spinVelocity.current.x;
      meshRef.current.rotation.y += spinVelocity.current.y;

      // Spin friction damping
      spinVelocity.current.x *= 0.96;
      spinVelocity.current.y *= 0.96;

      const baseSpeed = 0.003;
      if (Math.abs(spinVelocity.current.x) < baseSpeed) {
        spinVelocity.current.x = Math.sign(spinVelocity.current.x || 1) * baseSpeed;
      }
      if (Math.abs(spinVelocity.current.y) < baseSpeed) {
        spinVelocity.current.y = Math.sign(spinVelocity.current.y || 1) * baseSpeed;
      }

      // Physics translate motion
      meshRef.current.position.x += translationVelocity.current.x;
      meshRef.current.position.y += translationVelocity.current.y;

      // Bounce off boundaries in canvas viewport space
      const bound = 1.3;
      if (meshRef.current.position.x > bound) {
        meshRef.current.position.x = bound;
        translationVelocity.current.x *= -1;
      } else if (meshRef.current.position.x < -bound) {
        meshRef.current.position.x = -bound;
        translationVelocity.current.x *= -1;
      }

      if (meshRef.current.position.y > bound) {
        meshRef.current.position.y = bound;
        translationVelocity.current.y *= -1;
      } else if (meshRef.current.position.y < -bound) {
        meshRef.current.position.y = -bound;
        translationVelocity.current.y *= -1;
      }

      // Cursor proximity attraction (gravity)
      const mx = pointer.x * 2.2;
      const my = pointer.y * 2.2;
      const dx = mx - meshRef.current.position.x;
      const dy = my - meshRef.current.position.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1.8) {
        translationVelocity.current.x += dx * 0.0015;
        translationVelocity.current.y += dy * 0.0015;
      }

      // Damping translate velocity
      translationVelocity.current.x *= 0.98;
      translationVelocity.current.y *= 0.98;

      // Limit max translation velocity
      const maxVel = 0.022;
      const speed = Math.hypot(translationVelocity.current.x, translationVelocity.current.y);
      if (speed > maxVel) {
        translationVelocity.current.x = (translationVelocity.current.x / speed) * maxVel;
        translationVelocity.current.y = (translationVelocity.current.y / speed) * maxVel;
      }
    } else {
      // Follow the pointer when dragging
      const targetX = pointer.x * 2.2;
      const targetY = pointer.y * 2.2;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.25);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.25);
    }

    // Interactive color sync
    const rootStyle = typeof document !== "undefined" ? document.documentElement.style : null;
    const targetColorStr = rootStyle?.getPropertyValue("--accent-current")?.trim() || "#00f0ff";
    tempColor.set(targetColorStr);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    if (mat && mat.color) {
      mat.color.lerp(tempColor, 0.04);
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !meshRef.current) return;

    const deltaX = e.clientX - previousPointerPosition.current.x;
    const deltaY = e.clientY - previousPointerPosition.current.y;

    meshRef.current.rotation.y += deltaX * 0.01;
    meshRef.current.rotation.x += deltaY * 0.01;

    spinVelocity.current = {
      x: deltaY * 0.006,
      y: deltaX * 0.006,
    };

    // Impart velocity upon drag and release
    translationVelocity.current = {
      x: deltaX * 0.002,
      y: -deltaY * 0.002,
    };

    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {geomType === "icosahedron" ? (
        <icosahedronGeometry args={[1.5, 1]} />
      ) : (
        <octahedronGeometry args={[1.5, 1]} />
      )}
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

export default function CyberShapes() {
  const { isLowEnd } = usePerformanceMode();

  if (isLowEnd) return null;

  return (
    <>
      {/* Left Float Node */}
      <div className="fixed left-6 top-[28vh] z-30 h-28 w-28 select-none pointer-events-auto hidden xl:block cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4.5] }}>
          <ambientLight intensity={0.5} />
          <DraggableMesh geomType="icosahedron" />
        </Canvas>
        <div className="w-full text-center font-mono text-[8px] tracking-widest text-white/30 uppercase mt-2">
          NODE_L3
        </div>
      </div>

      {/* Right Float Node */}
      <div className="fixed right-6 top-[55vh] z-30 h-28 w-28 select-none pointer-events-auto hidden xl:block cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 4.5] }}>
          <ambientLight intensity={0.5} />
          <DraggableMesh geomType="octahedron" />
        </Canvas>
        <div className="w-full text-center font-mono text-[8px] tracking-widest text-white/30 uppercase mt-2">
          NODE_R8
        </div>
      </div>
    </>
  );
}
