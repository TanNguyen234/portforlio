/**
 * Shared continuous transition state for the immersive Three.js scene.
 * Updated via Lenis/ScrollTrigger and pointer events WITHOUT triggering React re-renders.
 */

export type SectionKey = "hero" | "about" | "experience" | "projects" | "skills" | "contact";

export interface SceneState {
  globalScroll: number;      // 0 to 1
  scrollVelocity: number;    // signed velocity
  activeSection: SectionKey;
  sectionProgress: number;   // 0 to 1 within active section
  activeProjectIndex: number;
  pointer: {
    x: number;               // -1 to 1 normalized
    y: number;               // -1 to 1 normalized
    targetX: number;
    targetY: number;
  };
}

export const sceneState: SceneState = {
  globalScroll: 0,
  scrollVelocity: 0,
  activeSection: "hero",
  sectionProgress: 0,
  activeProjectIndex: 0,
  pointer: {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  },
};

export function setActiveProjectIndex(index: number) {
  sceneState.activeProjectIndex = index;
}

export function updateSectionMeasurement(section: SectionKey, progress: number) {
  sceneState.activeSection = section;
  sceneState.sectionProgress = Math.max(0, Math.min(1, progress));
}

/**
 * Section anchor offsets cached for fast continuous interpolation.
 */
const SECTIONS: { id: SectionKey; targetFraction: number }[] = [
  { id: "hero", targetFraction: 0.0 },
  { id: "about", targetFraction: 0.18 },
  { id: "experience", targetFraction: 0.38 },
  { id: "projects", targetFraction: 0.58 },
  { id: "skills", targetFraction: 0.80 },
  { id: "contact", targetFraction: 1.0 },
];

/**
 * Updates global scroll and derives continuous section progress.
 */
export function updateScrollProgress(scrollFraction: number, velocity: number = 0) {
  const clamped = Math.max(0, Math.min(1, scrollFraction));
  sceneState.globalScroll = clamped;
  sceneState.scrollVelocity = velocity;

  // Determine active section and localized section progress
  for (let i = 0; i < SECTIONS.length - 1; i++) {
    const current = SECTIONS[i];
    const next = SECTIONS[i + 1];
    if (clamped >= current.targetFraction && clamped <= next.targetFraction) {
      sceneState.activeSection = current.id;
      const span = next.targetFraction - current.targetFraction;
      sceneState.sectionProgress = span > 0 ? (clamped - current.targetFraction) / span : 0;
      return;
    }
  }

  // At the very bottom
  sceneState.activeSection = "contact";
  sceneState.sectionProgress = 1;
}

/**
 * Updates pointer target without React state.
 */
export function updatePointerTarget(clientX: number, clientY: number, innerWidth: number, innerHeight: number) {
  sceneState.pointer.targetX = (clientX / innerWidth - 0.5) * 2;
  sceneState.pointer.targetY = -(clientY / innerHeight - 0.5) * 2;
}
