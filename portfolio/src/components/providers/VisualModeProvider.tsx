"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  type VisualMode,
  type GraphicsTier,
  getDefaultVisualMode,
  parseVisualModeParam,
  checkWebGLSupport,
  detectGraphicsTier,
} from "@/lib/visualMode";

interface VisualModeContextValue {
  mode: VisualMode;
  setMode: (mode: VisualMode) => void;
  graphicsTier: GraphicsTier;
  setGraphicsTier: (tier: GraphicsTier) => void;
  isImmersive: boolean;
  webglAvailable: boolean;
}

const VisualModeContext = createContext<VisualModeContextValue | null>(null);

function getInitialClientMode(): VisualMode {
  const defaultMode = getDefaultVisualMode();
  if (typeof window === "undefined") return defaultMode;

  try {
    const params = new URLSearchParams(window.location.search);
    const queryOverride = parseVisualModeParam(params.get("visual"));
    if (queryOverride) {
      return queryOverride;
    }
  } catch {
    // Fall back safely to default mode
  }
  return defaultMode;
}

/**
 * Isolated Suspense leaf to synchronize Next.js router query param changes
 * without de-opting the entire page from static rendering.
 */
function VisualQuerySync({ onParamChange }: { onParamChange: (mode: VisualMode) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryVal = searchParams.get("visual");
    const parsed = parseVisualModeParam(queryVal);
    if (parsed) {
      onParamChange(parsed);
    }
  }, [searchParams, onParamChange]);

  return null;
}

export function VisualModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<VisualMode>(getInitialClientMode);
  const [webglAvailable] = useState<boolean>(() => checkWebGLSupport());
  const [graphicsTier, setGraphicsTier] = useState<GraphicsTier>(() =>
    detectGraphicsTier(checkWebGLSupport())
  );

  // Update HTML data attributes whenever mode or tier updates
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-visual-mode", mode);
      document.documentElement.setAttribute("data-graphics-tier", graphicsTier);
    }
  }, [mode, graphicsTier]);

  const isImmersive = mode === "immersive";

  const value = useMemo(
    () => ({
      mode,
      setMode,
      graphicsTier,
      setGraphicsTier,
      isImmersive,
      webglAvailable,
    }),
    [mode, graphicsTier, isImmersive, webglAvailable]
  );

  return (
    <VisualModeContext.Provider value={value}>
      <Suspense fallback={null}>
        <VisualQuerySync onParamChange={setMode} />
      </Suspense>
      {children}
    </VisualModeContext.Provider>
  );
}

export function useVisualMode() {
  const ctx = useContext(VisualModeContext);
  if (!ctx) {
    throw new Error("useVisualMode must be used within a VisualModeProvider");
  }
  return ctx;
}
