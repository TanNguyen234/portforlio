"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CaretRight, X, ArrowUpRight, Eye } from "@phosphor-icons/react";
import { Github } from "@/components/icons/BrandIcons";
import type { PortfolioData } from "@/lib/portfolio";
import type { UiText } from "@/lib/i18n";
import { useProjectsController } from "@/components/sections/shared/useProjectsController";
import { setActiveProjectIndex } from "@/components/three/immersive/sceneState";

interface ProjectsImmersiveProps {
  data: PortfolioData;
  ui: UiText;
}

export function ProjectsImmersive({ data, ui }: ProjectsImmersiveProps) {
  const { active, setActive, closeDrawer, triggerRef, scrollerRef } =
    useProjectsController({
      projectCount: data.projects.length,
      onActiveProjectChange: (index) => {
        setActiveProjectIndex(index);
      },
    });

  return (
    <div
      ref={triggerRef}
      id="projects"
      className="relative w-full py-28 md:py-36 border-y border-white/10 bg-[#020204]/60 overflow-hidden"
    >
      <div
        ref={scrollerRef}
        className="flex gap-16 items-stretch px-[10vw] w-max select-none"
      >
        {/* Horizontal Heading Slide */}
        <div className="w-[85vw] md:w-[38vw] shrink-0 flex flex-col justify-center gap-4">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-teal-400">
            Selected Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-[#f4f6f8] leading-tight">
            {ui.sections.projects.title}
          </h2>
          <p className="text-sm sm:text-base font-light text-slate-400 leading-relaxed max-w-md">
            {ui.sections.projects.description}
          </p>
        </div>

        {/* Project Poster Slides */}
        {data.projects.map((project, index) => {
          const num = String(index + 1).padStart(2, "0");
          return (
            <div
              key={project.title}
              className="w-[85vw] md:w-[48vw] lg:w-[40vw] shrink-0 flex items-stretch"
            >
              <div
                onClick={() => setActive(index)}
                className="group h-full w-full border border-white/10 hover:border-teal-400/40 bg-[#05060a]/80 backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 focus-ring-immersive rounded-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(index);
                  }
                }}
                aria-label={`View case study for ${project.title}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Top Bar: Index & Period */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span
                      aria-hidden="true"
                      className="text-2xl font-mono font-light text-teal-400"
                    >
                      {num}
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
                      {project.period}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-light text-white group-hover:text-teal-300 transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-sm font-light text-slate-400 leading-relaxed line-clamp-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase text-white/70 bg-white/5 border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Indicator */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-white/70 group-hover:text-teal-300 transition-colors">
                    <span>{ui.projects.caseStudy}</span>
                    <CaretRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" weight="light" />
                  </span>
                  <div className="h-8 w-8 border border-white/15 flex items-center justify-center group-hover:border-teal-400/40 group-hover:bg-teal-500/10 transition-colors">
                    <ArrowUpRight className="h-4 w-4 text-white/70 group-hover:text-teal-300 transition-colors" weight="light" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Study Slide-over Drawer */}
      <AnimatePresence>
        {active !== null && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              className="fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-2xl bg-[#030406] border-l border-white/15 shadow-2xl flex flex-col h-full"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              role="dialog"
              aria-modal="true"
              aria-label={data.projects[active].title}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase">
                    {data.projects[active].period}
                  </span>
                  <h3 className="text-xl font-normal text-white mt-1">
                    {data.projects[active].title}
                  </h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2.5 border border-white/15 hover:border-teal-400/40 hover:bg-white/5 transition-all text-white/70 hover:text-white focus-ring-immersive rounded-sm"
                  type="button"
                  aria-label="Close case study drawer"
                >
                  <X className="h-4 w-4" weight="light" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-8 scrollbar-none">
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase mb-3">
                    Overview
                  </h4>
                  <p className="text-sm font-light text-slate-300 leading-relaxed">
                    {data.projects[active].description}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase mb-4">
                    Key Contributions
                  </h4>
                  <ul className="flex flex-col gap-3.5 text-xs font-light text-slate-300">
                    {data.projects[active].highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-3 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1 w-1 bg-teal-400 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase mb-3">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.projects[active].stack.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/80 bg-white/5 border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA links */}
              <div className="px-8 py-6 border-t border-white/10 bg-[#020203] flex gap-4">
                <a
                  href={data.projects[active].link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all text-xs font-mono tracking-widest uppercase text-white focus-ring-immersive rounded-sm"
                >
                  <Github className="h-4 w-4 text-white/70" />
                  <span>{ui.projects.visitGithub}</span>
                </a>
                {data.projects[active].demoLink && (
                  <a
                    href={data.projects[active].demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-400 text-black font-semibold transition-all text-xs font-mono tracking-widest uppercase focus-ring-immersive rounded-sm shadow-[0_0_16px_rgba(20,184,166,0.3)]"
                  >
                    <Eye className="h-4 w-4" weight="light" />
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
