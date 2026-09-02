# Immersive UI Architecture & Visual Mode Documentation

This document describes the technical design, configuration, scene structure, performance safeguards, and rollback methods for the reversible Three.js immersive visual skin.

---

## 1. System Architecture

The portfolio implements a reversible dual-mode presentation architecture:

```
[User Request / Prerender]
         │
         ▼
[VisualModeProvider] (Suspense-isolated query listener + env resolver)
         │
         ├── mode: "legacy"
         │     ├── Looping ambient MP4 video background (/background.mp4)
         │     ├── Soft grain noise overlay
         │     └── Original CSS design tokens
         │
         └── mode: "immersive"
               ├── HTML: [data-visual-mode="immersive"] design tokens
               ├── DOM: Enhanced specular card borders & subtle perspective
               └── WebGL: GlobalThreeCanvas (next/dynamic, ssr: false, z-index: 0, pointer-events: none)
                     │
                     ├── WebGLErrorBoundary (fail-closed, degrades to static CSS ambient)
                     ├── SceneCameraController (continuous track & pointer parallax)
                     ├── AICoreObject (procedural mathematical icosahedron + Fresnel shader)
                     └── SpatialField (sparse spatial constellation, non-generic)
```

---

## 2. Visual Mode Configuration & Switching

### Configuration Priority
1. Valid URL search parameter: `?visual=immersive` or `?visual=legacy`
2. Environment variable: `NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE`
3. Fallback default: `legacy`

### Methods to Switch Modes

#### A. Interactive Development / QA Override
Append the query parameter to the URL in your browser:
* **Switch to Immersive**: `http://localhost:3000/?visual=immersive`
* **Switch to Legacy**: `http://localhost:3000/?visual=legacy`

This parameter switches modes instantly in client runtime without requiring rebuilds or restarts.

#### B. Environment Variable (Deployment Default)
Set the variable in `.env` or your hosting platform (Vercel, Cloudflare, Docker):
```bash
# Enable immersive mode by default
NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE=immersive

# Or enforce legacy mode by default
NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE=legacy
```

---

## 3. Graphics Tiers & Capability Separation

Visual identity is decoupled from WebGL capability. If WebGL fails or is disabled, the site retains the dark graphite immersive tokens and smoothly falls back to a CSS ambient gradient without reverting the whole layout to legacy.

* **HIGH (`full`)**:
  - Target: Desktop with capable GPU and high concurrency.
  - Device Pixel Ratio: clamped to `Math.min(window.devicePixelRatio, 1.5)`.
  - Full procedural core detail, Fresnel refraction, and 160 spatial particles.
* **MEDIUM (`reduced`)**:
  - Target: Laptops, touch devices, or mobile screens (`< 768px`).
  - Device Pixel Ratio: clamped to `1.25`.
  - Reduced geometric subdivisions and 70 spatial particles.
* **LOW / STATIC (`static`)**:
  - Target: Devices with `prefers-reduced-motion`, weak memory/CPU, or WebGL context failure.
  - WebGL canvas unmounts or halts animation loops; renders an ultra-lightweight CSS ambient backdrop.

---

## 4. Three.js Scene Structure

All 3D logic is located in `portfolio/src/components/three/immersive/`:

1. **`GlobalThreeCanvas.tsx`**:
   - Manages R3F Canvas lifecycle, WebGL error boundary, camera defaults, and global light sources.
   - Fixed background position (`fixed inset-0 pointer-events-none z-0`) ensures HTML DOM remains in the foreground and completely selectable.
2. **`AICoreObject.tsx`**:
   - Central procedural mathematical object.
   - Distorted faceted icosahedron shell with a custom GLSL Fresnel vertex/fragment shader.
   - Inner pulsating intelligence sphere with dynamic emissive material.
   - Concentric orbital rings with asynchronous counter-rotation.
   - Color palette: Deep graphite (`#05080a`), cyan-teal (`#14b8a6`), and subtle emerald telemetry (`#10b981`). Zero AI-purple/pink gradients.
3. **`SpatialField.tsx`**:
   - Sparse, spatially distributed particle constellation.
   - Avoids generic dense dot-and-line networks.
4. **`SceneCameraController.tsx`**:
   - Interpolates camera position and orientation continuously across scroll depth.
5. **`sceneState.ts`**:
   - Mutable global state tracking `globalScroll`, `scrollVelocity`, `activeSection`, `sectionProgress`, and `pointer`.
   - Never drives animations via React `setState`, eliminating frame drops.

---

## 5. Performance Decisions & Guardrails

* **Zero Per-Frame React State**: High-frequency updates run directly inside R3F `useFrame` via linear interpolation (`THREE.MathUtils.damp`).
* **Single Lenis Instance**: Reuses the root Lenis smooth-scroll instance in `ClientProviders.tsx`. No competing RAF loops or duplicated GSAP tickers.
* **Dynamic Code Splitting**: Loaded via `next/dynamic` (`ssr: false`). In legacy mode, Three.js chunk is not loaded or executed.
* **Non-Blocking Canvas**: `pointer-events: none` on the canvas wrapper guarantees zero click latency or event blocking for HTML buttons, links, and forms.
* **Resource Disposal**: Materials and geometries explicitly invoke `.dispose()` on component unmount to prevent GPU memory accumulation.

---

## 6. Disabling or Removing Immersive UI

### Temporary Disable
Set the environment variable:
```bash
NEXT_PUBLIC_PORTFOLIO_VISUAL_MODE=legacy
```
Or append `?visual=legacy` to any URL.

### Permanent Removal (Zero Risk)
1. In `portfolio/src/components/pages/HomePage.tsx`, delete the `<GlobalThreeCanvas />` branch and keep only the original legacy video wrapper.
2. In `portfolio/src/components/providers/ClientProviders.tsx`, remove `<VisualModeProvider>`.
3. Delete the directory `portfolio/src/components/three/immersive/` and `portfolio/src/lib/visualMode.ts`.
4. The core portfolio remains 100% intact with its original behavior and styles.
