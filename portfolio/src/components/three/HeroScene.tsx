"use client";

import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { Float, shaderMaterial } from "@react-three/drei";
import { Color, Mesh, Points, Vector3 } from "three";
import { useMemo, useRef } from "react";

// Custom shader creates the cinematic aurora backdrop without external textures.
const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new Color("#0b1e2d"),
    uColor2: new Color("#102a3a"),
    uColor3: new Color("#173f48"),
    uIntensity: 0.9,
  },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   uniform vec3 uColor1;
   uniform vec3 uColor2;
   uniform vec3 uColor3;
   uniform float uIntensity;
   varying vec2 vUv;

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
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const count = 420;
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
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    pointsRef.current.position.x = mouse.x * 0.3;
    pointsRef.current.position.y = mouse.y * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7cf4ff" opacity={0.6} transparent />
    </points>
  );
}

function FloatingOrbs() {
  const orb = useRef<Mesh>(null);
  const target = new Vector3();

  useFrame(({ clock, mouse }) => {
    if (!orb.current) return;
    target.set(mouse.x * 0.8, mouse.y * 0.4, 0);
    orb.current.position.lerp(target, 0.05);
    orb.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={1.3} floatIntensity={1.4} rotationIntensity={0.6}>
      <mesh ref={orb} position={[1.4, 0.2, 0]}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial
          color="#7cffc2"
          emissive="#5debd6"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 2, 6]} intensity={1.2} color="#7cf4ff" />
      <pointLight position={[-6, -2, 3]} intensity={0.8} color="#ffb869" />
      <AuroraPlane />
      <ParticleField />
      <FloatingOrbs />
    </Canvas>
  );
}
