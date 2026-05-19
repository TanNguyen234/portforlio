"use client";

import { AnimatePresence, motion } from "framer-motion";
import GridDistortion from "@/components/effects/GridDistortion";
import SpectrumSweep from "@/components/effects/SpectrumSweep";
import BlocksBackdrop from "@/components/three/BlocksBackdrop";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import SkillsConstellation from "@/components/sections/SkillsConstellation";
import TechStack from "@/components/sections/TechStack";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import { usePortfolioData } from "@/lib/usePortfolioData";
import { useLocale } from "@/components/providers/LocaleProvider";
import { uiText } from "@/lib/i18n";
import { localizePortfolio } from "@/lib/portfolioLocale";

export default function HomePage() {
  const { data } = usePortfolioData();
  const { locale, toggleLocale } = useLocale();
  const t = uiText[locale];
  const localizedData = localizePortfolio(data, locale);

  const navItems = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.skills, href: "#skills" },
    { label: t.nav.tech, href: "#tech" },
    { label: t.nav.wins, href: "#achievements" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <div className="relative bg-black text-white">
      <GridDistortion />
      <SpectrumSweep />
      <BlocksBackdrop />

      <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="section-inner flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-[0.4em] text-white/70">
              {localizedData.hero.name}
            </div>
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-full border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 md:hidden"
            >
              {locale === "en" ? "VI" : "EN"}
            </button>
          </div>
          <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.3em] text-white/60 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
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
          <TechStack data={localizedData} ui={t} />
          <Achievements data={localizedData} ui={t} />
          <Contact data={localizedData} ui={t} />

          <footer className="section-inner py-12 text-xs uppercase tracking-[0.4em] text-white/40">
            {t.footer}
          </footer>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
