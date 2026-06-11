"use client";

import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";

// Custom shader creates the cinematic aurora backdrop without external textures.
const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#050014"),
    uColor2: new THREE.Color("#3b0066"),
    uColor3: new THREE.Color("#ff007f"),
    uIntensity: 1.1,
  },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `varying vec2 vUv;
   uniform float uTime;
   uniform vec3 uColor1;
   uniform vec3 uColor2;
   uniform vec3 uColor3;
   uniform float uIntensity;

   float wave(vec2 p) {
     return sin(p.x * 6.0 + uTime * 0.4) * 0.12 + cos(p.y * 7.0 - uTime * 0.35) * 0.12;
   }

   void main() {
     vec2 uv = vUv;
     float w = wave(uv * 1.5);
     vec3 base = mix(uColor1, uColor2, uv.x + w);
     vec3 glow = mix(base, uColor3, uv.y + w * 0.6);
     float vignette = smoothstep(1.2, 0.4, distance(uv, vec2(0.5)));
     gl_FragColor = vec4(glow * (uIntensity + vignette * 0.8), 1.0);
   }`
);

extend({ AuroraMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraMaterial: ThreeElement<typeof AuroraMaterial>;
  }
}

function AuroraPlane() {
  const materialRef = useRef<InstanceType<typeof AuroraMaterial> | null>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -6]} scale={[12, 8, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <auroraMaterial ref={materialRef} />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 380;
    const array = new Float32Array(count * 3);
    const pseudoRandom = (seed: number) => {
      const value = Math.sin(seed) * 10000;
      return value - Math.floor(value);
    };
    for (let i = 0; i < count; i += 1) {
      const base = i + 1;
      array[i * 3] = (pseudoRandom(base * 1.23) - 0.5) * 10;
      array[i * 3 + 1] = (pseudoRandom(base * 4.56) - 0.5) * 6;
      array[i * 3 + 2] = (pseudoRandom(base * 7.89) - 0.5) * 6;
    }
    return array;
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    pointsRef.current.rotation.x = 0;
    pointsRef.current.position.x = mouse.x * 0.2;
    pointsRef.current.position.y = mouse.y * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ff007f" opacity={0.65} transparent />
    </points>
  );
}

