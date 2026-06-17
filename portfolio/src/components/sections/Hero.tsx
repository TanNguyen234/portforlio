"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown, Mail, ArrowUpRight, Cpu, Terminal, MapPin } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function Hero({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = heroRef.current;
      if (!element) return;

      // Mouse move parallax
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

      // Entrance animation timeline
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.fromTo(
        ".hero-role",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );
      
      tl.fromTo(
        ".hero-subhead",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
        "-=0.6"
      );

      tl.fromTo(
        ".hero-btn-wrap",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15 },
        "-=0.6"
      );

      tl.fromTo(
        ".hero-highlight",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
        "-=0.5"
      );

      return () => {
        window.removeEventListener("mousemove", handleMove);
      };
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Background gradients overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#020203]/70 to-[#020203] pointer-events-none" />

      <div className="section-inner relative z-10 pt-24 pb-32 md:pt-36 md:pb-48 flex flex-col justify-center gap-10">
        
        {/* Minimal Role Eyebrow */}
        <div className="hero-role opacity-0">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            {data.hero.role}
          </span>
        </div>

        {/* Clean large headline restricted to max-w-4xl (approx 2 lines) */}
        <h1 className="font-sans font-extralight tracking-tight text-4xl sm:text-6xl md:text-7xl leading-[1.1] text-white max-w-4xl selection:bg-teal-500/20">
          <AnimatedText text={data.hero.headline} />
        </h1>

        {/* Technical Subhead */}
        <p className="hero-subhead max-w-2xl text-base md:text-lg font-light text-white/60 leading-relaxed opacity-0">
          {data.hero.subhead}
        </p>

        {/* High-End Pill CTA Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="hero-btn-wrap opacity-0">
            <MagneticButton 
              className="arrow-hover-trigger flex items-center gap-3 px-6 py-3 border border-white/10 bg-white/10 hover:bg-white/15 rounded-full transition-all text-[11px] uppercase font-mono tracking-[0.25em] text-white shadow-lg" 
              href="#projects"
            >
              <span>{ui.hero.ctaPrimary}</span>
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 border border-white/20">
                <ArrowUpRight className="arrow-icon h-3.5 w-3.5 text-white" />
              </div>
            </MagneticButton>
          </div>
          <div className="hero-btn-wrap opacity-0">
            <MagneticButton
              className="flex items-center gap-3 px-6 py-3 border border-white/5 bg-transparent hover:bg-white/5 rounded-full transition-all text-[11px] uppercase font-mono tracking-[0.25em] text-white/70 hover:text-white"
              href="#contact"
            >
              <Mail className="h-3.5 w-3.5 text-white/60" />
              <span>{ui.hero.ctaSecondary}</span>
            </MagneticButton>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="flex flex-wrap gap-3 text-[10px] uppercase font-mono tracking-[0.25em] text-white/40 mt-6">
          {data.hero.highlights.map((item, index) => {
            const Icon = index === 0 ? Terminal : index === 1 ? Cpu : MapPin;
            return (
              <span
                key={item}
                className="hero-highlight inline-flex items-center gap-2 rounded-full border border-white/5 bg-[#0a0a0c]/40 backdrop-blur-md px-4 py-2 opacity-0"
              >
                <Icon className="h-3 w-3 text-white/50" />
                <span>{item}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10 opacity-60">
        <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-3 w-3 text-white/40" />
        </motion.div>
      </div>

    </section>
  );
}
