"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import HeroScene from "@/components/three/HeroScene";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { usePerformanceMode } from "@/lib/performance";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function Hero({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  const { isLowEnd } = usePerformanceMode();
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "--parallax-x", {
      duration: 0.6,
      ease: "power3",
    });
    const yTo = gsap.quickTo(element, "--parallax-y", {
      duration: 0.6,
      ease: "power3",
    });

    const handleMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      xTo(Number(x.toFixed(3)));
      yTo(Number(y.toFixed(3)));
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-accent="#7cf4ff"
      className="relative min-h-[92vh] overflow-hidden border-b border-white/5"
    >
      <div className="absolute inset-0">
        {isLowEnd ? (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(124,244,255,0.15),_transparent_60%)]" />
        ) : (
          <HeroScene />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,10,0.6),rgba(2,5,10,0.9))]" />
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full opacity-50 blur-3xl animated-gradient parallax-layer depth-3 velocity-blur" />

      <div className="section-inner relative z-10 flex min-h-[92vh] flex-col justify-center gap-12 py-32">
        <motion.p
          className="text-xs uppercase tracking-[0.5em] text-white/60"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {data.hero.role}
        </motion.p>

        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl leading-tight text-white">
          <AnimatedText text={data.hero.headline} />
        </h1>

        <motion.p
          className="max-w-2xl text-base md:text-lg text-[color:var(--muted)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        >
          {data.hero.subhead}
        </motion.p>

        <div className="flex flex-wrap gap-4">
          <MagneticButton className="depth-1 parallax-layer" href="#projects">
            {ui.hero.ctaPrimary}
          </MagneticButton>
          <MagneticButton
            className="depth-2 parallax-layer border-white/30 bg-transparent"
            href="#contact"
          >
            {ui.hero.ctaSecondary}
          </MagneticButton>
        </div>

        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
          {data.hero.highlights.map((item, index) => (
            <motion.span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.6 }}
            >
              {item}
            </motion.span>
          ))}
        </div>

        <div className="absolute right-10 top-32 hidden flex-col gap-4 lg:flex">
          {data.techStack.slice(0, 5).map((item, index) => (
            <motion.div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70 shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