function Spacecraft3D() {
  const spacecraftRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, mouse }) => {
    if (!spacecraftRef.current) return;

    // Organic micro-floating motion
    const floatOffset = Math.sin(clock.getElapsedTime() * 1.8) * 0.08;

    // Flight paths linked to scroll position
    let xBase = 1.6;
    let yBase = 0.05;
    let zBase = 0;
    let scaleBase = 1.25;

    // Default Euler rotation angles
    let pitch = 0;
    let yaw = -0.3; // facing slightly left
    let roll = 0;

    if (scrollProgress < 0.25) {
      // Hero to About section
      const t = scrollProgress / 0.25;
      xBase = THREE.MathUtils.lerp(1.6, -1.8, t);
      yBase = THREE.MathUtils.lerp(0.05, -1.6, t);
      zBase = THREE.MathUtils.lerp(0, -1.2, t);
      scaleBase = THREE.MathUtils.lerp(1.25, 1.9, t);

      roll = THREE.MathUtils.lerp(0, -0.65, t); // Bank left
      pitch = THREE.MathUtils.lerp(0, 0.35, t);  // Nose up
      yaw = THREE.MathUtils.lerp(-0.3, 0.7, t);
    } else if (scrollProgress < 0.6) {
      // About to Experience
      const t = (scrollProgress - 0.25) / 0.35;
      xBase = THREE.MathUtils.lerp(-1.8, 1.8, t);
      yBase = THREE.MathUtils.lerp(-1.6, -3.2, t);
      zBase = THREE.MathUtils.lerp(-1.2, 0.6, t);
      scaleBase = THREE.MathUtils.lerp(1.9, 1.4, t);

      roll = THREE.MathUtils.lerp(-0.65, 0.85, t); // Bank right
      pitch = THREE.MathUtils.lerp(0.35, -0.3, t); // Nose down
      yaw = THREE.MathUtils.lerp(0.7, -0.6, t);
    } else {
      // Experience to Projects and Contact
      const t = (scrollProgress - 0.6) / 0.4;
      xBase = THREE.MathUtils.lerp(1.8, 0, t);
      yBase = THREE.MathUtils.lerp(-3.2, -5.6, t);
      zBase = THREE.MathUtils.lerp(0.6, 2.8, t); // Zooming right past camera!
      scaleBase = THREE.MathUtils.lerp(1.4, 2.6, t);

      roll = THREE.MathUtils.lerp(0.85, 0, t);
      pitch = THREE.MathUtils.lerp(-0.3, 0.25, t);
      yaw = THREE.MathUtils.lerp(-0.6, 0.25, t);
    }

    // Mouse Parallax micro-inertia
    const mouseX = mouse.x * 0.7;
    const mouseY = mouse.y * 0.45;

    targetPos.set(xBase + mouseX, yBase + mouseY + floatOffset, zBase);
    spacecraftRef.current.position.lerp(targetPos, 0.08);

    // Apply rotation transforms (adding responsive tilt from mouse coordinates)
    const targetPitch = pitch + mouse.y * -0.15;
    const targetYaw = yaw + mouse.x * 0.15;
    const targetRoll = roll + mouse.x * -0.25;

    spacecraftRef.current.rotation.x = THREE.MathUtils.lerp(spacecraftRef.current.rotation.x, targetPitch, 0.08);
    spacecraftRef.current.rotation.y = THREE.MathUtils.lerp(spacecraftRef.current.rotation.y, targetYaw, 0.08);
    spacecraftRef.current.rotation.z = THREE.MathUtils.lerp(spacecraftRef.current.rotation.z, targetRoll, 0.08);

    // Lerp Scale scalar
    const currentScale = spacecraftRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, scaleBase, 0.08);
    spacecraftRef.current.scale.setScalar(nextScale);

    // Spin radar coordinates rings
    if (ringRef1.current) {
      ringRef1.current.rotation.z = clock.getElapsedTime() * 0.55;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y = clock.getElapsedTime() * -0.35;
    }
  });

  return (
    <group ref={spacecraftRef}>
      {/* Fuselage Sleek Cone (Main Body) */}
      <mesh>
        <coneGeometry args={[0.18, 1.8, 8]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.95}
          wireframe
        />
      </mesh>

      {/* Cockpit Glowing Canopy (Solid Ruby Glass) */}
      <mesh position={[0, 0.12, 0.22]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={1.3}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>

      {/* Swept Wing Left */}
      <group position={[-0.08, -0.04, -0.15]} rotation={[0, -0.25, -0.1]}>
        <mesh>
          <boxGeometry args={[1.2, 0.02, 0.45]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            wireframe
          />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.03, 0.06, 0.35]} />
          <meshBasicMaterial color="#39ff14" />
        </mesh>
      </group>

      {/* Swept Wing Right */}
      <group position={[0.08, -0.04, -0.15]} rotation={[0, 0.25, 0.1]}>
        <mesh>
          <boxGeometry args={[1.2, 0.02, 0.45]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            wireframe
          />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.03, 0.06, 0.35]} />
          <meshBasicMaterial color="#39ff14" />
        </mesh>
      </group>

      {/* Tail Fin Left */}
      <mesh position={[-0.14, 0.26, -0.6]} rotation={[0.18, 0.08, -0.25]}>
        <boxGeometry args={[0.02, 0.42, 0.25]} />
        <meshStandardMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Tail Fin Right */}
      <mesh position={[0.14, 0.26, -0.6]} rotation={[0.18, -0.08, 0.25]}>
        <boxGeometry args={[0.02, 0.42, 0.25]} />
        <meshStandardMaterial color="#00f0ff" wireframe />
      </mesh>

      {/* Left Thruster & Glowing Exhaust Plasma Flame */}
      <group position={[-0.09, -0.05, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 8]} />
          <meshStandardMaterial color="#ffe600" roughness={0.15} metalness={0.9} wireframe />
        </mesh>
        <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
      </group>

      {/* Right Thruster & Glowing Exhaust Plasma Flame */}
      <group position={[0.09, -0.05, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.25, 8]} />
          <meshStandardMaterial color="#ffe600" roughness={0.15} metalness={0.9} wireframe />
        </mesh>
        <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
      </group>


      {/* Holographic Concentric Radar Ring 1 */}
      <mesh ref={ringRef1} rotation={[Math.PI / 2, 0.15, 0]}>
        <torusGeometry args={[1.2, 0.012, 8, 48]} />
        <meshBasicMaterial color="#ffe600" opacity={0.2} transparent />
      </mesh>

      {/* Holographic Concentric Radar Ring 2 */}
      <mesh ref={ringRef2} rotation={[0, Math.PI / 2, 0.25]}>
        <torusGeometry args={[1.3, 0.008, 8, 48]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.2} transparent />
      </mesh>
    </group>
  );
}

function CameraController() {
  useFrame(({ camera }) => {
    camera.position.z = 6;
    camera.position.y = 0;
    camera.rotation.x = 0;
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 2, 6]} intensity={1.6} color="#00f0ff" />
      <pointLight position={[-6, -2, 3]} intensity={1.2} color="#ff007f" />
      <CameraController />
      <AuroraPlane />
      <ParticleField />
      <Spacecraft3D />
    </Canvas>
  );
}
