"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { FileText, Menu, X, ArrowUpRight } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/BrandIcons";

export default function HomePage() {
  const { data } = usePortfolioData();
  const { locale, toggleLocale } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="relative min-h-screen bg-transparent text-[#f4f4f7] selection:bg-teal-500/20 selection:text-white overflow-hidden">
      {/* Looping Ambient 3D Video Background & Noise Overlay */}
      <video
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="bg-video-container"
      />
      <div className="grain-noise-overlay" />

      {/* Fluid Island Floating Header */}
      <header className="fixed top-6 left-0 right-0 z-40 w-full px-4 md:px-8 pointer-events-none flex justify-center">
        <motion.div
          className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-[#0a0a0c]/60 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Branding name */}
          <a
            href="#hero"
            className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/80 hover:text-white transition-colors"
          >
            {localizedData.hero.name}
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-[10px] uppercase font-mono tracking-[0.2em] text-white/60">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={localizedData.contact.github}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            {localizedData.contact.linkedin && (
              <a
                href={localizedData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {localizedData.contact.cv && (
              <a
                href={localizedData.contact.cv}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-[9px] uppercase font-mono tracking-[0.2em] text-white/80 bg-white/5 border border-white/10 rounded-full transition hover:bg-white/10 hover:border-white/20"
                aria-label="Download CV"
              >
                <FileText className="h-3 w-3" />
                <span>CV</span>
              </a>
            )}
            <button
              type="button"
              onClick={toggleLocale}
              className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 border border-white/10 rounded-full transition hover:border-white/30 hover:bg-white/5"
            >
              {locale === "en" ? "VI" : "EN"}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 border border-white/10 rounded-full transition hover:border-white/30"
            >
              {locale === "en" ? "VI" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white/80 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Fullscreen Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col justify-between bg-[#020203]/95 backdrop-blur-2xl p-8 pt-28 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Navigation links */}
            <nav className="flex flex-col gap-6 text-2xl uppercase tracking-[0.1em] font-sans font-light">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/5 pb-3 text-white/80 hover:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-5 w-5 text-white/40" />
                </motion.a>
              ))}
            </nav>

            {/* Footer and social details inside drawer */}
            <div className="flex flex-col gap-6 border-t border-white/5 pt-6">
              <div className="flex items-center gap-4">
                <a
                  href={localizedData.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-white/60 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>Github</span>
                </a>
                {localizedData.contact.linkedin && (
                  <a
                    href={localizedData.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-white/60 hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>Linkedin</span>
                  </a>
                )}
              </div>
              {localizedData.contact.cv && (
                <a
                  href={localizedData.contact.cv}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center items-center gap-2 py-3 text-xs uppercase font-mono tracking-widest text-white bg-white/5 border border-white/10 rounded-full"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download CV</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          id="hero"
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

          <footer className="section-inner py-16 text-center text-[10px] uppercase font-mono tracking-[0.4em] text-white/30 border-t border-white/5">
            {t.footer}
          </footer>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
