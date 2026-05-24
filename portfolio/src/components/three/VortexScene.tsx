"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { usePerformanceMode } from "@/lib/performance";

function TunnelRings() {
  const groupRef = useRef<THREE.Group>(null);
  const tempColor = useMemo(() => new THREE.Color(), []);
  
  const ringsCount = 18;
  const ringSpacing = 1.6;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();

    // Rotate entire tunnel slowly
    groupRef.current.rotation.z = time * 0.04;

    const rootStyle = typeof document !== "undefined" ? document.documentElement.style : null;
    const targetColorStr = rootStyle?.getPropertyValue("--accent-current")?.trim() || "#00f0ff";
    tempColor.set(targetColorStr);

    groupRef.current.children.forEach((meshChild, index) => {
      const mesh = meshChild as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat && mat.color) {
        mat.color.lerp(tempColor, 0.04);
      }

      // Add gentle breathing scale effect
      const scaleVal = 1 + Math.sin(time * 1.5 + index * 0.4) * 0.05;
      mesh.scale.set(scaleVal, scaleVal, 1);

      // Rotate adjacent rings in opposing directions
      mesh.rotation.z = (index % 2 === 0 ? 1 : -1) * time * 0.08;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: ringsCount }).map((_, index) => {
        const zPos = -index * ringSpacing;
        return (
          <mesh key={index} position={[0, 0, zPos]}>
            <torusGeometry args={[3.2, 0.022, 8, 32]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={Math.max(0.04, 0.35 - (index / ringsCount) * 0.3)}
              wireframe
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingSparks() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const [positions] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 2.6; // Concentric cylinder layout boundaries
      posArr[i * 3] = Math.cos(angle) * radius;
      posArr[i * 3 + 1] = Math.sin(angle) * radius;
      posArr[i * 3 + 2] = -Math.random() * 28;
    }
    return [posArr];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const time = clock.getElapsedTime();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    pointsRef.current.rotation.z = time * 0.02;

    for (let i = 0; i < count; i++) {
      let z = posAttr.getZ(i);
      // Accelerate particle travel speed according to scroll speed
      z += 0.08 + (scrollY * 0.00015);
      if (z > 2) {
        z = -28;
      }
      posAttr.setZ(i, z);
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
        color="#ff007f"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function VortexCameraController() {
  useFrame(({ camera, pointer }) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    
    // Zoom camera forwards inside the cylinder on scroll down
    const targetZ = 1.5 - scrollY * 0.005;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Mouse movement adds viewport shift tilts
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.4;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);

    camera.lookAt(0, 0, camera.position.z - 6);
  });
  return null;
}

export default function VortexScene() {
  const { isLowEnd } = usePerformanceMode();

  if (isLowEnd) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 1.5], fov: 65 }} dpr={[1, 1.4]}>
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#00f0ff" />
        <VortexCameraController />
        <TunnelRings />
        <FloatingSparks />
      </Canvas>
    </div>
  );
}
