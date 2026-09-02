"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

interface HeroImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function HeroImmersive({ data, ui }: HeroImmersiveProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex flex-col justify-between pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden"
    >
      <div className="section-inner relative z-10 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Text Column (7 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Role Eyebrow */}
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-none bg-teal-400"
                aria-hidden="true"
              />
              <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-teal-400 font-medium">
                {data.hero.role}
              </p>
            </div>

            {/* Editorial Headline (Wide, restricted to 2 lines on desktop) */}
            <h1 className="font-sans font-extralight tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#f4f6f8] max-w-5xl">
              {data.hero.headline}
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg font-light text-slate-400 leading-relaxed max-w-2xl">
              {data.hero.subhead}
            </p>

            {/* High-Contrast Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all focus-ring-immersive rounded-sm shadow-[0_0_24px_rgba(20,184,166,0.3)]"
              >
                <span>{ui.hero.ctaPrimary}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-7 py-3.5 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-[0.2em] transition-all focus-ring-immersive rounded-sm"
              >
                <span>{ui.hero.ctaSecondary}</span>
              </a>
            </div>
          </div>

          {/* Right Column (Spatial Framing for AI Core) */}
          <div className="hidden lg:block lg:col-span-4 h-full pointer-events-none" />
        </div>
      </div>

      {/* Abstract Signal Rail & Highlights (Real data only) */}
      <div className="section-inner relative z-10 w-full pt-12 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Highlights */}
          <div className="flex flex-wrap items-center gap-3">
            {data.hero.highlights.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-[0.18em] uppercase text-white/70 bg-white/5 border border-white/10 rounded-sm"
              >
                <span
                  className="h-1 w-1 bg-teal-400/80 rounded-full"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </span>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] uppercase text-white/40">
            <span aria-hidden="true">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-3 w-3 text-teal-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
