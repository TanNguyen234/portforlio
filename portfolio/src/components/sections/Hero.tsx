"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import HeroScene from "@/components/three/HeroScene";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { Eye, Mail, Terminal, Cpu, MapPin } from "lucide-react";
import { usePerformanceMode } from "@/lib/performance";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";
import CyberConsole from "@/components/ui/CyberConsole";

export default function Hero({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  const { isLowEnd } = usePerformanceMode();
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
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      
      tl.fromTo(
        ".hero-subhead",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      tl.fromTo(
        ".hero-btn-wrap",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-highlight",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
        "-=0.4"
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
      data-accent="#00f0ff"
      className="relative min-h-[92vh] overflow-hidden border-b border-white/5"
    >
      <div className="absolute inset-0">
        {isLowEnd ? (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(0,240,255,0.15),_transparent_60%)]" />
        ) : (
          <HeroScene />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,10,0.6),rgba(2,5,10,0.9))]" />
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full opacity-50 blur-3xl animated-gradient parallax-layer depth-3 velocity-blur" />

      <div className="section-inner relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[92vh] py-32">
        <div className="flex flex-col justify-center gap-10">
          <p className="hero-role text-xs uppercase tracking-[0.5em] text-white/60 opacity-0">
            <span className="cyber-glitch-text font-bold" data-text={data.hero.role}>
              {data.hero.role}
            </span>
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl leading-tight text-white scroll-glitch-text">
            <AnimatedText text={data.hero.headline} />
          </h1>

          <p className="hero-subhead max-w-2xl text-base md:text-lg text-[color:var(--muted)] opacity-0">
            {data.hero.subhead}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="hero-btn-wrap opacity-0">
              <MagneticButton 
                className="depth-1 parallax-layer flex items-center gap-2 border-[#00f0ff]/30 text-white hover:border-[#00f0ff]/80 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]" 
                href="#projects"
              >
                <Eye className="h-4 w-4 text-[#00f0ff]" />
                {ui.hero.ctaPrimary}
              </MagneticButton>
            </div>
            <div className="hero-btn-wrap opacity-0">
              <MagneticButton
                className="depth-2 parallax-layer border-[#ff007f]/30 bg-transparent flex items-center gap-2 hover:border-[#ff007f]/80 hover:shadow-[0_0_15px_rgba(255,0,127,0.25)]"
                href="#contact"
              >
                <Mail className="h-4 w-4 text-[#ff007f]" />
                {ui.hero.ctaSecondary}
              </MagneticButton>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
            {data.hero.highlights.map((item, index) => {
              const Icon = index === 0 ? Terminal : index === 1 ? Cpu : MapPin;
              return (
                <span
                  key={item}
                  className="hero-highlight inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 opacity-0"
                >
                  <Icon className="h-3.5 w-3.5 text-[#00f0ff]" />
                  {item}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CyberConsole data={data} ui={ui} />
        </div>
      </div>
    </section>
  );
}
