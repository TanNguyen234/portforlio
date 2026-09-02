"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X, ArrowUpRight } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/BrandIcons";

interface HeaderImmersiveProps {
  name: string;
  navItems: { label: string; href: string }[];
  githubUrl: string;
  linkedinUrl?: string;
  cvUrl?: string;
  locale: "en" | "vi";
  toggleLocale: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function HeaderImmersive({
  name,
  navItems,
  githubUrl,
  linkedinUrl,
  cvUrl,
  locale,
  toggleLocale,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderImmersiveProps) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-white/10 bg-[#020204]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Identity */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-xs font-mono tracking-[0.25em] uppercase text-white/90 hover:text-white transition-colors focus-ring-immersive rounded-sm"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.6)]"
              aria-hidden="true"
            />
            <span className="font-medium">{name}</span>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-[0.2em] uppercase text-white/60"
          >
            {navItems.map((item, index) => {
              const num = String(index + 1).padStart(2, "0");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 transition-colors hover:text-white focus-ring-immersive rounded-sm py-1"
                >
                  <span
                    aria-hidden="true"
                    className="text-[9px] text-teal-400/70 group-hover:text-teal-300 transition-colors"
                  >
                    {num}
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white transition-colors focus-ring-immersive rounded-sm p-1"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 hover:text-white transition-colors focus-ring-immersive rounded-sm p-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {cvUrl && (
              <a
                href={cvUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-mono tracking-[0.2em] text-white/90 bg-white/5 border border-white/15 hover:border-teal-400/40 hover:bg-teal-500/10 transition-all focus-ring-immersive rounded-sm"
                aria-label="Download Curriculum Vitae"
              >
                <FileText className="h-3 w-3 text-teal-400" />
                <span>CV</span>
              </a>
            )}
            <button
              type="button"
              onClick={toggleLocale}
              className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all focus-ring-immersive rounded-sm"
              aria-label={`Switch language to ${locale === "en" ? "Vietnamese" : "English"}`}
            >
              {locale === "en" ? "VI" : "EN"}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-white/80 border border-white/15 rounded-sm"
            >
              {locale === "en" ? "VI" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors focus-ring-immersive rounded-sm"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-45 flex flex-col justify-between bg-[#020204]/98 backdrop-blur-3xl p-8 pt-24 md:hidden border-b border-white/10"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-6 pt-4">
              {navItems.map((item, idx) => {
                const num = String(idx + 1).padStart(2, "0");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-white/10 pb-3 text-lg uppercase font-mono tracking-[0.15em] text-white/85 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="text-xs text-teal-400 font-mono">
                        {num}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/40" />
                  </a>
                );
              })}
            </nav>

            <div className="flex flex-col gap-5 border-t border-white/10 pt-6">
              <div className="flex items-center gap-6">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-white/70 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-white/70 hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
              {cvUrl && (
                <a
                  href={cvUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center items-center gap-2 py-3 text-xs uppercase font-mono tracking-widest text-white bg-white/5 border border-white/15 rounded-sm"
                >
                  <FileText className="h-4 w-4 text-teal-400" />
                  <span>Download CV</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
