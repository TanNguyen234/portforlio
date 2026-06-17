"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassBadge from "@/components/ui/GlassBadge";
import MagneticButton from "@/components/ui/MagneticButton";
import { ExternalLink, Eye, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { Github } from "@/components/icons/BrandIcons";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";

export default function ProjectsShowcase({
  data,
  ui,
}: {
  data: PortfolioData;
  ui: UiText;
}) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const scroller = scrollerRef.current;
      if (!trigger || !scroller) return;

      const calculateScrollAmount = () => {
        return -(scroller.scrollWidth - window.innerWidth);
      };

      gsap.fromTo(
        scroller,
        { x: 0 },
        {
          x: calculateScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            pin: true,
            start: "top top",
            end: () => `+=${scroller.scrollWidth - window.innerWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: triggerRef }
  );

  return (
    <div
      ref={triggerRef}
      id="projects"
      className="relative w-full py-32 border-y border-white/5 bg-black/15 overflow-hidden"
    >
      <div
        ref={scrollerRef}
        className="flex gap-16 items-stretch px-[10vw] w-max select-none"
      >
        {/* Horizontal Heading Slide */}
        <div className="w-[85vw] md:w-[42vw] shrink-0 flex flex-col justify-center">
          <SectionHeading
            title={ui.sections.projects.title}
            description={ui.sections.projects.description}
          />
        </div>

        {/* Project Card Slides */}
        {data.projects.map((project, index) => (
          <div
            key={project.title}
            className="w-[85vw] md:w-[48vw] lg:w-[38vw] shrink-0 flex items-stretch"
          >
            <div
              onClick={() => setActive(index)}
              className="h-full w-full bg-[#0a0a0c]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/10 hover:bg-[#0a0a0c]/60 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                    {project.period}
                  </p>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase">
                    {ui.projects.caseStudy}
                  </span>
                </div>
                
                <h3 className="text-xl font-medium text-white/90 leading-snug">
                  {project.title}
                </h3>
                
                <p className="text-sm font-light text-white/60 leading-relaxed line-clamp-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.stack.slice(0, 3).map((item) => (
                    <GlassBadge key={item} label={item} />
                  ))}
                  {project.stack.length > 3 && (
                    <span className="text-[9px] font-mono text-white/30 self-center px-1">
                      +{project.stack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors">
                  {ui.projects.expand}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Slide-over Right Drawer */}
      <AnimatePresence>
        {active !== null && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              className="fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl bg-[#0a0a0c]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl flex flex-col h-full"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    {data.projects[active].period}
                  </span>
                  <h3 className="text-xl font-medium text-white mt-1">
                    {data.projects[active].title}
                  </h3>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="p-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-white/70 hover:text-white"
                  type="button"
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-6 scrollbar-none">
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-2">Overview</h4>
                  <p className="text-sm font-light text-white/70 leading-relaxed">
                    {data.projects[active].description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-4">Key Contributions</h4>
                  <ul className="grid gap-3.5 text-xs font-light text-white/60">
                    {data.projects[active].highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-3">Technologies used</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.projects[active].stack.map((item) => (
                      <GlassBadge key={item} label={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA links at bottom */}
              <div className="px-8 py-6 border-t border-white/5 bg-[#08080a]/50 flex gap-4">
                <a
                  href={data.projects[active].link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-full transition-all text-[11px] font-mono tracking-widest uppercase text-white"
                >
                  <Github className="h-4 w-4 text-white/70" />
                  <span>{ui.projects.visitGithub}</span>
                </a>
                {data.projects[active].demoLink && (
                  <a
                    href={data.projects[active].demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-teal-500/20 bg-teal-500/10 hover:bg-teal-500/15 rounded-full transition-all text-[11px] font-mono tracking-widest uppercase text-teal-300"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{ui.projects.visitDemo}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
