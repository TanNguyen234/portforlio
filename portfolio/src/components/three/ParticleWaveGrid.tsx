"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { usePerformanceMode } from "@/lib/performance";

function WaveGridPoints() {
  const pointsRef = useRef<THREE.Points>(null);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Grid dimensions
  const gridWidth = 70;
  const gridHeight = 70;
  const spacing = 0.45;
  const count = gridWidth * gridHeight;

  // Cache positions
  const [positions, initialCoords] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const coords = [];
    
    let index = 0;
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        const x = (i - gridWidth / 2) * spacing;
        const y = (j - gridHeight / 2) * spacing;
        pos[index * 3] = x;
        pos[index * 3 + 1] = y;
        pos[index * 3 + 2] = 0;
        
        coords.push({ i, j, x, y });
        index++;
      }
    }
    return [pos, coords];
  }, [count, gridWidth, gridHeight, spacing]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();

    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    
    const rootStyle = typeof document !== "undefined" ? document.documentElement.style : null;
    const waveAmp = parseFloat(rootStyle?.getPropertyValue("--cb-wave-amp") || "0.35");
    const waveFreq = parseFloat(rootStyle?.getPropertyValue("--cb-wave-freq") || "0.25");
    const waveSpeed = parseFloat(rootStyle?.getPropertyValue("--cb-wave-speed") || "1.2");

    for (let index = 0; index < count; index++) {
      const coord = initialCoords[index];
      const distFromCenter = Math.hypot(coord.x, coord.y);
      const z = Math.sin(distFromCenter * waveFreq - time * waveSpeed) * waveAmp;
      posAttr.setZ(index, z);
    }
    posAttr.needsUpdate = true;

    // Gentle rotate
    pointsRef.current.rotation.z = time * 0.012;

    // Color sync
    const targetColorStr = rootStyle?.getPropertyValue("--accent-current")?.trim() || "#00f0ff";
    tempColor.set(targetColorStr);
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (mat && mat.color) {
      mat.color.lerp(tempColor, 0.04);
    }
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
        size={0.04}
        color="#00f0ff"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GridCameraController() {
  useFrame(({ camera, pointer }) => {
    const rootStyle = typeof document !== "undefined" ? document.documentElement.style : null;
    const targetCamZ = parseFloat(rootStyle?.getPropertyValue("--cb-cam-z") || "8.0");
    const targetRotX = parseFloat(rootStyle?.getPropertyValue("--cb-cam-rot-x") || "-0.65");

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -2.4, 0.04);

    // Tilt camera based on pointer hover
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX + pointer.y * 0.12, 0.04);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, pointer.x * 0.12, 0.04);
  });
  return null;
}

export default function ParticleWaveGrid() {
  const { isLowEnd, reduceMotion } = usePerformanceMode();

  useEffect(() => {
    if (isLowEnd || reduceMotion) return;

    const root = document.documentElement;

    root.style.setProperty("--cb-wave-amp", "0.35");
    root.style.setProperty("--cb-wave-freq", "0.25");
    root.style.setProperty("--cb-wave-speed", "1.2");
    root.style.setProperty("--cb-cam-z", "8.0");
    root.style.setProperty("--cb-cam-rot-x", "-0.65");

    const triggers: ScrollTrigger[] = [];

    const sectionConfigs = [
      { trigger: "#hero", amp: 0.45, freq: 0.22, speed: 1.4, camZ: 7.2, rotX: -0.7 },
      { trigger: "#about", amp: 0.28, freq: 0.32, speed: 0.9, camZ: 8.6, rotX: -0.55 },
      { trigger: "#experience", amp: 0.42, freq: 0.26, speed: 1.3, camZ: 7.6, rotX: -0.75 },
      { trigger: "#projects", amp: 0.18, freq: 0.4, speed: 0.6, camZ: 9.0, rotX: -0.5 },
      { trigger: "#skills", amp: 0.32, freq: 0.3, speed: 1.1, camZ: 8.0, rotX: -0.65 },
      { trigger: "#contact", amp: 0.48, freq: 0.2, speed: 1.5, camZ: 6.8, rotX: -0.8 },
    ];

    sectionConfigs.forEach((cfg) => {
      const el = document.querySelector(cfg.trigger);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: cfg.trigger,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(root, {
              "--cb-wave-amp": cfg.amp,
              "--cb-wave-freq": cfg.freq,
              "--cb-wave-speed": cfg.speed,
              "--cb-cam-z": cfg.camZ,
              "--cb-cam-rot-x": cfg.rotX,
              duration: 1.2,
              ease: "power2.out",
            });
          }
        },
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, [isLowEnd, reduceMotion]);

  if (isLowEnd || reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-35">
      <Canvas
        camera={{ position: [0, -2.4, 8], fov: 60 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <WaveGridPoints />
        <GridCameraController />
      </Canvas>
    </div>
  );
}
