export type VisualMode = "legacy" | "immersive";
export type GraphicsTier = "full" | "reduced" | "static";

export interface VisualModeState {
  mode: VisualMode;
  graphicsTier: GraphicsTier;
  isImmersive: boolean;
  webglAvailable: boolean;
}

/**
 * Returns the default visual mode based on environment variables.
 * Priority: NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE -> "legacy"
 */
export function getDefaultVisualMode(): VisualMode {
  const envMode = process.env.NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE?.trim().toLowerCase();
  if (envMode === "immersive") {
    return "immersive";
  }
  return "legacy";
}

/**
 * Validates and parses a query parameter override for visual mode.
 */
export function parseVisualModeParam(value: string | null | undefined): VisualMode | null {
  if (!value) return null;
  const clean = value.trim().toLowerCase();
  if (clean === "immersive" || clean === "legacy") {
    return clean;
  }
  return null;
}

/**
 * Robust, lightweight WebGL capability check with fail-closed safety.
 */
export function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: false });
    
    if (gl && (gl instanceof WebGLRenderingContext || (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext))) {
      const loseExt = gl.getExtension("WEBGL_lose_context");
      if (loseExt) {
        loseExt.loseContext();
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Detects appropriate graphics performance tier.
 * HIGH -> "full" (DPR <= 1.5)
 * MEDIUM -> "reduced" (DPR <= 1.25)
 * LOW -> "static" (DPR <= 1.0)
 */
export function detectGraphicsTier(webglAvailable: boolean): GraphicsTier {
  if (typeof window === "undefined" || !webglAvailable) {
    return "static";
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return "static";
  }

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (isSmallScreen || isTouch || cores <= 2 || memory <= 2) {
    return "reduced";
  }

  if (cores >= 6 && memory >= 4) {
    return "full";
  }

  return "reduced";
}
