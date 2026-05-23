"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassBadge from "@/components/ui/GlassBadge";
import MagneticButton from "@/components/ui/MagneticButton";
import CyberCard from "@/components/ui/CyberCard";
import { ExternalLink, Eye, ChevronRight } from "lucide-react";
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

  return (
    <section
      id="projects"
      data-accent="#ff007f"
      className="section-shell"
    >
      <div className="section-inner grid gap-12">
        <SectionHeading
          eyebrow={ui.sections.projects.eyebrow}
          title={ui.sections.projects.title}
          description={ui.sections.projects.description}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {data.projects.map((project, index) => (
            <CyberCard
              key={project.title}
              accentColor="#ff007f"
              onClick={() => setActive(index)}
            >
              <div className="flex h-full flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    {project.period}
                  </p>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {ui.projects.caseStudy}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="text-sm text-white/70">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((item) => (
                    <GlassBadge key={item} label={item} />
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)]">
                    {ui.projects.expand}
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                  <MagneticButton className="border-white/20 bg-transparent text-[10px]">
                    {ui.projects.view}
                  </MagneticButton>
                </div>
              </div>
            </CyberCard>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="max-w-2xl w-full rounded-3xl border border-white/10 bg-[rgba(5,8,14,0.95)] p-8 text-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                      {data.projects[active].period}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      {data.projects[active].title}
                    </h3>
                  </div>
                  <button
                    className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setActive(null)}
                    type="button"
                  >
                    {ui.projects.close}
                  </button>
                </div>
                <p className="text-sm text-white/70">
                  {data.projects[active].description}
                </p>
                <ul className="grid gap-3 text-sm text-white/60">
                  {data.projects[active].highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-current)]" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {data.projects[active].stack.map((item) => (
                    <GlassBadge key={item} label={item} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                  <a
                    href={data.projects[active].link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[color:var(--accent-current)] hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    {ui.projects.visitGithub}
                  </a>
                  {data.projects[active].demoLink ? (
                    <a
                      href={data.projects[active].demoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-[#7cf4ff] hover:text-white transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      {ui.projects.visitDemo}
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

