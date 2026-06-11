"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GridDistortion from "@/components/effects/GridDistortion";
import SpectrumSweep from "@/components/effects/SpectrumSweep";
import VortexScene from "@/components/three/VortexScene";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import SkillsConstellation from "@/components/sections/SkillsConstellation";
import Contact from "@/components/sections/Contact";
import { usePortfolioData } from "@/lib/usePortfolioData";
import { useLocale } from "@/components/providers/LocaleProvider";
import { uiText } from "@/lib/i18n";
import { localizePortfolio } from "@/lib/portfolioLocale";
import { FileText } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/BrandIcons";
import MatrixText from "@/components/ui/MatrixText";
import CyberShapes from "@/components/three/CyberShapes";
import BootScreen from "@/components/effects/BootScreen";
import HudOverlay from "@/components/effects/HudOverlay";

export default function HomePage() {
  const { data } = usePortfolioData();
  const { locale, toggleLocale } = useLocale();
  const [hasBooted, setHasBooted] = useState(false);
  const t = uiText[locale];
  const localizedData = localizePortfolio(data, locale);

  const navItems = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasBooted && (
          <BootScreen key="boot" onComplete={() => setHasBooted(true)} />
        )}
      </AnimatePresence>

      {hasBooted && (
        <div className="relative bg-black text-white min-h-screen">
          <GridDistortion />
          <SpectrumSweep />
          <VortexScene />
          <CyberShapes />
          <HudOverlay />

          <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur">
            <div className="section-inner flex items-center justify-between py-4">
              <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <div className="text-xs uppercase tracking-[0.4em] text-white/70 scroll-glitch-text">
                  <MatrixText text={localizedData.hero.name} triggerOnHover={true} />
                </div>
                <div className="flex items-center gap-4 md:hidden">
                  <a
                    href={localizedData.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  {localizedData.contact.linkedin ? (
                    <a
                      href={localizedData.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={toggleLocale}
                    className="rounded-full border border-white/15 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40"
                  >
                    {locale === "en" ? "VI" : "EN"}
                  </button>
                </div>
              </div>
              <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/60 md:flex">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-white scroll-glitch-text"
                  >
                    <MatrixText text={item.label} triggerOnHover={true} />
                  </a>
                ))}
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-4">
                  <a
                    href={localizedData.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  {localizedData.contact.linkedin ? (
                    <a
                      href={localizedData.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : null}
                  {localizedData.contact.cv ? (
                    <a
                      href={localizedData.contact.cv}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:border-white/30 hover:bg-white/10"
                      aria-label="Download CV"
                    >
                      <FileText className="h-3 w-3" />
                      <span>CV</span>
                    </a>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="rounded-full border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40"
                >
                  {locale === "en" ? "VI" : "EN"}
                </button>
              </nav>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.main
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Hero data={localizedData} ui={t} />
              <About data={localizedData} ui={t} />
              <ExperienceTimeline data={localizedData} ui={t} />
              <ProjectsShowcase data={localizedData} ui={t} />
              <SkillsConstellation data={localizedData} ui={t} />
              <Contact data={localizedData} ui={t} />

              <footer className="section-inner py-12 text-xs uppercase tracking-[0.4em] text-white/40">
                {t.footer}
              </footer>
            </motion.main>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
