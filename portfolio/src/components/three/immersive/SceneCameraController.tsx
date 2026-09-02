import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";
import type { GraphicsTier } from "@/lib/visualMode";

interface CameraProps {
  tier: GraphicsTier;
}

export function SceneCameraController({ tier }: CameraProps) {
  const targetPosRef = useRef(new THREE.Vector3(0, 0, 7.5));
  const lookTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (tier === "static") return;

    const targetPos = targetPosRef.current;
    const lookTarget = lookTargetRef.current;

    const scroll = sceneState.globalScroll;
    const ptr = sceneState.pointer;

    // Smooth camera track across continuous scroll
    if (scroll < 0.25) {
      // Hero to About
      const p = scroll / 0.25;
      targetPos.set(
        THREE.MathUtils.lerp(0, -0.4, p),
        THREE.MathUtils.lerp(0, 0.2, p),
        THREE.MathUtils.lerp(7.5, 7.0, p)
      );
      lookTarget.set(THREE.MathUtils.lerp(0.5, 0.8, p), 0, 0);
    } else if (scroll < 0.55) {
      // About to Experience
      const p = (scroll - 0.25) / 0.3;
      targetPos.set(
        THREE.MathUtils.lerp(-0.4, 0.3, p),
        THREE.MathUtils.lerp(0.2, -0.3, p),
        THREE.MathUtils.lerp(7.0, 7.2, p)
      );
      lookTarget.set(THREE.MathUtils.lerp(0.8, -0.5, p), 0, 0);
    } else if (scroll < 0.8) {
      // Experience to Projects
      const p = (scroll - 0.55) / 0.25;
      targetPos.set(
        THREE.MathUtils.lerp(0.3, 0, p),
        THREE.MathUtils.lerp(-0.3, -0.4, p),
        THREE.MathUtils.lerp(7.2, 8.2, p)
      );
      lookTarget.set(THREE.MathUtils.lerp(-0.5, 0, p), 0, 0);
    } else {
      // Skills to Contact
      const p = (scroll - 0.8) / 0.2;
      targetPos.set(0, THREE.MathUtils.lerp(-0.4, 0, p), THREE.MathUtils.lerp(8.2, 7.2, p));
      lookTarget.set(0, 0, 0);
    }

    // Add subtle pointer parallax to camera
    targetPos.x += ptr.x * 0.25;
    targetPos.y += ptr.y * 0.2;

    // Damp camera position and orientation
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetPos.x, 3, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetPos.y, 3, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetPos.z, 3, delta);

    state.camera.lookAt(lookTarget);
  });

  return null;
}
