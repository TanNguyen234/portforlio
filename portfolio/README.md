## Nguyen Thanh Duy Tan - Cinematic Portfolio

This project is a Next.js App Router experience designed as a premium, cinematic AI engineer portfolio. It uses Framer Motion, Three.js (React Three Fiber), GSAP, and Lenis for advanced motion and interaction.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the experience.

## Key Notes

- The 3D WebGL scenes are disabled automatically on low-end devices or when reduced motion is preferred.
- Scroll velocity and cursor trail effects can be tuned inside `src/components/effects`.
- All content is sourced and rewritten from the CV in `src/lib/portfolio.ts`.
- Open `/admin` for the local admin dashboard (stored in LocalStorage).

## Production Build

```bash
pnpm build
pnpm start
```
